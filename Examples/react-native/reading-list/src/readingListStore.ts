// The reading list's state and transitions, without React. The screen subscribes through
// useSyncExternalStore; tests drive the store directly.

export interface Article {
  readonly id: string;
  readonly title: string;
  readonly isRead: boolean;
}

/** The data layer as the feature sees it; tests pass a fake, an app passes a real client. */
export interface ArticleRepository {
  fetchArticles(): Promise<readonly Article[]>;
  setRead(articleId: string, isRead: boolean): Promise<void>;
}

export type ListState =
  | { readonly status: 'idle' }
  | { readonly status: 'loading' }
  | { readonly status: 'empty' }
  | { readonly status: 'loaded'; readonly articles: readonly Article[] }
  | { readonly status: 'failed'; readonly message: string };

export interface ReadingListSnapshot {
  readonly list: ListState;
  /** Set when saving a toggle failed and the change was rolled back; cleared by the next toggle. */
  readonly saveError: string | null;
  readonly unreadCount: number;
}

export const LOAD_FAILED_MESSAGE = 'The reading list could not be loaded.';
export const SAVE_FAILED_MESSAGE = 'The change could not be saved. Try again.';

export interface ReadingListStore {
  getSnapshot(): ReadingListSnapshot;
  subscribe(listener: () => void): () => void;
  load(): Promise<void>;
  toggleRead(articleId: string): Promise<void>;
}

export function createReadingListStore(repository: ArticleRepository): ReadingListStore {
  // A new object per change and the same object otherwise, as useSyncExternalStore requires.
  let snapshot = makeSnapshot({ status: 'idle' }, null);
  const listeners = new Set<() => void>();
  const pendingSaves = new Set<string>();

  const emit = (list: ListState, saveError: string | null): void => {
    snapshot = makeSnapshot(list, saveError);
    for (const listener of [...listeners]) listener();
  };

  return {
    getSnapshot: () => snapshot,

    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },

    // A call while a load is running is ignored, so a double tap on Retry sends one request.
    async load() {
      if (snapshot.list.status === 'loading') return;
      emit({ status: 'loading' }, snapshot.saveError);
      try {
        const articles = await repository.fetchArticles();
        emit(
          articles.length === 0
            ? { status: 'empty' }
            : { status: 'loaded', articles: [...articles] },
          snapshot.saveError,
        );
      } catch {
        // The repository's error can carry URLs or server text; the screen shows a fixed sentence.
        emit({ status: 'failed', message: LOAD_FAILED_MESSAGE }, snapshot.saveError);
      }
    },

    // Flips the flag at once; a failed save puts back only this article.
    async toggleRead(articleId) {
      const { list } = snapshot;
      if (list.status !== 'loaded' || pendingSaves.has(articleId)) return;
      const article = list.articles.find((a) => a.id === articleId);
      if (!article) return;

      const newValue = !article.isRead;
      pendingSaves.add(articleId);
      emit({ status: 'loaded', articles: withRead(list.articles, articleId, newValue) }, null);
      try {
        await repository.setRead(articleId, newValue);
      } catch {
        const latest = snapshot.list;
        if (latest.status === 'loaded') {
          emit(
            {
              status: 'loaded',
              articles: withRead(latest.articles, articleId, !newValue),
            },
            SAVE_FAILED_MESSAGE,
          );
        }
      } finally {
        pendingSaves.delete(articleId);
      }
    },
  };
}

function withRead(articles: readonly Article[], id: string, isRead: boolean): Article[] {
  return articles.map((a) => (a.id === id ? { ...a, isRead } : a));
}

function makeSnapshot(list: ListState, saveError: string | null): ReadingListSnapshot {
  const unreadCount = list.status === 'loaded' ? list.articles.filter((a) => !a.isRead).length : 0;
  return { list, saveError, unreadCount };
}

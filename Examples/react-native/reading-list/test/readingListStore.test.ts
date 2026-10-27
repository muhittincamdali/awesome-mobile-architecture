import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  LOAD_FAILED_MESSAGE,
  SAVE_FAILED_MESSAGE,
  createReadingListStore,
  type Article,
  type ArticleRepository,
  type ReadingListStore,
} from '../src/readingListStore.ts';
import { createSampleRepository } from '../src/sampleRepository.ts';

interface Deferred<T> {
  promise: Promise<T>;
  resolve: (value: T) => void;
  reject: (error: unknown) => void;
}

function deferred<T>(): Deferred<T> {
  let resolve!: (value: T) => void;
  let reject!: (error: unknown) => void;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
}

/** Calls stay pending until the test settles them, so the test decides the completion order. */
class ControlledRepository implements ArticleRepository {
  fetches: Deferred<readonly Article[]>[] = [];
  saves = new Map<string, Deferred<void>>();
  saveCalls: Array<[string, boolean]> = [];

  fetchArticles() {
    const call = deferred<readonly Article[]>();
    this.fetches.push(call);
    return call.promise;
  }

  setRead(articleId: string, isRead: boolean) {
    this.saveCalls.push([articleId, isRead]);
    const call = deferred<void>();
    this.saves.set(articleId, call);
    return call.promise;
  }

  save(id: string): Deferred<void> {
    const call = this.saves.get(id);
    if (!call) throw new Error(`no pending save for ${id}`);
    return call;
  }
}

const ARTICLES: readonly Article[] = [
  { id: 'a', title: 'First', isRead: false },
  { id: 'b', title: 'Second', isRead: true },
  { id: 'c', title: 'Third', isRead: false },
];

let repository: ControlledRepository;
let store: ReadingListStore;

const isRead = (id: string) => {
  const { list } = store.getSnapshot();
  return list.status === 'loaded' ? list.articles.find((a) => a.id === id)?.isRead : undefined;
};

async function loadArticles(): Promise<void> {
  const load = store.load();
  repository.fetches[0]?.resolve(ARTICLES);
  await load;
}

beforeEach(() => {
  repository = new ControlledRepository();
  store = createReadingListStore(repository);
});

describe('loading', () => {
  it('shows the articles and counts the unread ones', async () => {
    const load = store.load();
    expect(store.getSnapshot().list.status).toBe('loading');
    repository.fetches[0]?.resolve(ARTICLES);
    await load;
    expect(store.getSnapshot()).toEqual({
      list: { status: 'loaded', articles: ARTICLES },
      saveError: null,
      unreadCount: 2,
    });
  });

  it('shows the empty state for an empty answer', async () => {
    const load = store.load();
    repository.fetches[0]?.resolve([]);
    await load;
    expect(store.getSnapshot().list).toEqual({ status: 'empty' });
  });

  it('shows a fixed message instead of the error text', async () => {
    const load = store.load();
    repository.fetches[0]?.reject(new Error('https://api.internal/?token=abc'));
    await load;
    expect(store.getSnapshot().list).toEqual({
      status: 'failed',
      message: LOAD_FAILED_MESSAGE,
    });
  });

  it('loads again on retry after a failure', async () => {
    const first = store.load();
    repository.fetches[0]?.reject(new Error('offline'));
    await first;
    const second = store.load();
    repository.fetches[1]?.resolve(ARTICLES);
    await second;
    expect(store.getSnapshot().list.status).toBe('loaded');
    expect(repository.fetches).toHaveLength(2);
  });

  it('sends no second request while a load is running', async () => {
    const first = store.load();
    await store.load();
    expect(repository.fetches).toHaveLength(1);
    repository.fetches[0]?.resolve(ARTICLES);
    await first;
  });
});

describe('marking as read', () => {
  it('shows the change at once and saves the new value', async () => {
    await loadArticles();
    const toggle = store.toggleRead('a');
    expect(isRead('a')).toBe(true);
    expect(store.getSnapshot().unreadCount).toBe(1);
    repository.save('a').resolve();
    await toggle;
    expect(isRead('a')).toBe(true);
    expect(store.getSnapshot().saveError).toBeNull();
    expect(repository.saveCalls).toEqual([['a', true]]);
  });

  it('puts the article back and explains why when the save fails', async () => {
    await loadArticles();
    const toggle = store.toggleRead('b');
    expect(isRead('b')).toBe(false);
    repository.save('b').reject(new Error('500'));
    await toggle;
    expect(isRead('b')).toBe(true);
    expect(store.getSnapshot().saveError).toBe(SAVE_FAILED_MESSAGE);
  });

  it('undoes only the failed article, not a toggle made meanwhile', async () => {
    await loadArticles();
    const first = store.toggleRead('a');
    const second = store.toggleRead('c');
    repository.save('a').reject(new Error('timeout'));
    repository.save('c').resolve();
    await Promise.all([first, second]);
    expect(isRead('a')).toBe(false);
    expect(isRead('c')).toBe(true);
  });

  it('ignores a toggle while the same article is still saving', async () => {
    await loadArticles();
    const first = store.toggleRead('a');
    await store.toggleRead('a');
    expect(isRead('a')).toBe(true);
    repository.save('a').resolve();
    await first;
    expect(repository.saveCalls).toHaveLength(1);
  });

  it('clears an earlier save error on the next toggle', async () => {
    await loadArticles();
    const failing = store.toggleRead('a');
    repository.save('a').reject(new Error('x'));
    await failing;
    expect(store.getSnapshot().saveError).not.toBeNull();
    const next = store.toggleRead('c');
    expect(store.getSnapshot().saveError).toBeNull();
    repository.save('c').resolve();
    await next;
  });

  it('leaves unknown articles and unloaded lists alone', async () => {
    await store.toggleRead('a');
    expect(store.getSnapshot().list).toEqual({ status: 'idle' });
    await loadArticles();
    await store.toggleRead('missing');
    expect(repository.saveCalls).toEqual([]);
  });
});

describe('subscriptions', () => {
  it('keeps the same snapshot object until something changes', async () => {
    const before = store.getSnapshot();
    expect(store.getSnapshot()).toBe(before);
    await store.toggleRead('a');
    expect(store.getSnapshot()).toBe(before);
    const load = store.load();
    expect(store.getSnapshot()).not.toBe(before);
    repository.fetches[0]?.resolve(ARTICLES);
    await load;
  });

  it('notifies subscribers on each change and stops after unsubscribe', async () => {
    const listener = vi.fn();
    const unsubscribe = store.subscribe(listener);
    await loadArticles();
    expect(listener).toHaveBeenCalledTimes(2);
    unsubscribe();
    const toggle = store.toggleRead('a');
    repository.save('a').resolve();
    await toggle;
    expect(listener).toHaveBeenCalledTimes(2);
  });

  it('lets a listener unsubscribe itself while being notified', async () => {
    const calls: string[] = [];
    const unsubscribeFirst = store.subscribe(() => {
      calls.push('first');
      unsubscribeFirst();
    });
    store.subscribe(() => calls.push('second'));
    await loadArticles();
    expect(calls).toEqual(['first', 'second', 'second']);
  });
});

describe('sample repository', () => {
  it('keeps saves for the next fetch', async () => {
    const sample = createSampleRepository(ARTICLES);
    await sample.setRead('a', true);
    await sample.setRead('unknown', true);
    const fetched = await sample.fetchArticles();
    expect(fetched.find((a) => a.id === 'a')?.isRead).toBe(true);
    expect(fetched).toHaveLength(ARTICLES.length);
  });
});

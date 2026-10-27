import type { Article, ArticleRepository } from './readingListStore.ts';

export const DEMO_ARTICLES: readonly Article[] = [
  { id: 'observation', title: 'Managing model data in your app', isRead: true },
  { id: 'scenes', title: 'Migrating to the UIKit scene-based life cycle', isRead: false },
  { id: 'concurrency', title: 'Swift 6 migration guide', isRead: false },
  { id: 'flutter', title: 'Guide to app architecture (Flutter)', isRead: false },
  { id: 'react', title: 'Managing state (React)', isRead: false },
];

/** In-memory repository for demos and previews. */
export function createSampleRepository(
  initial: readonly Article[] = DEMO_ARTICLES,
  delayMs = 0,
): ArticleRepository {
  let articles = [...initial];
  const wait = () => new Promise<void>((resolve) => setTimeout(resolve, delayMs));
  return {
    async fetchArticles() {
      await wait();
      return articles;
    },
    async setRead(articleId, isRead) {
      await wait();
      articles = articles.map((a) => (a.id === articleId ? { ...a, isRead } : a));
    },
  };
}

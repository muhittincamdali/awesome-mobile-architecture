import { useEffect, useSyncExternalStore } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import type { Article, ReadingListStore } from './readingListStore.ts';

/** Subscribes a component to the store; it re-renders only when the snapshot changes. */
export function useReadingList(store: ReadingListStore) {
  return useSyncExternalStore(store.subscribe, store.getSnapshot);
}

/** The screen; place it inside the app's safe-area container. It renders the store's snapshot and forwards taps; it holds no state of its own. */
export function ReadingListScreen({ store }: { store: ReadingListStore }) {
  const { list, saveError, unreadCount } = useReadingList(store);

  useEffect(() => {
    void store.load();
  }, [store]);

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.title} accessibilityRole="header">
          Reading list
        </Text>
        {unreadCount > 0 && <Text style={styles.secondary}>{unreadCount} unread</Text>}
      </View>
      {list.status === 'idle' || list.status === 'loading' ? (
        <ActivityIndicator style={styles.center} accessibilityLabel="Loading" />
      ) : list.status === 'empty' ? (
        <Text style={styles.center}>Nothing saved yet</Text>
      ) : list.status === 'failed' ? (
        <View style={styles.center}>
          <Text>{list.message}</Text>
          <Pressable accessibilityRole="button" onPress={() => void store.load()}>
            <Text style={styles.button}>Retry</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={list.articles}
          keyExtractor={(article) => article.id}
          renderItem={({ item }) => (
            <ArticleRow article={item} onToggle={() => void store.toggleRead(item.id)} />
          )}
        />
      )}
      {saveError !== null && <Text style={styles.banner}>{saveError}</Text>}
    </View>
  );
}

function ArticleRow({ article, onToggle }: { article: Article; onToggle: () => void }) {
  return (
    <Pressable
      onPress={onToggle}
      style={styles.row}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: article.isRead }}
      accessibilityLabel={article.title}
    >
      <Text style={styles.check}>{article.isRead ? '●' : '○'}</Text>
      <Text style={article.isRead ? styles.secondary : undefined}>{article.title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    padding: 16,
  },
  title: { fontSize: 28, fontWeight: '700' },
  secondary: { opacity: 0.6 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  row: { flexDirection: 'row', gap: 12, paddingHorizontal: 16, paddingVertical: 12 },
  check: { width: 20 },
  button: { fontWeight: '600', padding: 8 },
  banner: {
    margin: 16,
    padding: 16,
    borderRadius: 12,
    textAlign: 'center',
    backgroundColor: '#EAF4FF',
  },
});

// Runs the reading list screen as an app. scripts/capture-react-native-example.sh places this file
// in a React Native app made from the official template and takes the screenshots with it.

import { useMemo } from 'react';
import { Platform, Settings, StatusBar, StyleSheet } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { ReadingListScreen } from '../src/ReadingListScreen.tsx';
import { createReadingListStore, type ArticleRepository } from '../src/readingListStore.ts';
import { createSampleRepository } from '../src/sampleRepository.ts';

const RESPONSE_DELAY_MS = 300;

/** Fails every call, like a device without a connection. */
const unreachableRepository: ArticleRepository = {
  fetchArticles: () => Promise.reject(new Error('offline')),
  setRead: () => Promise.reject(new Error('offline')),
};

/**
 * `-scenario empty` or `-scenario failed` on launch shows the other states of the screen, as in
 * the Swift app: iOS puts launch arguments into the user defaults that `Settings` reads.
 */
function repositoryForLaunch(): ArticleRepository {
  const scenario: unknown = Platform.OS === 'ios' ? Settings.get('scenario') : undefined;
  if (scenario === 'failed') return unreachableRepository;
  if (scenario === 'empty') return createSampleRepository([], RESPONSE_DELAY_MS);
  return createSampleRepository(undefined, RESPONSE_DELAY_MS);
}

export default function App() {
  const store = useMemo(() => createReadingListStore(repositoryForLaunch()), []);
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.root}>
        <ReadingListScreen store={store} />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

// The screen sets no colours of its own, so the app keeps a light background in either appearance.
const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#FFFFFF' },
});

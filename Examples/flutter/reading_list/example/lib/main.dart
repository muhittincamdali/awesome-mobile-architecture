import 'package:flutter/material.dart';
import 'package:reading_list/reading_list.dart';

/// `--dart-define=SCENARIO=empty` or `--dart-define=SCENARIO=failed` shows the other states of the
/// screen; the screenshot script uses it. Without it the app shows the demo articles.
const scenario = String.fromEnvironment('SCENARIO', defaultValue: 'loaded');

/// The blue of the repository's brand, used as the seed of both colour schemes.
const brandBlue = Color(0xFF0058D4);

/// The fidelity variant keeps the seed's hue, where the default one drifts towards violet.
ColorScheme brandScheme(Brightness brightness) => ColorScheme.fromSeed(
  seedColor: brandBlue,
  brightness: brightness,
  dynamicSchemeVariant: DynamicSchemeVariant.fidelity,
);

void main() {
  runApp(ReadingListApp(repository: repositoryFor(scenario)));
}

ArticleRepository repositoryFor(String scenario) {
  const delay = Duration(milliseconds: 300);
  return switch (scenario) {
    'empty' => SampleRepository(articles: const [], delay: delay),
    'failed' => const UnreachableRepository(),
    _ => SampleRepository(delay: delay),
  };
}

class ReadingListApp extends StatefulWidget {
  const ReadingListApp({super.key, required this.repository});

  final ArticleRepository repository;

  @override
  State<ReadingListApp> createState() => _ReadingListAppState();
}

class _ReadingListAppState extends State<ReadingListApp> {
  late final viewModel = ReadingListViewModel(widget.repository);

  @override
  void initState() {
    super.initState();
    viewModel.load();
  }

  @override
  void dispose() {
    viewModel.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Reading list',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(colorScheme: brandScheme(Brightness.light)),
      darkTheme: ThemeData(colorScheme: brandScheme(Brightness.dark)),
      home: ReadingListView(viewModel: viewModel),
    );
  }
}

/// Fails every call, like a device without a connection.
class UnreachableRepository implements ArticleRepository {
  const UnreachableRepository();

  @override
  Future<List<Article>> fetchArticles() => Future.error(const Offline());

  @override
  Future<void> setRead(String articleId, {required bool isRead}) =>
      Future.error(const Offline());
}

class Offline implements Exception {
  const Offline();
}

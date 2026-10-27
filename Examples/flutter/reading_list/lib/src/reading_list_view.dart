import 'package:flutter/material.dart';

import 'reading_list_state.dart';
import 'reading_list_view_model.dart';

/// The screen. It renders [ReadingListViewModel.state] and forwards taps; it holds no state.
class ReadingListView extends StatelessWidget {
  const ReadingListView({super.key, required this.viewModel});

  final ReadingListViewModel viewModel;

  @override
  Widget build(BuildContext context) {
    return ListenableBuilder(
      listenable: viewModel,
      builder: (context, _) => Scaffold(
        appBar: AppBar(
          title: const Text('Reading list'),
          actions: [
            if (viewModel.unreadCount > 0)
              Padding(
                padding: const EdgeInsets.only(right: 16),
                child: Center(child: Text('${viewModel.unreadCount} unread')),
              ),
          ],
        ),
        body: _body(context),
        bottomNavigationBar: viewModel.saveError == null
            ? null
            : SafeArea(
                child: Container(
                  margin: const EdgeInsets.all(16),
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: Theme.of(context).colorScheme.primaryContainer,
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Text(
                    viewModel.saveError!,
                    textAlign: TextAlign.center,
                    style: TextStyle(
                      color: Theme.of(context).colorScheme.onPrimaryContainer,
                    ),
                  ),
                ),
              ),
      ),
    );
  }

  Widget _body(BuildContext context) {
    return switch (viewModel.state) {
      ReadingListIdle() || ReadingListLoading() => const Center(
        child: CircularProgressIndicator(semanticsLabel: 'Loading'),
      ),
      ReadingListEmpty() => const Center(child: Text('Nothing saved yet')),
      ReadingListFailed(:final message) => Center(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(message),
            const SizedBox(height: 12),
            FilledButton(onPressed: viewModel.load, child: const Text('Retry')),
          ],
        ),
      ),
      ReadingListLoaded(:final articles) => ListView(
        children: [
          for (final article in articles)
            CheckboxListTile(
              key: ValueKey(article.id),
              value: article.isRead,
              title: Text(article.title),
              controlAffinity: ListTileControlAffinity.leading,
              onChanged: (_) => viewModel.toggleRead(article.id),
            ),
        ],
      ),
    };
  }
}

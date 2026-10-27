#!/usr/bin/env bash
# Captures the README screenshots of the Flutter reading list example on an iPhone simulator.
#
# The repository keeps only the Dart side of the example app (Examples/flutter/reading_list/example).
# The script copies it to a build folder, lets `flutter create` add the iOS runner there, builds
# one app per scenario (`--dart-define=SCENARIO=loaded|failed`), launches each in light and dark
# appearance with a fixed status bar, and saves a simulator screenshot of each.
#
# Usage: scripts/capture-flutter-example.sh [simulator UDID]
# Without an argument it uses (and creates when missing) a simulator named "ReadingList Example"
# so simulators of other projects are left alone. Output: docs/images/
set -euo pipefail

repo_root="$(cd "$(dirname "$0")/.." && pwd)"
device="${1:-}"
if [[ -z "$device" ]]; then
  name="ReadingList Example"
  device="$(xcrun simctl list devices available | grep -F "$name (" | grep -m1 -oE '[0-9A-F-]{36}' || true)"
  if [[ -z "$device" ]]; then
    runtime="$(xcrun simctl list runtimes available | grep -oE 'com\.apple\.CoreSimulator\.SimRuntime\.iOS-[0-9-]+' | tail -1)"
    device="$(xcrun simctl create "$name" com.apple.CoreSimulator.SimDeviceType.iPhone-17-Pro "$runtime")"
  fi
fi
if [[ ! "$device" =~ ^[0-9A-F-]{36}$ ]]; then
  echo "Pass a simulator UDID (xcrun simctl list devices)." >&2
  exit 1
fi

package_dir="$repo_root/Examples/flutter/reading_list"
scenarios=(loaded failed)
output_dir="$repo_root/docs/images"
build_dir="$(mktemp -d "${TMPDIR:-$HOME}/readinglist-flutter.XXXXXX")"
trap 'rm -rf "$build_dir"' EXIT
mkdir -p "$output_dir"

# The copy points at the package by absolute path, because it no longer sits next to it.
app_dir="$build_dir/reading_list_example"
mkdir -p "$app_dir"
cp -R "$package_dir/example/lib" "$app_dir/lib"
sed "s|path: \.\./|path: '$package_dir'|" "$package_dir/example/pubspec.yaml" >"$app_dir/pubspec.yaml"
(cd "$app_dir" && flutter create --platforms=ios --org io.github.muhittincamdali . >/dev/null)
# The Flutter 3.41 runner targets iOS 13, below what current Xcode builds for (15 and later), and
# its check of the two-architecture simulator framework fails there; build iOS 17 for this Mac only.
sed -i '' 's/IPHONEOS_DEPLOYMENT_TARGET = 1[0-6]\.0;/IPHONEOS_DEPLOYMENT_TARGET = 17.0;/' \
  "$app_dir/ios/Runner.xcodeproj/project.pbxproj"
printf 'ARCHS=%s\n' "$(uname -m)" >>"$app_dir/ios/Flutter/Debug.xcconfig"

xcrun simctl boot "$device" 2>/dev/null || true
xcrun simctl bootstatus "$device" -b >/dev/null
xcrun simctl status_bar "$device" override --time 9:41 --batteryState charged --batteryLevel 100 \
  --cellularBars 4 --wifiBars 3 --operatorName ""

for scenario in "${scenarios[@]}"; do
  (cd "$app_dir" && flutter build ios --simulator --debug --dart-define="SCENARIO=$scenario" >/dev/null)
  app="$app_dir/build/ios/iphonesimulator/Runner.app"
  bundle_id="$(/usr/libexec/PlistBuddy -c 'Print :CFBundleIdentifier' "$app/Info.plist")"
  xcrun simctl install "$device" "$app"
  for appearance in light dark; do
    xcrun simctl ui "$device" appearance "$appearance"
    xcrun simctl launch --terminate-running-process "$device" "$bundle_id" >/dev/null
    sleep 6 # a debug build starts slower than the Swift app; the repository answers after 300 ms
    file="$output_dir/reading-list-flutter-$scenario-$appearance.png"
    xcrun simctl io "$device" screenshot --type=png "$file" >/dev/null 2>&1
    # A third of the screenshot width keeps the README light and is still sharp at 300 points.
    sips --resampleWidth 402 "$file" >/dev/null
    echo "$file"
  done
  xcrun simctl terminate "$device" "$bundle_id" 2>/dev/null || true
done

xcrun simctl status_bar "$device" clear

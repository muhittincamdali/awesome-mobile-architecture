#!/usr/bin/env bash
# Captures the README screenshots of the React Native reading list example on an iPhone simulator.
#
# The repository keeps the feature and a small App component (Examples/react-native/reading-list),
# not a native project. The script makes an app from the official React Native template in a build
# folder (same React Native version as the example's package.json), copies the feature into it,
# builds a Release app for the simulator so the JavaScript is bundled, launches it once per
# scenario (`-scenario loaded|failed`) with a fixed status bar and saves a screenshot of each. The
# screen sets no colours of its own, so only the light appearance is captured.
#
# Usage: scripts/capture-react-native-example.sh [simulator UDID]
# Without an argument it uses (and creates when missing) a simulator named "ReadingList Example"
# so simulators of other projects are left alone. Needs Node 24, Xcode 27 and CocoaPods.
# Output: docs/images/
set -euo pipefail

cli_version="20.2.0" # @react-native-community/cli that ships the template for this version

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

package_dir="$repo_root/Examples/react-native/reading-list"
rn_version="$(node -p "require('$package_dir/package.json').dependencies['react-native']")"
scenarios=(loaded failed)
output_dir="$repo_root/docs/images"
build_dir="$(mktemp -d "${TMPDIR:-$HOME}/readinglist-rn.XXXXXX")"
trap 'rm -rf "$build_dir"' EXIT
mkdir -p "$output_dir"

app_dir="$build_dir/ReadingListExample"
npx --yes "@react-native-community/cli@$cli_version" init ReadingListExample \
  --version "$rn_version" --directory "$app_dir" --skip-git-init --install-pods true --pm npm \
  >/dev/null
cp -R "$package_dir/src" "$app_dir/src"
mkdir -p "$app_dir/example"
cp "$package_dir/example/App.tsx" "$app_dir/example/App.tsx"
sed -i '' "s|from './App'|from './example/App.tsx'|" "$app_dir/index.js"

xcodebuild build \
  -workspace "$app_dir/ios/ReadingListExample.xcworkspace" \
  -scheme ReadingListExample \
  -configuration Release \
  -destination "platform=iOS Simulator,id=$device" \
  -derivedDataPath "$build_dir/DerivedData" \
  -quiet
app="$(find "$build_dir/DerivedData/Build/Products" -maxdepth 2 -name 'ReadingListExample.app' -path '*iphonesimulator*' | head -1)"
bundle_id="$(/usr/libexec/PlistBuddy -c 'Print :CFBundleIdentifier' "$app/Info.plist")"

xcrun simctl boot "$device" 2>/dev/null || true
xcrun simctl bootstatus "$device" -b >/dev/null
xcrun simctl status_bar "$device" override --time 9:41 --batteryState charged --batteryLevel 100 \
  --cellularBars 4 --wifiBars 3 --operatorName ""
xcrun simctl ui "$device" appearance light
xcrun simctl install "$device" "$app"

for scenario in "${scenarios[@]}"; do
  xcrun simctl launch --terminate-running-process "$device" "$bundle_id" -scenario "$scenario" >/dev/null
  sleep 5 # the sample repository answers after 300 ms; leave time for launch and first layout
  file="$output_dir/reading-list-react-native-$scenario-light.png"
  xcrun simctl io "$device" screenshot --type=png "$file" >/dev/null 2>&1
  # A third of the screenshot width keeps the README light and is still sharp at 300 points.
  sips --resampleWidth 402 "$file" >/dev/null
  echo "$file"
done

xcrun simctl status_bar "$device" clear
xcrun simctl terminate "$device" "$bundle_id" 2>/dev/null || true

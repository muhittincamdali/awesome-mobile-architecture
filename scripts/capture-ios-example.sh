#!/usr/bin/env bash
# Captures the README screenshots of the iOS reading list example on an iPhone simulator.
#
# The list is drawn by UIKit-backed SwiftUI views, which ImageRenderer cannot draw, so the images
# come from the running app: the script builds and installs Examples/ios/ReadingListApp, launches
# it once per scenario (`-scenario loaded|failed`) in light and dark appearance with a fixed status
# bar, and saves a simulator screenshot of each.
#
# Usage: scripts/capture-ios-example.sh [simulator UDID]
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

bundle_id="io.github.muhittincamdali.ReadingListApp"
scenarios=(loaded failed)
output_dir="$repo_root/docs/images"
build_dir="$(mktemp -d "${TMPDIR:-$HOME}/readinglist-build.XXXXXX")"
trap 'rm -rf "$build_dir"' EXIT
mkdir -p "$output_dir"

xcodebuild build \
  -project "$repo_root/Examples/ios/ReadingListApp/ReadingListApp.xcodeproj" \
  -scheme ReadingListApp \
  -destination "platform=iOS Simulator,id=$device" \
  -derivedDataPath "$build_dir" \
  -quiet
app="$(find "$build_dir/Build/Products" -maxdepth 2 -name 'ReadingListApp.app' -path '*iphonesimulator*' | head -1)"

xcrun simctl boot "$device" 2>/dev/null || true
xcrun simctl bootstatus "$device" -b >/dev/null
xcrun simctl status_bar "$device" override --time 9:41 --batteryState charged --batteryLevel 100 \
  --cellularBars 4 --wifiBars 3 --operatorName ""
xcrun simctl install "$device" "$app"

for appearance in light dark; do
  xcrun simctl ui "$device" appearance "$appearance"
  for scenario in "${scenarios[@]}"; do
    xcrun simctl launch --terminate-running-process "$device" "$bundle_id" -scenario "$scenario" >/dev/null
    sleep 4 # the sample repository answers after 300 ms; leave time for launch and first layout
    file="$output_dir/reading-list-ios-$scenario-$appearance.png"
    xcrun simctl io "$device" screenshot --type=png "$file" >/dev/null 2>&1
    # A third of the screenshot width keeps the README light and is still sharp at 300 points.
    sips --resampleWidth 402 "$file" >/dev/null
    echo "$file"
  done
done

xcrun simctl status_bar "$device" clear
xcrun simctl terminate "$device" "$bundle_id" 2>/dev/null || true

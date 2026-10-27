// swift-tools-version: 6.2
import PackageDescription

let package = Package(
    name: "ReadingList",
    platforms: [.iOS(.v17), .macOS(.v14)],
    products: [
        .library(name: "ReadingList", targets: ["ReadingList"])
    ],
    targets: [
        .target(name: "ReadingList"),
        .testTarget(name: "ReadingListTests", dependencies: ["ReadingList"]),
    ]
)

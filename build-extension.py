#!/usr/bin/env python3
"""Build a correctly laid-out unsigned XPI/ZIP for the new-tab extension.

manifest.json is placed at the root of the archive. Firefox rejects archives
where all files are nested inside a repository folder.
"""

from pathlib import Path
from zipfile import ZIP_DEFLATED, ZipFile

ROOT = Path(__file__).resolve().parent
OUT = ROOT / "dist" / "custom-new-tab-1.0.1.xpi"

FILES = [
    "manifest.json",
    "index.html",
    "index.css",
    "index.js",
    "404.html",
]
DIRS = [
    "Assets/icons",
    "Assets/wallpapers",
]


def main():
    OUT.parent.mkdir(parents=True, exist_ok=True)
    with ZipFile(OUT, "w", ZIP_DEFLATED, compresslevel=9) as zf:
        for name in FILES:
            path = ROOT / name
            if not path.is_file():
                raise SystemExit("Missing required file: %s" % name)
            zf.write(path, name)

        for dirname in DIRS:
            base = ROOT / dirname
            if not base.is_dir():
                raise SystemExit("Missing required directory: %s" % dirname)
            for path in sorted(base.rglob("*")):
                if path.is_file() and "__MACOSX" not in path.parts:
                    zf.write(path, path.relative_to(ROOT).as_posix())

    print(OUT)


if __name__ == "__main__":
    main()

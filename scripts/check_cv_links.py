"""Verify that all deployed CV buttons match the PDF content hash (stdlib only)."""

import hashlib
from html.parser import HTMLParser
from pathlib import Path
import sys
from urllib.parse import parse_qs, urlsplit


ROOT = Path(__file__).resolve().parents[1]
CV_PATH = "/assets/files/Jinhan_s_cv.pdf"
PAGES = ("index.html", "publications/index.html", "service/index.html")


class CVLinks(HTMLParser):
    def __init__(self):
        super().__init__()
        self.links = []

    def handle_starttag(self, tag, attrs):
        href = dict(attrs).get("href", "")
        if tag == "a" and urlsplit(href).path.endswith(CV_PATH):
            self.links.append(href)


def check(root=ROOT):
    source = root / CV_PATH.lstrip("/")
    built = root / "_site" / CV_PATH.lstrip("/")
    expected = hashlib.sha256(source.read_bytes()).hexdigest()
    if hashlib.sha256(built.read_bytes()).hexdigest() != expected:
        raise ValueError("Built CV PDF differs from the source PDF; rebuild the site")
    count = 0
    for page in PAGES:
        parser = CVLinks()
        parser.feed((root / "_site" / page).read_text(encoding="utf-8"))
        if len(parser.links) != 4:
            raise ValueError(f"{page}: expected the profile CV link and all three panel footer links")
        for href in parser.links:
            if parse_qs(urlsplit(href).query).get("v") != [expected]:
                raise ValueError(f"{page}: stale or missing CV hash in {href!r}; rebuild the site")
        count += len(parser.links)
    return count, expected


if __name__ == "__main__":
    try:
        count, digest = check()
    except (OSError, ValueError) as error:
        print(f"ERROR: {error}", file=sys.stderr)
        raise SystemExit(1)
    print(f"PASS: {count} CV links match PDF SHA-256 {digest}")

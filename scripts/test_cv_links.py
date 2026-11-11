import hashlib
from pathlib import Path
import tempfile
import unittest

from check_cv_links import CV_PATH, PAGES, check


class CVLinkTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name)
        self.source = self.root / CV_PATH.lstrip("/")
        self.built = self.root / "_site" / CV_PATH.lstrip("/")
        for path in (self.source, self.built):
            path.parent.mkdir(parents=True, exist_ok=True)
            path.write_bytes(b"fixture CV one")
        self.digest = hashlib.sha256(self.source.read_bytes()).hexdigest()
        self.write_pages(CV_PATH + "?v=" + self.digest)

    def write_pages(self, href, count=4):
        for page in PAGES:
            path = self.root / "_site" / page
            path.parent.mkdir(parents=True, exist_ok=True)
            path.write_text((f'<a href="{href}">CV</a>\n') * count, encoding="utf-8")

    def test_matching_links(self):
        self.assertEqual(check(self.root), (12, self.digest))

    def test_missing_hash(self):
        self.write_pages(CV_PATH)
        with self.assertRaisesRegex(ValueError, "missing CV hash"):
            check(self.root)

    def test_stale_hash(self):
        self.write_pages(CV_PATH + "?v=old")
        with self.assertRaisesRegex(ValueError, "stale"):
            check(self.root)

    def test_missing_button(self):
        self.write_pages(CV_PATH + "?v=" + self.digest, count=1)
        with self.assertRaisesRegex(ValueError, "profile CV link"):
            check(self.root)

    def test_built_pdf_mismatch(self):
        self.built.write_bytes(b"old PDF")
        with self.assertRaisesRegex(ValueError, "Built CV PDF differs"):
            check(self.root)

    def test_updated_pdf_requires_new_hash(self):
        for path in (self.source, self.built):
            path.write_bytes(b"fixture CV two")
        with self.assertRaisesRegex(ValueError, "stale"):
            check(self.root)
        digest = hashlib.sha256(self.source.read_bytes()).hexdigest()
        self.write_pages(CV_PATH + "?v=" + digest)
        self.assertEqual(check(self.root), (12, digest))

    def test_baseurl_and_escaped_query(self):
        self.write_pages("/preview" + CV_PATH + "?download=1&amp;v=" + self.digest)
        self.assertEqual(check(self.root), (12, self.digest))


if __name__ == "__main__":
    unittest.main()

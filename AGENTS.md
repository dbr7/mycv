# Publication and CV consistency

- Keep publication ordering consistent with the companion CV checkout, normally
  `$HOME/Projects/Jinhan-CV`.
- Sort by year/month/day descending, then title ascending. Missing month/day
  values sort after known dates in the same year.
- For conference/workshop papers, verify the official event start date and store
  its source URL beside the entry in `_bibliography/my.bib`. For journal articles,
  use the publication date, or the acceptance date with a comment until the
  publication details are available. Never derive the year from a BibTeX key.
- When updating a paper shared with the CV, update its date in both bibliographies.
  The CV uses ISO `date={YYYY-MM-DD}` for exact dates because Biber ignores a
  standalone legacy `day` field. Do not change selection membership unless asked.
- Before delivering publication/CV updates, run this from the CV checkout:
  `make cv WEBSITE_BIB="$HOME/Projects/mycv-test/mycv/_bibliography/my.bib"`.
  It checks the actual selected-paper order and date consistency with this site.
- Render changed CV pages and verify the final PDF before copying it to
  `assets/files/Jinhan_s_cv.pdf` and `_site/assets/files/Jinhan_s_cv.pdf`.
- After any PDF update, rebuild the site. `_plugins/cv_version.rb` computes its
  SHA-256 automatically for all CV buttons. Never hand-edit the version value.
- Run `python3 scripts/check_cv_links.py` after building. It verifies the built
  PDF and all profile/footer CV URLs; deployment also runs this guard.

## GitHub Pages publishing

- GitHub Pages deploys the tracked `_site` directory. For source changes, build
  with `TZ=Europe/Zurich bundle exec jekyll build --destination _site` and inspect
  the resulting diff. PDF-only updates also require this build so CV links get
  the new content hash.
- Preserve unrelated experiments, previews, and temporary files; do not stage
  them with a release. Stage only the requested changes and relevant build files.
- Commit and push only when requested.

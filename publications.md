---
layout: default
page_type: publications
title: Publications
permalink: /publications/
---

<section
  class="content-section publications-section inner-page-section"
  id="publications"
  aria-labelledby="publications-title"
>
  <header class="content-section-header">
    <p class="section-label">
      <span aria-hidden="true"></span>Research output
    </p>
    <h2 id="publications-title">Publications</h2>
  </header>

  <div class="bibliography-body" markdown="1">
<p class="publications-intro">
  For an up-to-date list of publications and citation counts, visit my
  <a href="https://scholar.google.com/citations?user=XL_ZwBAAAAAJ" target="_blank" rel="noopener">Google Scholar profile</a>.
  Unless otherwise specified, publications appeared in the main research track.
</p>

{% capture numJournalPapers %}
{% bibliography_count --file my --query @article %}
{% endcapture %}
<section
  class="publication-group"
  data-visible-count="3"
  data-publication-label="journal articles"
  aria-labelledby="journal-publications-title"
>
  <h3 class="bibliography-heading" id="journal-publications-title" style="counter-reset:bibitem {{numJournalPapers|plus:1}}">Journals</h3>
  <div class="publication-list" id="journal-publications">
    {% bibliography --file my --query @article %}
  </div>
  <button
    class="publication-toggle"
    type="button"
    aria-expanded="false"
    aria-controls="journal-publications"
  >
    <span>Show earlier journal articles</span>
    <svg aria-hidden="true" viewBox="0 0 20 20"><path d="m5 8 5 5 5-5" /></svg>
  </button>
</section>

{% capture numConfPapers %}
{% bibliography_count --file my --query @inproceedings[keywords ^= conference || keywords ^= workshop_full || keywords ^= workshop_short || keywords ^= domestic || keywords ^= demo] %}
{% endcapture %}
<section
  class="publication-group"
  data-visible-count="3"
  data-publication-label="conference &amp; workshop papers"
  aria-labelledby="conference-publications-title"
>
  <h3 class="bibliography-heading" id="conference-publications-title" style="counter-reset:bibitem {{numConfPapers|plus:1}}">Conferences &amp; workshops</h3>
  <div class="publication-list" id="conference-publications">
    {% bibliography --file my --query @inproceedings[keywords ^= conference || keywords ^= workshop_full || keywords ^= workshop_short || keywords ^= domestic || keywords ^= demo] %}
  </div>
  <button
    class="publication-toggle"
    type="button"
    aria-expanded="false"
    aria-controls="conference-publications"
  >
    <span>Show earlier conference &amp; workshop papers</span>
    <svg aria-hidden="true" viewBox="0 0 20 20"><path d="m5 8 5 5 5-5" /></svg>
  </button>
</section>

<h3 class="bibliography-heading" style="counter-reset:bibitem 2">Thesis</h3>
<ol class="bibliography">
  <li>
    <article class="bib-entry">
      <div class="publication-main">
        <p class="venue-badge">Ph.D. · 2023</p>
        <h4 class="publication-name">Exploiting Mutant’s Relationship with Code, Faults, and Patches for Higher Efficacy of Mutation Analysis</h4>
        <p class="publication-authors"><strong>J. Kim</strong></p>
        <p class="publication-venue">KAIST, February 2023</p>
      </div>
      <div class="publication-actions">
        <a class="publication-link" href="{{ '/assets/files/papers/thesis.pdf' | relative_url }}" target="_blank" rel="noopener">
          PDF
          <svg aria-hidden="true" viewBox="0 0 20 20"><path d="M5 15 15 5M7 5h8v8" /></svg>
        </a>
      </div>
    </article>
  </li>
</ol>
  </div>
</section>

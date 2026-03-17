---
layout: default
---

For an up-to-date list of publications and their citation counts, please see my profile on [Google Scholar](https://scholar.google.com/citations?user=XL_ZwBAAAAAJ). Unless otherwise specified, they have been published at the main research track.

{% capture numJournalPapers %}
{% bibliography_count --file my --query @article %}
{% endcapture %}
<h5 class="bibliography" style="counter-reset:bibitem {{numJournalPapers|plus:1}}">Journals</h5>
{% bibliography --file my --query @article %}

{% capture numConfPapers %}
{% bibliography_count --file my --query @inproceedings[keywords ^= conference || keywords ^= workshop_full || keywords ^= workshop_short || keywords ^= domestic || keywords ^= demo] %}
{% endcapture %}
<h5 class="bibliography" style="counter-reset:bibitem {{numConfPapers|plus:1}}">Conferences & Workshops</h5>
{% bibliography --file my --query @inproceedings[keywords ^= conference || keywords ^= workshop_full || keywords ^= workshop_short || keywords ^= domestic || keywords ^= demo] %}


<!-- {% capture numOtherPapers %}
{% bibliography_count --file my --query @inproceedings[keywords ^= workshop_short || keywords ^= domestic || keywords ^= demo] %}
{% endcapture %}
<h5 class="bibliography" style="counter-reset:bibitem {{numOtherPapers|plus:1}}">Short, Poster, Demo, Domestic Papers</h5>
{% bibliography --file my --query @inproceedings[keywords ^= workshop_short || keywords ^= domestic || keywords ^= demo] %} -->

{% capture numUnpublishedPapers %}
{% bibliography_count --file my --query @unpublished %}
{% endcapture %}

<h5 class="bibliography" style="counter-reset:bibitem 2">Theses</h5>
<ol class="bibliography">
    <li>
        <div class="bib-entry">
            <p class="title">Exploiting Mutant’s Relationship with Code, Faults, and Patches for Higher Efficacy of Mutation Analysis</p>
            <p class="body"><em style="font-weight: 600;">J. Kim</em></p>
            <p class="body">
                <em>
                    Ph.D. Thesis, KAIST, February 2023
                </em>
                <a href="/assets/files/papers/thesis.pdf" target="_blank" style="text-decoration: none; font-weight: 500;" title="PDF">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style="vertical-align: -2px; margin-left: 2px;">
                        <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
                    </svg>
                </a>
            </p>
        </div>
    </li>
</ol>

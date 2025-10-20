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
{% bibliography_count --file my --query @inproceedings[keywords ^= conference || keywords ^= workshop_full] %}
{% endcapture %}
<h5 class="bibliography" style="counter-reset:bibitem {{numConfPapers|plus:1}}">Conferences & Workshops (Full Papers)</h5>
{% bibliography --file my --query @inproceedings[keywords ^= conference || keywords ^= workshop_full] %}


{% capture numOtherPapers %}
{% bibliography_count --file my --query @inproceedings[keywords ^= workshop_short || keywords ^= domestic || keywords ^= demo] %}
{% endcapture %}
<h5 class="bibliography" style="counter-reset:bibitem {{numOtherPapers|plus:1}}">Short, Poster, Demo, Domestic Papers</h5>
{% bibliography --file my --query @inproceedings[keywords ^= workshop_short || keywords ^= domestic || keywords ^= demo] %}

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
            </p>
        </div>
    </li>
</ol>

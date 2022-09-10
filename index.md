---
layout: default
---

See the list at [Google Scholar](https://scholar.google.com/citations?user=XL_ZwBAAAAAJ)

{% capture numJournalPapers %}
{% bibliography_count --file my --query @article %}
{% endcapture %}
<h5 class="bibliography" style="counter-reset:bibitem {{numJournalPapers|plus:1}}">Journals</h5>
{% bibliography --file my --query @article %}

{% capture numConfPapers %}
{% bibliography_count --file my --query @inproceedings[keywords ^= conference] %}
{% endcapture %}
<h5 class="bibliography" style="counter-reset:bibitem {{numConfPapers|plus:1}}">Conferences (Full Papers)</h5>
{% bibliography --file my --query @inproceedings[keywords ^= conference] %}


{% capture numOtherPapers %}
{% bibliography_count --file my --query @inproceedings[keywords ^= workshop || keywords ^= domestic || keywords ^= demo] %}
{% endcapture %}
<h5 class="bibliography" style="counter-reset:bibitem {{numOtherPapers|plus:1}}">Short, Workshop, Poster, Demo, Domestic Papers</h5>
{% bibliography --file my --query @inproceedings[keywords ^= workshop || keywords ^= domestic || keywords ^= demo] %}

{% capture numUnpublishedPapers %}
{% bibliography_count --file my --query @unpublished %}
{% endcapture %}
<h5 class="bibliography" style="counter-reset:bibitem {{numUnpublishedPapers|plus:1}}">In Submission</h5>
{% bibliography --file my --query @unpublished %}
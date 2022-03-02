---
layout: default
---

See the list at [Google Scholar](https://scholar.google.co.kr/citations?user=XL_ZwBAAAAAJ)

{% capture numJournalPapers %}
{% bibliography_count --file my --query @article %}
{% endcapture %}
<h5 class="bibliography" style="counter-reset:bibitem {{numJournalPapers|plus:1}}">Journals</h5>
{% bibliography --file my --query @article %}

{% capture numConfPapers %}
{% bibliography_count --file my --query @inproceedings %}
{% endcapture %}
<h5 class="bibliography" style="counter-reset:bibitem {{numConfPapers|plus:1}}">Conferences</h5>
{% bibliography --file my --query @inproceedings %}


{% capture numOtherPapers %}
{% bibliography_count --file my --query @inproceedingsshort + @inproceedingsdomestic + @inproceedingsworkshop %}
{% endcapture %}
<h5 class="bibliography" style="counter-reset:bibitem {{numOtherPapers|plus:1}}">Short, Poster, Workshop, Demo, Domestic Papers</h5>
{% bibliography --file my --query @inproceedingsshort + @inproceedingsdomestic + @inproceedingsworkshop %}

{% capture numReviewPapers %}
{% bibliography_count --file my --query @confreview + @journalreview %}
{% endcapture %}
<h5 class="bibliography" style="counter-reset:bibitem {{numReviewPapers|plus:1}}">In Submission</h5>
{% bibliography --file my --query @confreview + @journalreview %}
const topN = 4;
const loadMoreButton = document.getElementById("load-more");
const loadMoreText = document.getElementById("load-text");
const loadMoreIcon = document.getElementById("load-icon");

loadMoreButton.addEventListener("click", () => {
  const newsList = document.getElementById("news-list");
  const allNews = newsList.querySelectorAll(".grid");

  if (loadMoreText.textContent === "Collapse") {
    // Hide all news
    for (let i = 0; i < allNews.length; i++) {
      allNews[i].style.setProperty("display", "none");
    }
    // Load only the topN news
    for (let i = 0; i < topN; i++) {
      allNews[i].style.setProperty("display", "grid");
    }
    loadMoreText.textContent = "Show More";
    loadMoreIcon.classList.add('fa-angle-down');
    loadMoreIcon.classList.remove('fa-angle-up');
    return;
  }

  // Get the number of currently displayed news
  let displayedNews = 0;
  for (let i = 0; i < allNews.length; i++) {
    if (getComputedStyle(allNews[i]).display !== "none") {
      displayedNews++;
    }
  }
  if (displayedNews + topN >= allNews.length) {
    loadMoreText.textContent = "Collapse";
    loadMoreIcon.classList.add('fa-angle-up');
    loadMoreIcon.classList.remove('fa-angle-down');
  }
  else {
    loadMoreText.textContent = "Show More";
    loadMoreIcon.classList.add('fa-angle-down');
    loadMoreIcon.classList.remove('fa-angle-up');
  }
  // Load only the topN or remaining news (whichever is less)
  const toLoad = Math.min(topN, allNews.length - displayedNews);

  // Make the loaded news visible by adjusting nth-child selector
  for (let i = displayedNews; i < displayedNews + toLoad; i++) {
    allNews[i].style.setProperty("display", "grid");
  }
});

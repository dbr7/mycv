// Main Liquid Glass interactions
(() => {
  document.documentElement.classList.add("has-js");

  const root = document.documentElement;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)");
  const profileShell = document.querySelector("#profile-shell");
  const contentStage = document.querySelector("#main-content");
  const themeToggle = document.querySelector("[data-theme-toggle]");
  const panels = Array.from(document.querySelectorAll("[data-panel]"));
  const views = ["about", "publications", "service"];
  const siteRoot = document.body.dataset.siteRoot || "/";
  // Paths are from the Lucide icon set: UserRound, BookOpen, and UsersRound.
  const navigationIcons = {
    about:
      '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><circle cx="12" cy="8" r="5"></circle><path d="M20 21a8 8 0 0 0-16 0"></path></svg>',
    publications:
      '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>',
    service:
      '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M18 21a8 8 0 0 0-16 0"></path><circle cx="10" cy="7" r="4"></circle><path d="M22 21a8 8 0 0 0-5-7.7"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>',
  };
  // Lucide's geometric Asterisk marks notable publication details. Each copy
  // gets its own warm-spectrum gradient so the SVG reference stays local.
  const publicationNoteIcon = (gradientId) =>
    `<svg viewBox="5 5 14 14" aria-hidden="true" focusable="false"><defs><linearGradient id="${gradientId}" x1="7" y1="6" x2="17" y2="18" gradientUnits="userSpaceOnUse"><stop class="note-gradient-highlight" offset="0"></stop><stop class="note-gradient-warm" offset="0.34"></stop><stop class="note-gradient-core" offset="0.7"></stop><stop class="note-gradient-edge" offset="1"></stop></linearGradient></defs><g stroke="url(#${gradientId})"><path d="M12 6v12"></path><path d="m17.196 9-10.392 6"></path><path d="m6.804 9 10.392 6"></path></g></svg>`;
  const requestedView = window.location.hash.slice(1);
  const initialView = document.body.dataset.initialView;
  let activeView = views.includes(requestedView)
    ? requestedView
    : views.includes(initialView)
      ? initialView
      : "about";
  let transitionVersion = 0;
  let profileNav = null;
  let navSelection = null;
  let navAnchor = null;
  let dockIsCompact = false;
  let lastScrollY = window.scrollY;

  const gsapAvailable = () => Boolean(window.gsap);

  const applyTheme = (theme, shouldStore = false) => {
    root.dataset.theme = theme;
    root.style.colorScheme = theme;
    themeToggle.setAttribute("aria-pressed", String(theme === "dark"));
    themeToggle.title = theme === "dark" ? "Enable light mode" : "Enable dark mode";
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", theme === "dark" ? "#0c0e12" : "#eef0f2");

    if (shouldStore) {
      try {
        window.localStorage.setItem("jinhan-color-theme", theme);
      } catch (error) {
        // The selected theme still applies when storage is unavailable.
      }
    }
  };

  applyTheme(root.dataset.theme || (prefersDark.matches ? "dark" : "light"));

  themeToggle.addEventListener("click", () => {
    const nextTheme = root.dataset.theme === "dark" ? "light" : "dark";
    const commitTheme = () => applyTheme(nextTheme, true);

    if (document.startViewTransition && !reduceMotion.matches) {
      document.startViewTransition(commitTheme);
    } else {
      commitTheme();
    }

    if (gsapAvailable() && !reduceMotion.matches) {
      window.gsap.fromTo(
        themeToggle,
        { scale: 0.93, rotate: -4 },
        {
          scale: 1,
          rotate: 0,
          duration: 0.48,
          ease: "elastic.out(1, 0.62)",
          overwrite: true,
        },
      );
    }
  });

  prefersDark.addEventListener("change", (event) => {
    let storedTheme = null;
    try {
      storedTheme = window.localStorage.getItem("jinhan-color-theme");
    } catch (error) {
      storedTheme = null;
    }
    if (!storedTheme) applyTheme(event.matches ? "dark" : "light");
  });

  const viewForLink = (link) => {
    const href = link.getAttribute("href");
    if (!href || href.startsWith("mailto:")) return null;

    let url;
    try {
      url = new URL(href, window.location.origin);
    } catch (error) {
      return null;
    }

    if (url.origin !== window.location.origin) return null;
    const path = url.pathname.replace(/\/+$/, "") || "/";
    if (path === "/") return "about";
    if (path.endsWith("/publications")) return "publications";
    if (path.endsWith("/service")) return "service";
    return null;
  };

  const prepareInternalLinks = (scope) => {
    scope.querySelectorAll("a[href]").forEach((link) => {
      const view = viewForLink(link);
      if (!view) return;
      link.dataset.view = view;
      link.href = `${siteRoot}#${view}`;

      if (link.dataset.liquidViewBound === "true") return;
      link.dataset.liquidViewBound = "true";
      link.addEventListener("click", (event) => {
        event.preventDefault();
        activateView(view);

        if (gsapAvailable() && !reduceMotion.matches) {
          window.gsap.fromTo(
            link,
            { scale: 0.975 },
            {
              scale: 1,
              duration: 0.42,
              ease: "elastic.out(1, 0.68)",
              clearProps: "transform",
            },
          );
        }
      });
    });
  };

  const placeNavSelection = (immediate = false) => {
    if (!profileNav || !navSelection) return;
    const target = profileNav.querySelector(`a[data-view="${activeView}"]`);
    if (!target) return;

    const parentRect = profileNav.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();
    const x = targetRect.left - parentRect.left - navSelection.offsetLeft;
    const y = targetRect.top - parentRect.top - navSelection.offsetTop;

    if (gsapAvailable() && !reduceMotion.matches) {
      window.gsap.killTweensOf(navSelection);

      if (immediate) {
        window.gsap.set(navSelection, {
          x,
          y,
          width: targetRect.width,
          height: targetRect.height,
          scaleX: 1,
          scaleY: 1,
        });
        return;
      }

      const currentX = Number(window.gsap.getProperty(navSelection, "x")) || 0;
      const currentY = Number(window.gsap.getProperty(navSelection, "y")) || 0;
      const horizontal = Math.abs(x - currentX) > Math.abs(y - currentY);

      window.gsap
        .timeline()
        .to(navSelection, {
          [horizontal ? "scaleX" : "scaleY"]: 1.035,
          duration: 0.12,
          ease: "power2.out",
        })
        .to(
          navSelection,
          {
            x,
            y,
            width: targetRect.width,
            height: targetRect.height,
            scaleX: 1,
            scaleY: 1,
            duration: 0.45,
            ease: "power3.out",
          },
          "-=0.05",
        );
      return;
    }

    navSelection.style.width = `${targetRect.width}px`;
    navSelection.style.height = `${targetRect.height}px`;
    navSelection.style.transform = `translate(${x}px, ${y}px)`;
  };

  const updateNavigation = (immediate = false) => {
    if (!profileNav) return;
    profileNav.querySelectorAll("a[data-view]").forEach((link) => {
      const selected = link.dataset.view === activeView;
      link.classList.toggle("is-current", selected);
      if (selected) link.setAttribute("aria-current", "page");
      else link.removeAttribute("aria-current");
    });
    placeNavSelection(immediate);
  };

  const installNavigationIcons = () => {
    if (!profileNav) return;

    profileNav.querySelectorAll("a[data-view]").forEach((link) => {
      const marker = link.querySelector(".nav-index");
      const icon = navigationIcons[link.dataset.view];
      if (!marker || !icon) return;
      marker.classList.add("nav-icon");
      marker.setAttribute("aria-hidden", "true");
      marker.innerHTML = icon;
    });
  };

  const installPublicationNoteIcons = (scope) => {
    scope.querySelectorAll(".publication-note > span").forEach((marker, index) => {
      const scopeName = scope.dataset.panel || "panel";
      marker.innerHTML = publicationNoteIcon(
        `publication-note-gradient-${scopeName}-${index}`,
      );
    });
  };

  const relocateNavigation = () => {
    if (!profileNav || !navAnchor) return;
    const mobile = window.innerWidth <= 900;

    if (mobile && profileNav.parentElement !== document.body) {
      document.body.append(profileNav);
    } else if (!mobile && profileNav.parentElement === document.body) {
      navAnchor.parentNode.insertBefore(profileNav, navAnchor.nextSibling);
    }

    requestAnimationFrame(() => placeNavSelection(true));
  };

  const resetPanelStyles = (panel) => {
    if (!gsapAvailable() || !panel) return;
    window.gsap.set(panel, { clearProps: "opacity,visibility,transform" });
  };

  const setPanelVisibility = (nextPanel) => {
    panels.forEach((panel) => {
      const active = panel === nextPanel;
      panel.hidden = !active;
      panel.classList.toggle("is-active", active);
      resetPanelStyles(panel);
    });
  };

  const scrollToPanelStart = (panel) => {
    if (window.innerWidth > 900 || panel.dataset.panel === "about") {
      window.scrollTo({ top: 0, behavior: "auto" });
      return;
    }

    const firstSection = panel.querySelector(".content-section");
    const target = firstSection || contentStage;
    const targetTop = target.getBoundingClientRect().top + window.scrollY - 16;
    window.scrollTo({ top: Math.max(0, targetTop), behavior: "auto" });
  };

  const revealPanel = (view, immediate = false, resetScroll = true) => {
    const nextPanel = panels.find((panel) => panel.dataset.panel === view);
    const currentPanel = panels.find((panel) => !panel.hidden);
    if (!nextPanel) return;

    const version = ++transitionVersion;
    if (gsapAvailable()) window.gsap.killTweensOf(panels);

    if (immediate || nextPanel === currentPanel || reduceMotion.matches) {
      setPanelVisibility(nextPanel);
      if (resetScroll) scrollToPanelStart(nextPanel);
      requestAnimationFrame(() => placeNavSelection(true));
      return;
    }

    const showNext = () => {
      if (version !== transitionVersion) return;
      setPanelVisibility(nextPanel);
      if (resetScroll) scrollToPanelStart(nextPanel);
      requestAnimationFrame(() => placeNavSelection(true));

      if (gsapAvailable()) {
        window.gsap.fromTo(
          nextPanel,
          { autoAlpha: 0, scale: 0.988 },
          {
            autoAlpha: 1,
            scale: 1,
            duration: 0.5,
            ease: "power3.out",
            clearProps: "opacity,visibility,transform",
          },
        );
      }
    };

    if (gsapAvailable() && currentPanel) {
      resetPanelStyles(currentPanel);
      window.gsap.to(currentPanel, {
        autoAlpha: 0,
        scale: 0.991,
        duration: 0.18,
        ease: "power2.in",
        onComplete: showNext,
      });
    } else {
      showNext();
    }
  };

  const activateView = (
    view,
    { immediate = false, updateHash = true, resetScroll = true } = {},
  ) => {
    if (!views.includes(view)) return;
    activeView = view;
    document.body.className = `page-${view}`;
    document.title =
      view === "about"
        ? "Jinhan Kim | Software Engineering"
        : `${view === "service" ? "Community service" : "Publications"} | Jinhan Kim`;
    updateNavigation(immediate);
    revealPanel(view, immediate, resetScroll);

    if (updateHash) {
      window.history.replaceState(null, "", `${siteRoot}#${view}`);
    }
  };

  const setupNews = (scope) => {
    const newsList = scope.querySelector("#news-list");
    const newsToggle = scope.querySelector("#news-toggle");
    if (!newsList || !newsToggle) return;
    const newsItems = Array.from(newsList.querySelectorAll(".news-item"));

    if (newsItems.length <= 4) {
      newsToggle.hidden = true;
      return;
    }

    newsToggle.addEventListener("click", () => {
      const isExpanded = newsToggle.getAttribute("aria-expanded") === "true";
      const nextExpanded = !isExpanded;
      newsToggle.setAttribute("aria-expanded", String(nextExpanded));
      newsList.classList.toggle("is-expanded", nextExpanded);
      newsToggle.querySelector("span").textContent = nextExpanded
        ? "Show recent news only"
        : "Show all news";

      if (nextExpanded && gsapAvailable() && !reduceMotion.matches) {
        window.gsap.fromTo(
          newsItems.slice(4),
          { autoAlpha: 0, y: 8 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.32,
            stagger: 0.045,
            ease: "power3.out",
            clearProps: "opacity,visibility,transform",
          },
        );
      }
    });
  };

  const setupPortrait = () => {
    const portrait = profileShell.querySelector("[data-portrait-animation]");
    const link = portrait?.querySelector(".profile-portrait-link");
    const image = portrait?.querySelector(".profile-portrait-image");
    if (!link || !image || !gsapAvailable()) return;

    const animateIn = () => {
      if (reduceMotion.matches) return;
      window.gsap.to(link, {
        y: -2,
        scale: 1.008,
        duration: 0.28,
        ease: "power3.out",
        overwrite: true,
      });
      window.gsap.to(image, {
        scale: 1.035,
        duration: 0.4,
        ease: "power3.out",
        overwrite: true,
      });
    };

    const animateOut = () => {
      window.gsap.to(link, {
        y: 0,
        scale: 1,
        duration: 0.34,
        ease: "power3.out",
        overwrite: true,
      });
      window.gsap.to(image, {
        scale: 1.015,
        duration: 0.38,
        ease: "power3.out",
        overwrite: true,
      });
    };

    link.addEventListener("pointerenter", animateIn);
    link.addEventListener("pointerleave", animateOut);
    link.addEventListener("focus", animateIn);
    link.addEventListener("blur", animateOut);
  };

  const setupGlassResponse = () => {
    document.querySelectorAll("[data-glass]").forEach((glass) => {
      if (glass.dataset.liquidGlassBound === "true") return;
      glass.dataset.liquidGlassBound = "true";
      let frame;

      glass.addEventListener("pointermove", (event) => {
        if (root.dataset.theme === "dark") return;
        if (frame) cancelAnimationFrame(frame);
        frame = requestAnimationFrame(() => {
          const rect = glass.getBoundingClientRect();
          glass.style.setProperty("--glass-x", `${event.clientX - rect.left}px`);
          glass.style.setProperty("--glass-y", `${event.clientY - rect.top}px`);
          glass.style.setProperty("--glass-light", "0.55");
        });
      });

      glass.addEventListener("pointerleave", () => {
        glass.style.setProperty("--glass-light", "0.34");
      });
    });
  };

  const setDockCompact = (compact) => {
    if (!profileNav || window.innerWidth > 900 || dockIsCompact === compact) return;
    dockIsCompact = compact;

    if (gsapAvailable() && !reduceMotion.matches) {
      window.gsap.to(profileNav, {
        y: compact ? 10 : 0,
        scale: compact ? 0.95 : 1,
        autoAlpha: compact ? 0.9 : 1,
        duration: compact ? 0.3 : 0.43,
        ease: "power3.out",
        overwrite: true,
      });
      window.gsap.to(themeToggle, {
        y: compact ? 10 : 0,
        autoAlpha: compact ? 0.9 : 1,
        duration: compact ? 0.3 : 0.43,
        ease: "power3.out",
        overwrite: true,
      });
      return;
    }

    profileNav.classList.toggle("is-compact", compact);
    themeToggle.classList.toggle("is-compact", compact);
  };

  let scrollFrame;
  window.addEventListener(
    "scroll",
    () => {
      if (scrollFrame) return;
      scrollFrame = requestAnimationFrame(() => {
        const currentScrollY = window.scrollY;
        const scrollingDown = currentScrollY > lastScrollY + 2;
        setDockCompact(currentScrollY > 120 && scrollingDown);
        if (currentScrollY < 72 || currentScrollY < lastScrollY - 2) {
          setDockCompact(false);
        }
        lastScrollY = currentScrollY;
        scrollFrame = null;
      });
    },
    { passive: true },
  );

  window.addEventListener("resize", () => {
    relocateNavigation();
    if (window.innerWidth > 900 && profileNav && gsapAvailable()) {
      dockIsCompact = false;
      window.gsap.set([profileNav, themeToggle], {
        clearProps: "opacity,visibility,transform",
      });
    }
    placeNavSelection(true);
  });

  window.addEventListener("hashchange", () => {
    const hashView = window.location.hash.slice(1);
    if (views.includes(hashView) && hashView !== activeView) {
      activateView(hashView, { updateHash: false });
    }
  });

  const initialize = () => {
    if (!profileShell || !contentStage || !themeToggle || panels.length === 0) return;

    panels.forEach((panel) => {
      prepareInternalLinks(panel);
      installPublicationNoteIcons(panel);
    });

    prepareInternalLinks(profileShell);
    profileNav = profileShell.querySelector(".profile-nav");
    if (!profileNav) return;

    installNavigationIcons();
    navAnchor = document.createComment("mobile navigation anchor");
    profileNav.before(navAnchor);
    navSelection = document.createElement("span");
    navSelection.className = "nav-selection";
    navSelection.setAttribute("aria-hidden", "true");
    profileNav.prepend(navSelection);
    relocateNavigation();

    setupNews(panels.find((panel) => panel.dataset.panel === "about"));
    setupPortrait();
    setupGlassResponse();
    activateView(activeView, {
      immediate: true,
      updateHash: false,
      resetScroll: false,
    });

    requestAnimationFrame(() => placeNavSelection(true));

    if (gsapAvailable() && !reduceMotion.matches) {
      window.gsap.from(profileShell, {
        autoAlpha: 0,
        x: -10,
        duration: 0.58,
        ease: "power3.out",
        clearProps: "opacity,visibility,transform",
      });
      window.gsap.from(
        panels.find((panel) => panel.dataset.panel === activeView),
        {
          autoAlpha: 0,
          scale: 0.992,
          duration: 0.58,
          ease: "power3.out",
          clearProps: "opacity,visibility,transform",
        },
      );
    }
  };

  initialize();
})();

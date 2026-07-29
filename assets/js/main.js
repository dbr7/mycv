(() => {
  document.documentElement.classList.add("has-js");

  const motion = Object.freeze({
    ease: "power3.out",
    hoverDuration: 0.22,
    quickDuration: 0.34,
    stagger: 0.055,
  });
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  );

  const themeStorageKey = "jinhan-color-theme";
  const prefersDarkTheme = window.matchMedia("(prefers-color-scheme: dark)");
  const themeToggles = Array.from(
    document.querySelectorAll("[data-theme-toggle]"),
  );
  const themeColorMeta = document.querySelector('meta[name="theme-color"]');

  const readStoredTheme = () => {
    try {
      const storedTheme = window.localStorage.getItem(themeStorageKey);
      return storedTheme === "light" || storedTheme === "dark"
        ? storedTheme
        : null;
    } catch (error) {
      return null;
    }
  };

  const storeTheme = (theme) => {
    try {
      window.localStorage.setItem(themeStorageKey, theme);
    } catch (error) {
      // The selected theme still applies for this page when storage is blocked.
    }
  };

  const syncThemeControls = (theme) => {
    const isDark = theme === "dark";
    const actionLabel = isDark ? "Enable light mode" : "Enable dark mode";

    themeToggles.forEach((toggle) => {
      toggle.setAttribute("aria-pressed", String(isDark));
      toggle.setAttribute("aria-label", "Dark mode");
      toggle.title = actionLabel;
    });
  };

  const applyTheme = (theme, shouldStore = false) => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
    themeColorMeta?.setAttribute(
      "content",
      theme === "dark" ? "#000000" : "#f3f4f5",
    );
    syncThemeControls(theme);

    if (shouldStore) storeTheme(theme);
  };

  syncThemeControls(
    document.documentElement.dataset.theme ||
      (prefersDarkTheme.matches ? "dark" : "light"),
  );

  themeToggles.forEach((toggle) => {
    toggle.addEventListener("click", () => {
      const nextTheme =
        document.documentElement.dataset.theme === "dark" ? "light" : "dark";
      const commitTheme = () => applyTheme(nextTheme, true);

      if (document.startViewTransition && !prefersReducedMotion.matches) {
        document.startViewTransition(commitTheme);
      } else {
        commitTheme();
      }
    });
  });

  prefersDarkTheme.addEventListener("change", (event) => {
    if (!readStoredTheme()) applyTheme(event.matches ? "dark" : "light");
  });

  const navToggle = document.getElementById("nav-toggle");
  const siteNav = document.getElementById("site-nav");

  const closeNavigation = () => {
    if (!navToggle || !siteNav) return;
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Open navigation");
    siteNav.classList.remove("is-open");
    document.body.classList.remove("nav-is-open");
  };

  if (navToggle && siteNav) {
    navToggle.addEventListener("click", () => {
      const isOpen = navToggle.getAttribute("aria-expanded") === "true";
      navToggle.setAttribute("aria-expanded", String(!isOpen));
      navToggle.setAttribute(
        "aria-label",
        isOpen ? "Open navigation" : "Close navigation",
      );
      siteNav.classList.toggle("is-open", !isOpen);
      document.body.classList.toggle("nav-is-open", !isOpen);
    });

    siteNav.addEventListener("click", (event) => {
      if (event.target.closest("a")) closeNavigation();
    });

    document.addEventListener("keydown", (event) => {
      const isOpen = navToggle.getAttribute("aria-expanded") === "true";
      if (event.key === "Escape" && isOpen) {
        closeNavigation();
        navToggle.focus();
      }
    });

    document.addEventListener("click", (event) => {
      const isOpen = navToggle.getAttribute("aria-expanded") === "true";
      if (
        isOpen &&
        !siteNav.contains(event.target) &&
        !navToggle.contains(event.target)
      ) {
        closeNavigation();
      }
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 980) closeNavigation();
    });
  }

  const newsList = document.getElementById("news-list");
  const newsToggle = document.getElementById("news-toggle");

  if (newsList && newsToggle) {
    const newsItems = newsList.querySelectorAll(".news-item");

    if (newsItems.length <= 4) {
      newsToggle.hidden = true;
    } else {
      newsToggle.addEventListener("click", () => {
        const isExpanded = newsToggle.getAttribute("aria-expanded") === "true";
        const nextExpanded = !isExpanded;

        newsToggle.setAttribute("aria-expanded", String(nextExpanded));
        newsList.classList.toggle("is-expanded", nextExpanded);
        newsToggle.querySelector("span").textContent = nextExpanded
          ? "Show recent news only"
          : "Show all news";

        if (nextExpanded && window.gsap && !prefersReducedMotion.matches) {
          window.gsap.fromTo(
            Array.from(newsItems).slice(4),
            { autoAlpha: 0, y: 10 },
            {
              autoAlpha: 1,
              y: 0,
              duration: motion.quickDuration,
              stagger: motion.stagger,
              ease: motion.ease,
              clearProps: "opacity,visibility,transform",
            },
          );
        }
      });
    }
  }

  const portrait = document.querySelector("[data-portrait-animation]");

  if (portrait && window.gsap) {
    const { gsap } = window;
    const portraitLink = portrait.querySelector(".profile-portrait-link");
    const baseImage = portrait.querySelector(".profile-portrait-image");
    const portraitMedia = gsap.matchMedia();

    portraitMedia.add(
      "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
      () => {
        if (!portraitLink || !baseImage) {
          return undefined;
        }

        let pointerInside = false;
        let focusInside = false;
        let isActive = false;

        const animateIn = () => {
          gsap.to(portraitLink, {
            y: -2,
            boxShadow: getComputedStyle(document.documentElement)
              .getPropertyValue("--site-shadow-portrait-hover")
              .trim(),
            duration: motion.hoverDuration,
            ease: motion.ease,
            overwrite: "auto",
          });
          gsap.to(baseImage, {
            yPercent: -0.6,
            scale: 1.035,
            duration: motion.quickDuration,
            ease: motion.ease,
            overwrite: "auto",
          });
        };

        const animateOut = () => {
          gsap.to(portraitLink, {
            y: 0,
            boxShadow: getComputedStyle(document.documentElement)
              .getPropertyValue("--site-shadow-portrait")
              .trim(),
            duration: motion.hoverDuration,
            ease: motion.ease,
            overwrite: "auto",
          });
          gsap.to(baseImage, {
            yPercent: 0,
            scale: 1,
            duration: 0.28,
            ease: motion.ease,
            overwrite: "auto",
          });
        };

        const updateState = () => {
          const nextActive = pointerInside || focusInside;
          if (nextActive === isActive) return;

          isActive = nextActive;
          if (isActive) animateIn();
          else animateOut();
        };

        const handlePointerEnter = () => {
          pointerInside = true;
          updateState();
        };
        const handlePointerLeave = () => {
          pointerInside = false;
          updateState();
        };
        const handleFocus = () => {
          focusInside = true;
          updateState();
        };
        const handleBlur = () => {
          focusInside = false;
          updateState();
        };

        portraitLink.addEventListener("pointerenter", handlePointerEnter);
        portraitLink.addEventListener("pointerleave", handlePointerLeave);
        portraitLink.addEventListener("focus", handleFocus);
        portraitLink.addEventListener("blur", handleBlur);

        return () => {
          portraitLink.removeEventListener("pointerenter", handlePointerEnter);
          portraitLink.removeEventListener("pointerleave", handlePointerLeave);
          portraitLink.removeEventListener("focus", handleFocus);
          portraitLink.removeEventListener("blur", handleBlur);
          gsap.killTweensOf([portraitLink, baseImage]);
        };
      },
    );
  }

  document.querySelectorAll(".publication-group").forEach((group) => {
    const items = Array.from(
      group.querySelectorAll(".publication-list > ol.bibliography > li"),
    );
    const toggle = group.querySelector(".publication-toggle");
    const visibleCount = Number.parseInt(group.dataset.visibleCount, 10) || 4;

    if (!toggle || items.length <= visibleCount) {
      if (toggle) toggle.hidden = true;
      return;
    }

    const label = group.dataset.publicationLabel || "publications";
    const earlierCount = items.length - visibleCount;
    const toggleLabel = toggle.querySelector("span");

    const updatePublicationGroup = (isExpanded) => {
      group.classList.toggle("is-expanded", isExpanded);
      toggle.setAttribute("aria-expanded", String(isExpanded));
      toggleLabel.textContent = isExpanded
        ? `Show recent ${label} only`
        : `Show ${earlierCount} earlier ${label}`;

      if (isExpanded && window.gsap && !prefersReducedMotion.matches) {
        window.gsap.fromTo(
          items.slice(visibleCount),
          { autoAlpha: 0, y: 10 },
          {
            autoAlpha: 1,
            y: 0,
            duration: motion.quickDuration,
            stagger: motion.stagger,
            ease: motion.ease,
            clearProps: "opacity,visibility,transform",
          },
        );
      }
    };

    toggle.addEventListener("click", () => {
      const isExpanded = toggle.getAttribute("aria-expanded") === "true";
      updatePublicationGroup(!isExpanded);
    });

    updatePublicationGroup(false);
  });

  const serviceArchive = document.querySelector(".service-archive");

  if (serviceArchive && window.gsap) {
    serviceArchive.addEventListener("toggle", () => {
      if (!serviceArchive.open || prefersReducedMotion.matches) return;

      window.gsap.fromTo(
        serviceArchive.querySelectorAll(".archive-grid > *"),
        { autoAlpha: 0, y: 10 },
        {
          autoAlpha: 1,
          y: 0,
          duration: motion.quickDuration,
          stagger: motion.stagger,
          ease: motion.ease,
          clearProps: "opacity,visibility,transform",
        },
      );
    });
  }
})();

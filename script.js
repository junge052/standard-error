(() => {
  function initializeWebsite() {
    const axes = [
      { tag: "DISP", name: "Displacement" },
      { tag: "REPT", name: "Repetition" },
      { tag: "DIST", name: "Distortion" },
      { tag: "UNIF", name: "Uniformity" },
      { tag: "RECG", name: "Recognition" }
    ];

    /*
     * ADD YOUR DOCUMENTATION IMAGES HERE.
     *
     * image: path to a JPG, PNG, WebP, or GIF
     * file: optional link to a PDF
     * after: specimen chapter the image follows
     *
     * Available chapters:
     * DISP, REPT, DIST, UNIF, RECG
     *
     * Remove the // from an example to activate it.
     */

    const mockups = [
      {
        title: "displacement in space",
        image: "images-graphics/displacement_reference.jpg",
        after: "DISP",
        kind: "research"
      },
      {
        title: "displacement in type",
        image: "images-graphics/disp-noise.png",
        after: "DISP",
        kind: "research"
      },
      {
        title: "infinite screen loop",
        image: "images-graphics/repetition.jpg",
        after: "REPT",
        kind: "research"
      },
      {
        title: "A Process",
        image: "PROTOTYPE 1-DOCUMENTATION/A-repetition.png",
        after: "REPT",
        kind: "research"
      },
      {
        title: "Testing in Glyphs",
        image: "images-graphics/distorted.png",
        after: "DIST",
        kind: "research"
      },
      {
        title: "Standard Error in motion",
        video: "PROTOTYPE 1-DOCUMENTATION/Glyphs Process.mp4",
        after: "UNIF",
        kind: "FONT IN USE"
      },
      {
        title: "Drawing Process",
        image: "PROTOTYPE 1-DOCUMENTATION/IMG_2256.JPG",
        after: "RECG",
        kind: "drawing"
      },
      {
        title: "Testing, 1, 2",
        video: "PROTOTYPE 1-DOCUMENTATION/Testing.mp4",
        after: "RECG",
        kind: "testing"
      },
    ];

    const chapterContent = [
      {
        tag: "DISP",
        name: "Displacement",
        title: "Unexpected placement means disrupted spacing",
        description:
          "Displacement translates the unexpected placement of objects in physical spaces into typography. Shifting parts of a letter disrupts their expected spacing and alignment, making a familiar form feel subtly out of place.",
        text: "OUT OF\nPLACE"
      },
      {
        tag: "REPT",
        name: "Repetition",
        title: "You have been here before. Excessive repetition means redundant forms.",
        description:
          "Repeated structures can make a space feel endless or difficult to navigate. Repetition applies this logic to letterforms, duplicating familiar elements until they become excessive and interfere with reading.",
        text: "AGAIN\nAGAIN"
      },
      {
        tag: "DIST",
        name: "Distortion",
        title: "Altered proportions mean unstable forms.",
        description:
          "The letter changes under controlled deformation. Recognition persists as its structure becomes unfamiliar.",
        text: "ALMOST\nNORMAL"
      },
      {
        tag: "UNIF",
        name: "Uniformity",
        title: "Absence of human presence means mechanical consistency.",
        description:
          "Variation gives way to consistency. The system becomes more uniform, and its familiarity begins to feel strange.",
        text: "ALL THE\nSAME"
      },
      {
        tag: "RECG",
        name: "Recognition",
        title: "Do you still recognize me?",
        description:
          "At what point does the familiar stops being certain?",
        text: "CAN YOU\nRECOGNIZE?"
      }
    ];

    const preview = document.querySelector("#preview");
    const sliders = document.querySelector("#sliders");
    const instances = document.querySelector("#instances");
    const chapters = document.querySelector("#chapters");
    const chapterNav = document.querySelector(".chapter-nav");
    const sizeSlider = document.querySelector("#size");
    const sizeOutput = document.querySelector("#size-value");

    const values = Object.fromEntries(
      axes.map(axis => [axis.tag, 0])
    );

    const defaultPreview = preview?.innerHTML || "HELLO, STRANGER.";
    const defaultSize = sizeSlider
      ? Number(sizeSlider.defaultValue)
      : 100;

    const motionPreference = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );

    function fontSettings(coordinates) {
      return axes
        .map(axis => `"${axis.tag}" ${coordinates[axis.tag]}`)
        .join(", ");
    }

    // BLUE SLIDER PROGRESS

    function updateSliderProgress() {
      document
        .querySelectorAll('.axis input[type="range"], #size')
        .forEach(slider => {
          const min = slider.min === "" ? 0 : Number(slider.min);
          const max = slider.max === "" ? 100 : Number(slider.max);
          const value = Number(slider.value);

          const percent = max > min
            ? Math.max(
              0,
              Math.min(100, ((value - min) / (max - min)) * 100)
            )
            : 0;

          // Supports both the cleaned and earlier slider CSS.
          slider.style.setProperty("--slider-progress", `${percent}%`);
          slider.style.setProperty("--progress", `${percent}%`);
        });
    }

    window.updateSliderProgress = updateSliderProgress;

    // TYPE TESTER

    function renderTester() {
      if (preview) {
        preview.style.fontVariationSettings = fontSettings(values);
      }

      const coordinates = document.querySelector("#coordinates");

      if (coordinates) {
        coordinates.textContent = axes
          .map(axis => `${axis.tag} ${values[axis.tag]}`)
          .join(" / ");
      }

      axes.forEach(axis => {
        const input = document.getElementById(axis.tag);
        const output = document.getElementById(`${axis.tag}-value`);

        if (input) input.value = values[axis.tag];
        if (output) output.value = values[axis.tag];
      });

      const selected = axes.find(axis => {
        return (
          values[axis.tag] === 100 &&
          axes.every(other => {
            return other.tag === axis.tag || values[other.tag] === 0;
          })
        );
      });

      const regular = axes.every(axis => values[axis.tag] === 0);
      const label = document.querySelector("#instance-label");

      if (label) {
        if (selected) {
          const number = String(
            axes.indexOf(selected) + 1
          ).padStart(2, "0");

          label.textContent =
            `${number} / ${selected.name.toUpperCase()}`;
        } else {
          label.textContent = regular
            ? "00 / REGULAR"
            : "CUSTOM / MIXED CONDITION";
        }
      }

      document.querySelectorAll(".instance-card").forEach(card => {
        card.setAttribute(
          "aria-pressed",
          String(card.dataset.axis === selected?.tag)
        );
      });

      updateSliderProgress();
    }

    function selectPreset(tag) {
      axes.forEach(axis => {
        values[axis.tag] = axis.tag === tag ? 100 : 0;
      });

      renderTester();
    }

    function scrollToSection(id) {
      document.getElementById(id)?.scrollIntoView({
        behavior: motionPreference.matches ? "auto" : "smooth",
        block: "start"
      });
    }

    function openTester() {
      scrollToSection("tester");
    }

    if (sliders) {
      sliders.replaceChildren();

      axes.forEach(axis => {
        const control = document.createElement("label");
        control.className = "axis";

        control.innerHTML = `
          <span class="axis-heading">
            <span>${axis.name.toUpperCase()}</span>
            <output
              id="${axis.tag}-value"
              for="${axis.tag}"
            >0</output>
          </span>

          <input
            id="${axis.tag}"
            type="range"
            min="0"
            max="100"
            step="1"
            value="0"
          >
        `;

        control.querySelector("input").addEventListener(
          "input",
          event => {
            values[axis.tag] = Number(event.target.value);
            renderTester();
          }
        );

        sliders.append(control);
      });
    }

    if (instances) {
      instances.replaceChildren();

      axes.forEach((axis, index) => {
        const button = document.createElement("button");

        button.type = "button";
        button.className = "instance-card";
        button.dataset.axis = axis.tag;
        button.setAttribute("aria-pressed", "false");

        button.innerHTML = `
          <span class="mini-specimen">Aa</span>
          <span class="card-meta">
            0${index + 1} / ${axis.name.toUpperCase()}
            <br>
            ${axis.tag} → 100
          </span>
        `;

        const preset = Object.fromEntries(
          axes.map(other => [
            other.tag,
            other.tag === axis.tag ? 100 : 0
          ])
        );

        button.querySelector(".mini-specimen").style
          .fontVariationSettings = fontSettings(preset);

        button.addEventListener("click", () => {
          selectPreset(axis.tag);
          openTester();
        });

        instances.append(button);
      });
    }

    function updatePreviewSize() {
      if (!sizeSlider) return;

      const size = Number(sizeSlider.value);

      preview?.style.setProperty("--size-scale", size / 100);

      if (sizeOutput) sizeOutput.value = `${size}%`;

      updateSliderProgress();
    }

    sizeSlider?.addEventListener("input", updatePreviewSize);

    document.querySelector("#reset")?.addEventListener(
      "click",
      () => {
        axes.forEach(axis => {
          values[axis.tag] = 0;
        });

        if (preview) preview.innerHTML = defaultPreview;
        if (sizeSlider) sizeSlider.value = defaultSize;

        updatePreviewSize();
        renderTester();
      }
    );

    document.querySelectorAll("[data-tester-open]").forEach(button => {
      button.addEventListener("click", openTester);
    });

    // DOCUMENTATION FIGURES

    function createFigure(item, scrolling = false) {
      const figure = document.createElement("figure");

      figure.className = scrolling
        ? "scroll-document reveal-document"
        : "mockup";

      if (item.video) {
        const video = document.createElement("video");

        video.muted = true;
        video.loop = true;
        video.playsInline = true;
        video.controls = true;
        video.preload = "metadata";

        video.autoplay = !window.matchMedia(
          "(prefers-reduced-motion: reduce)"
        ).matches;

        video.setAttribute(
          "aria-label",
          item.title || "Typeface motion graphic"
        );

        video.src = item.video;
        figure.append(video);
      } else if (item.image) {
        const image = document.createElement("img");

        image.src = item.image;
        image.alt = item.alt || item.title || "Typeface documentation";
        image.loading = "lazy";

        figure.append(image);
      }

      return figure;
    }

    function createChapterDocumentation(tag, index) {
      const section = document.createElement("section");
      section.className = "scroll-documentation";

      const axis = axes.find(axis => axis.tag === tag);

      section.setAttribute(
        "aria-label",
        `${axis.name} documentation`
      );

      const heading = document.createElement("div");
      heading.className = "documentation-heading";
      heading.textContent =
        `ARCHIVE / 0${index + 1}`;

      section.append(heading);

      const items = mockups.filter(item => {
        return (
          (item.after || "DISP") === tag &&
          (item.image || item.video)
        );
      });
      if (items.length) {
        items.forEach(item => {
          section.append(createFigure(item, true));
        });
      } else {
        const placeholder = document.createElement("div");

        placeholder.className = "documentation-placeholder";
        placeholder.textContent =
          `YOUR ${axis.name.toUpperCase()} IMAGES HERE — ` +
          "add image paths in script.js";

        section.append(placeholder);
      }

      return section;
    }

    // SCROLLING SPECIMEN CHAPTERS + DOCUMENTATION

    if (chapters && chapterNav) {
      chapters.replaceChildren();
      chapterNav.replaceChildren();

      chapterContent.forEach((item, index) => {
        const link = document.createElement("a");

        link.href = `#condition-${item.tag}`;
        link.textContent = `0${index + 1} / ${item.name}`;

        chapterNav.append(link);

        const chapter = document.createElement("section");

        chapter.className = "axis-chapter";
        chapter.id = `condition-${item.tag}`;
        chapter.dataset.tag = item.tag;

        chapter.innerHTML = `
          <div class="chapter-heading">
            <span>0${index + 1} / ${item.name.toUpperCase()}</span>
            <span class="chapter-reading">${item.tag} / 000</span>
          </div>

          <div class="chapter-stage">
            <div class="chapter-specimen"></div>
          </div>

          <div class="chapter-info">
            <h2>${item.title}</h2>
            <p>${item.description}</p>
            <button type="button">
              EXPLORE ${item.name.toUpperCase()} ↗
            </button>
          </div>
        `;

        chapter.querySelector(".chapter-specimen").textContent =
          item.text;

        chapter.querySelector("button").addEventListener(
          "click",
          () => {
            selectPreset(item.tag);
            openTester();
          }
        );

        chapters.append(
          chapter,
          createChapterDocumentation(item.tag, index)
        );
      });
    }

    // DOCUMENTATION SECTION AT THE END OF THE PAGE

    const mockupGrid = document.querySelector("#mockups");

    if (mockupGrid) {
      mockupGrid.replaceChildren();

      if (mockups.length) {
        mockups.forEach(item => {
          mockupGrid.append(createFigure(item));
        });
      } else {
        [
          "PRINTED MATTER",
          "POSTERS / EPHEMERA",
          "DOCUMENTS"
        ].forEach((title, index) => {
          const figure = document.createElement("figure");
          figure.className = "mockup";

          figure.innerHTML = `
            <div class="mockup-visual">
              [ IMAGE NOT YET UPLOADED ]
              <br>
              ARCHIVE / 00${index + 1}
            </div>
            <figcaption>
              ${title}
              <br>
              Awaiting your designed mockup.
            </figcaption>
          `;

          mockupGrid.append(figure);
        });
      }
    }

    // REVEAL IMAGES AS THEY ENTER THE VIEWPORT

    const revealFigures = [
      ...document.querySelectorAll(".reveal-document")
    ];

    if (
      "IntersectionObserver" in window &&
      !motionPreference.matches
    ) {
      const imageObserver = new IntersectionObserver(
        entries => {
          entries.forEach(entry => {
            if (!entry.isIntersecting) return;

            entry.target.classList.add("is-visible");
            imageObserver.unobserve(entry.target);
          });
        },
        {
          threshold: 0,
          rootMargin: "0px 0px -8% 0px"
        }
      );

      revealFigures.forEach(figure => {
        figure.classList.add("will-reveal");
        imageObserver.observe(figure);
      });
    } else {
      revealFigures.forEach(figure => {
        figure.classList.add("is-visible");
      });
    }

    // STICKY NAVIGATION + SCROLL-DRIVEN AXIS CHANGES

    const navigationLinks = [
      ...document.querySelectorAll(".tabs a[href^='#']")
    ];

    const navigationTargets = navigationLinks
      .map(link => document.getElementById(link.hash.slice(1)))
      .filter(Boolean);

    const chapterElements = [
      ...document.querySelectorAll(".axis-chapter")
    ];

    let scrollQueued = false;

    function updateScrollExperience() {
      scrollQueued = false;

      const viewportHeight = window.innerHeight;
      const navigationHeight =
        document.querySelector(".tabs")?.getBoundingClientRect()
          .height || 47;

      // Keep the second navigation directly below the first.
      if (chapterNav) {
        chapterNav.style.top = `${navigationHeight}px`;
      }

      let activeSection = navigationTargets[0];

      navigationTargets.forEach(section => {
        if (
          section.getBoundingClientRect().top <=
          navigationHeight + 100
        ) {
          activeSection = section;
        }
      });

      navigationLinks.forEach(link => {
        const active =
          activeSection && link.hash === `#${activeSection.id}`;

        link.classList.toggle("active", Boolean(active));

        if (active) {
          link.setAttribute("aria-current", "location");
        } else {
          link.removeAttribute("aria-current");
        }
      });

      let nearestChapter = null;
      let nearestDistance = Infinity;

      chapterElements.forEach(chapter => {
        const rect = chapter.getBoundingClientRect();

        const distance = Math.abs(
          rect.top + rect.height / 2 - viewportHeight / 2
        );

        if (distance < nearestDistance) {
          nearestDistance = distance;
          nearestChapter = chapter;
        }

        if (rect.bottom < 0 || rect.top > viewportHeight) {
          return;
        }

        const progress = motionPreference.matches
          ? 1
          : Math.max(
            0,
            Math.min(
              1,
              (viewportHeight * 0.8 - rect.top) /
              (viewportHeight * 0.8)
            )
          );

        const value = Math.round(progress * 100);

        const coordinates = Object.fromEntries(
          axes.map(axis => [
            axis.tag,
            axis.tag === chapter.dataset.tag ? value : 0
          ])
        );

        chapter.querySelector(".chapter-specimen").style
          .fontVariationSettings = fontSettings(coordinates);

        chapter.querySelector(".chapter-reading").textContent =
          `${chapter.dataset.tag} / ` +
          String(value).padStart(3, "0");
      });

      chapterNav?.querySelectorAll("a").forEach(link => {
        const active =
          nearestChapter &&
          link.hash === `#${nearestChapter.id}`;

        link.classList.toggle("active", Boolean(active));

        if (active) {
          link.setAttribute("aria-current", "location");
        } else {
          link.removeAttribute("aria-current");
        }
      });
    }

    function queueScrollUpdate() {
      if (scrollQueued) return;

      scrollQueued = true;
      requestAnimationFrame(updateScrollExperience);
    }

    window.addEventListener("scroll", queueScrollUpdate, {
      passive: true
    });

    window.addEventListener("resize", queueScrollUpdate);
    window.addEventListener("hashchange", queueScrollUpdate);
    window.addEventListener("load", queueScrollUpdate);

    motionPreference.addEventListener?.(
      "change",
      queueScrollUpdate
    );

    document.querySelector("#begin-scroll")?.addEventListener(
      "click",
      event => {
        event.preventDefault();
        scrollToSection("condition-DISP");
      }
    );

    // STATIC TTF DOWNLOAD
    // Run the included Python server for this feature.

    document.querySelector("#download")?.addEventListener(
      "click",
      async () => {
        const button = document.querySelector("#download");
        const status = document.querySelector("#export-status");
        const snapshot = { ...values };

        button.disabled = true;
        button.textContent = "GENERATING FONT…";

        if (status) {
          status.textContent =
            "Fixing your selected axis values. This may take a moment.";
        }

        try {
          const query = new URLSearchParams(snapshot);
          const response = await fetch(`/api/instance?${query}`);
          const contentType =
            response.headers.get("content-type") || "";

          if (
            !response.ok ||
            !contentType.includes("font/ttf")
          ) {
            throw new Error("Export server unavailable.");
          }

          const blob = await response.blob();
          const url = URL.createObjectURL(blob);
          const link = document.createElement("a");

          const suffix = axes
            .map(axis => `${axis.tag}${snapshot[axis.tag]}`)
            .join("-");

          link.href = url;
          link.download = `StandardError-${suffix}.ttf`;

          document.body.append(link);
          link.click();
          link.remove();

          setTimeout(() => {
            URL.revokeObjectURL(url);
          }, 60000);

          if (status) {
            status.textContent =
              "Downloaded your static TrueType font.";
          }
        } catch (error) {
          if (status) {
            status.textContent =
              "Download unavailable. Start the included server with: python server.py";
          }
        } finally {
          button.disabled = false;
          button.textContent = "↓ DOWNLOAD STATIC .TTF";
        }
      }
    );

    updatePreviewSize();
    renderTester();
    queueScrollUpdate();

    document.fonts?.ready.then(queueScrollUpdate);
  }

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      initializeWebsite,
      { once: true }
    );
  } else {
    initializeWebsite();
  }
})();

(() => {
  function setupLiminalHover() {
    const section = document.querySelector(".scroll-intro");

    if (
      !section ||
      !window.matchMedia(
        "(hover: hover) and (pointer: fine)"
      ).matches
    ) {
      return;
    }

    // Use your actual image filenames.
    const imagePaths = [
      "images/liminal-01.jpg",
      "images/liminal-02.jpg",
      "images/liminal-03.jpg"
    ];

    const motionPreference = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );

    const image = document.createElement("img");

    image.className = "liminal-hover-image";
    image.alt = "";
    image.setAttribute("aria-hidden", "true");

    // Movement is handled entirely through transform.
    image.style.left = "0px";
    image.style.top = "0px";

    section.prepend(image);

    let availableImages = [];
    let index = -1;
    let hovering = false;
    let entranceReady = false;
    let entranceTimer = null;
    let frame = null;
    let previousTime = null;

    let pointerX = 0;
    let pointerY = 0;
    let currentX = 0;
    let currentY = 0;
    let lastX = 0;
    let lastY = 0;
    let distance = 0;
    let lastSwitch = -Infinity;

    // Preload files before displaying them.
    Promise.all(
      imagePaths.map(path => {
        return new Promise(resolve => {
          const preload = new Image();

          preload.onload = () => resolve(path);
          preload.onerror = () => resolve(null);
          preload.src = path;
        });
      })
    ).then(paths => {
      availableImages = paths.filter(Boolean);

      if (hovering && entranceReady) {
        showNextImage();
      }
    });

    function showNextImage() {
      if (
        !hovering ||
        !entranceReady ||
        !availableImages.length
      ) {
        return;
      }

      index = (index + 1) % availableImages.length;
      image.src = availableImages[index];
      image.classList.add("is-visible");

      lastSwitch = performance.now();
      distance = 0;
    }

    function drawPosition() {
      image.style.transform = `
        translate3d(${currentX}px, ${currentY}px, 0)
        translate(-50%, -50%)
      `;
    }

    function animate(time) {
      frame = null;

      if (!hovering) return;

      const bounds = section.getBoundingClientRect();
      const targetX = pointerX - bounds.left;
      const targetY = pointerY - bounds.top;

      const delta = previousTime === null
        ? 16.67
        : Math.min(time - previousTime, 50);

      previousTime = time;

      const easing = motionPreference.matches
        ? 1
        : 1 - Math.exp(-delta / 110);

      currentX += (targetX - currentX) * easing;
      currentY += (targetY - currentY) * easing;

      const settled =
        Math.abs(targetX - currentX) < 0.1 &&
        Math.abs(targetY - currentY) < 0.1;

      if (settled) {
        currentX = targetX;
        currentY = targetY;
      }

      drawPosition();

      if (!settled) {
        frame = requestAnimationFrame(animate);
      } else {
        previousTime = null;
      }
    }

    function scheduleAnimation() {
      if (frame === null && hovering) {
        frame = requestAnimationFrame(animate);
      }
    }

    section.addEventListener("pointerenter", event => {
      hovering = true;
      entranceReady = false;
      previousTime = null;
      distance = 0;

      pointerX = lastX = event.clientX;
      pointerY = lastY = event.clientY;

      const bounds = section.getBoundingClientRect();

      currentX = pointerX - bounds.left;
      currentY = pointerY - bounds.top;

      drawPosition();
      clearTimeout(entranceTimer);

      entranceTimer = setTimeout(() => {
        if (!hovering) return;

        entranceReady = true;
        showNextImage();
      }, 150);
    });

    section.addEventListener("pointermove", event => {
      pointerX = event.clientX;
      pointerY = event.clientY;

      distance += Math.hypot(
        pointerX - lastX,
        pointerY - lastY
      );

      lastX = pointerX;
      lastY = pointerY;

      // Prevent images from switching too rapidly.
      if (
        entranceReady &&
        distance >= 200 &&
        performance.now() - lastSwitch >= 400
      ) {
        showNextImage();
      }

      scheduleAnimation();
    });

    function hideImage() {
      hovering = false;
      entranceReady = false;
      previousTime = null;

      clearTimeout(entranceTimer);
      image.classList.remove("is-visible");

      if (frame !== null) {
        cancelAnimationFrame(frame);
        frame = null;
      }
    }

    section.addEventListener("pointerleave", hideImage);
    section.addEventListener("pointercancel", hideImage);
    window.addEventListener("blur", hideImage);

    window.addEventListener("scroll", () => {
      if (!hovering) return;

      const bounds = section.getBoundingClientRect();

      if (
        pointerY < bounds.top ||
        pointerY > bounds.bottom ||
        pointerX < bounds.left ||
        pointerX > bounds.right
      ) {
        hideImage();
      } else {
        scheduleAnimation();
      }
    }, { passive: true });
  }

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      setupLiminalHover,
      { once: true }
    );
  } else {
    setupLiminalHover();
  }
})();
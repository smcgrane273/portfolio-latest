const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.16 }
);

document.querySelectorAll(".fade-in").forEach((node) => observer.observe(node));

const dotCanvas = document.createElement("canvas");
dotCanvas.className = "dot-field";
dotCanvas.setAttribute("aria-hidden", "true");
document.body.prepend(dotCanvas);

const dotContext = dotCanvas.getContext("2d");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const pointer = {
  x: window.innerWidth / 2,
  y: window.innerHeight / 2,
  active: false,
};

let dots = [];
let dotAnimationFrame;
let dotStart = performance.now();

const buildDots = () => {
  const spacing = Math.max(78, Math.min(90, window.innerWidth * 0.075));
  const radius = Math.max(20, Math.min(25, window.innerWidth * 0.023));
  const cols = Math.ceil(window.innerWidth / spacing) + 3;
  const rows = Math.ceil(window.innerHeight / spacing) + 3;

  dots = [];

  for (let row = -1; row < rows; row += 1) {
    for (let col = -1; col < cols; col += 1) {
      dots.push({
        x: col * spacing + 24,
        y: row * spacing + 18,
        radius,
        phase: (row * 0.78 + col * 1.18) % Math.PI,
        depth: 0.55 + ((row + col) % 4) * 0.12,
      });
    }
  }
};

const resizeDotField = () => {
  const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);

  dotCanvas.width = Math.floor(window.innerWidth * pixelRatio);
  dotCanvas.height = Math.floor(window.innerHeight * pixelRatio);
  dotCanvas.style.width = `${window.innerWidth}px`;
  dotCanvas.style.height = `${window.innerHeight}px`;
  dotContext.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

  buildDots();
};

const drawDots = (time = performance.now()) => {
  const elapsed = (time - dotStart) / 1000;

  dotContext.clearRect(0, 0, window.innerWidth, window.innerHeight);

  dots.forEach((dot) => {
    const driftX = prefersReducedMotion.matches ? 0 : Math.sin(elapsed * 0.16 + dot.phase) * 12 * dot.depth;
    const driftY = prefersReducedMotion.matches ? 0 : Math.cos(elapsed * 0.13 + dot.phase) * 10 * dot.depth;
    const distanceX = pointer.x - dot.x;
    const distanceY = pointer.y - dot.y;
    const distance = Math.hypot(distanceX, distanceY);
    const influence = pointer.active ? Math.max(0, 1 - distance / 360) : 0;
    const pullX = influence * distanceX * 0.04;
    const pullY = influence * distanceY * 0.04;
    const pulse = prefersReducedMotion.matches ? 0 : Math.sin(elapsed * 0.28 + dot.phase) * 4;

    dotContext.beginPath();
    dotContext.arc(
      dot.x + driftX + pullX,
      dot.y + driftY + pullY,
      dot.radius + pulse + influence * 18,
      0,
      Math.PI * 2
    );
    dotContext.fillStyle = `rgba(248, 248, 248, ${0.72 + influence * 0.08})`;
    dotContext.fill();
  });

  if (!prefersReducedMotion.matches) {
    dotAnimationFrame = requestAnimationFrame(drawDots);
  }
};

const startDotField = () => {
  cancelAnimationFrame(dotAnimationFrame);
  dotStart = performance.now();
  drawDots();
};

window.addEventListener("resize", () => {
  resizeDotField();
  startDotField();
});

window.addEventListener("pointermove", (event) => {
  pointer.x = event.clientX;
  pointer.y = event.clientY;
  pointer.active = true;
});

window.addEventListener("pointerleave", () => {
  pointer.active = false;
});

prefersReducedMotion.addEventListener("change", startDotField);
resizeDotField();
startDotField();

const archiveItems = Array.from(document.querySelectorAll(".archive-item"));
const archiveButton = document.querySelector("[data-load-more]");
const archiveFilters = Array.from(document.querySelectorAll("[data-filter]"));
const archiveSearch = document.querySelector("[data-archive-search]");

if (archiveItems.length) {
  const batchSize = 12;
  let visibleCount = 12;
  let activeFilter = "all";

  const getItemText = (item) => [
    item.textContent || "",
    Object.values(item.dataset).join(" "),
    item.getAttribute("href") || "",
  ].join(" ").toLowerCase();

  const getFilteredItems = () => {
    const searchTerm = archiveSearch ? archiveSearch.value.trim().toLowerCase() : "";

    return archiveItems.filter((item) => {
      const tags = (item.dataset.tags || "").split(/\s+/);
      const matchesFilter = activeFilter === "all" || tags.includes(activeFilter);
      const matchesSearch = !searchTerm || getItemText(item).includes(searchTerm);
      return matchesFilter && matchesSearch;
    });
  };

  const renderArchive = () => {
    const filteredItems = getFilteredItems();
    const filteredSet = new Set(filteredItems);

    archiveItems.forEach((item) => {
      const index = filteredItems.indexOf(item);
      item.classList.toggle("hidden", !filteredSet.has(item) || index >= visibleCount);
    });

    if (archiveButton) {
      archiveButton.hidden = visibleCount >= filteredItems.length;
    }
  };

  archiveFilters.forEach((filter) => {
    filter.addEventListener("click", () => {
      activeFilter = filter.dataset.filter || "all";
      visibleCount = batchSize;

      archiveFilters.forEach((button) => {
        const isActive = button === filter;
        button.classList.toggle("is-active", isActive);
        button.setAttribute("aria-pressed", String(isActive));
      });

      renderArchive();
    });
  });

  if (archiveSearch) {
    archiveSearch.addEventListener("input", () => {
      visibleCount = batchSize;
      renderArchive();
    });
  }

  if (archiveButton) {
    archiveButton.addEventListener("click", () => {
      visibleCount += batchSize;
      renderArchive();
    });
  }

  renderArchive();
}

const aboutGalleryImage = document.querySelector("[data-about-gallery]");

if (aboutGalleryImage) {
  const aboutGalleryImages = [
    "imageforaboutpage/updated/about-01.png",
    "imageforaboutpage/updated/about-02.png",
    "imageforaboutpage/updated/about-03.png",
    "imageforaboutpage/updated/about-04.png",
    "imageforaboutpage/updated/about-05.png",
    "imageforaboutpage/updated/about-06.png",
    "imageforaboutpage/updated/about-07.png",
  ];
  let aboutGalleryIndex = 0;

  aboutGalleryImage.addEventListener("dblclick", () => {
    aboutGalleryIndex = (aboutGalleryIndex + 1) % aboutGalleryImages.length;
    aboutGalleryImage.src = aboutGalleryImages[aboutGalleryIndex];
  });
}

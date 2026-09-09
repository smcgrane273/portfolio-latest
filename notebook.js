(() => {
  const writing = document.getElementById("notebook-writing");
  const status = document.getElementById("notebook-save");
  const key = "sophie-portfolio-running-to-do-list-v1";
  const resize = () => {
    writing.style.height = "auto";
    writing.style.height = `${Math.max(500, writing.scrollHeight)}px`;
  };
  const route = () => {
    const routes = { "running-to-do-list": "Running to do list", "city-that-never-sleeps": "City That Never Sleeps", "tech-a": "Tech A", "ramy-brook": "Ramy Brook" };
    const requested = window.location.hash.slice(1);
    const active = Object.hasOwn(routes, requested) ? requested : "";
    const unlocked = !document.getElementById("wip-content").hidden;
    document.getElementById("wip-index").hidden = Boolean(active);
    Object.keys(routes).forEach(id => { document.getElementById(id).hidden = id !== active; });
    document.body.classList.toggle("notebook-open", active === "running-to-do-list" && unlocked);
    document.body.classList.toggle("wip-project-open", Boolean(active) && unlocked);
    document.title = `sophie modigliani-mcgrane | ${unlocked && active ? routes[active] : "Work in progress"}`;
    if (unlocked) {
      document.getElementById(active === "running-to-do-list" ? "notebook-title" : active ? `${active}-title` : "wip-heading").focus();
      if (active === "running-to-do-list") resize();
    }
  };
  try {
    writing.value = localStorage.getItem(key) || "";
    status.textContent = writing.value ? "Saved on this device" : "";
  } catch {
    status.textContent = "Saving unavailable — keep this tab open to keep your list.";
  }
  writing.addEventListener("input", () => {
    resize();
    try {
      localStorage.setItem(key, writing.value);
      status.textContent = "Saved on this device";
    } catch {
      status.textContent = "Couldn’t save — copy your list before leaving.";
    }
  });
  document.getElementById("notebook-date").textContent = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  window.addEventListener("hashchange", route);
  window.addEventListener("resize", resize);
  document.addEventListener("wip-unlocked", route);
  document.addEventListener("wip-locked", route);
  route();
})();

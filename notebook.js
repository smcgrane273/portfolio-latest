(() => {
  const writing = document.getElementById("notebook-writing");
  const status = document.getElementById("notebook-save");
  const key = "sophie-portfolio-running-to-do-list-v1";
  const resize = () => {
    writing.style.height = "auto";
    writing.style.height = `${Math.max(500, writing.scrollHeight)}px`;
  };
  const route = () => {
    const isNotebook = window.location.hash === "#running-to-do-list";
    document.getElementById("wip-index").hidden = isNotebook;
    document.getElementById("running-to-do-list").hidden = !isNotebook;
    document.body.classList.toggle("notebook-open", isNotebook);
    document.title = `sophie modigliani-mcgrane | ${isNotebook ? "Running to do list" : "Work in progress"}`;
    if (!document.getElementById("wip-content").hidden) {
      document.getElementById(isNotebook ? "notebook-title" : "wip-heading").focus();
      if (isNotebook) resize();
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
  route();
})();

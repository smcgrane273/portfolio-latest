// A casual browser-side gate, not server authentication. Do not use for confidential assets.
(() => {
  const gate = document.getElementById("wip-gate");
  const content = document.getElementById("wip-content");
  const form = document.getElementById("wip-form");
  const password = document.getElementById("wip-password");
  const error = document.getElementById("wip-error");
  const lock = () => {
    gate.hidden = false;
    content.hidden = true;
    form.reset();
    error.textContent = "";
    password.removeAttribute("aria-invalid");
  };
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (password.value !== "sophie") {
      error.textContent = "That password isn’t right. Please try again.";
      password.setAttribute("aria-invalid", "true");
      password.focus();
      password.select();
      return;
    }
    form.reset();
    error.textContent = "";
    password.removeAttribute("aria-invalid");
    gate.hidden = true;
    content.hidden = false;
    document.getElementById("wip-heading").focus();
    document.dispatchEvent(new Event("wip-unlocked"));
  });
  password.addEventListener("input", () => {
    error.textContent = "";
    password.removeAttribute("aria-invalid");
  });
  document.getElementById("wip-lock").addEventListener("click", () => {
    lock();
    password.focus();
  });
  // Also relock when restored from the browser's back/forward cache.
  window.addEventListener("pageshow", lock);
})();

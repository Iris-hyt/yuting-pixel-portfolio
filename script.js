const root = document.documentElement;
root.classList.add("motion-ready");

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const pageDeck = document.querySelector("[data-page-deck]");
const pages = new Map(
  [...document.querySelectorAll("[data-page]")].map((page) => [page.dataset.page, page])
);
const pageLinks = [...document.querySelectorAll("[data-page-target]")];
let activePage = null;
let transitionTimer;

pages.forEach((page) => {
  const heading = page.querySelector("h1, h2");
  if (heading) heading.tabIndex = -1;
});

function pageFromHash() {
  const key = window.location.hash.replace("#", "");
  return pages.has(key) ? key : "cover";
}

function updatePageAccessibility(nextPage) {
  document.body.classList.toggle("is-cover", nextPage.dataset.page === "cover");

  pages.forEach((page) => {
    const active = page === nextPage;
    page.classList.toggle("is-active", active);
    page.toggleAttribute("inert", !active);
    page.setAttribute("aria-hidden", String(!active));
  });

  pageLinks.forEach((link) => {
    if (link.dataset.pageTarget === nextPage.dataset.page) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  });
}

function showPage(pageKey, { push = true, animate = true } = {}) {
  const nextPage = pages.get(pageKey);
  if (!nextPage || nextPage === activePage) return;

  window.clearTimeout(transitionTimer);
  const previousPage = activePage;
  const shouldAnimate = animate && !reduceMotion.matches;

  if (previousPage && shouldAnimate) {
    previousPage.classList.remove("is-active");
    previousPage.classList.add("is-leaving");
  }

  nextPage.classList.remove("is-leaving");
  nextPage.classList.add("is-active");
  if (shouldAnimate) nextPage.classList.add("is-entering");
  nextPage.scrollTop = 0;

  updatePageAccessibility(nextPage);
  activePage = nextPage;

  if (push && window.location.hash !== `#${pageKey}`) {
    window.history.pushState({ page: pageKey }, "", `#${pageKey}`);
  }

  const focusDelay = shouldAnimate ? 470 : 0;
  window.setTimeout(() => {
    nextPage.querySelector("h1, h2")?.focus({ preventScroll: true });
  }, focusDelay);

  transitionTimer = window.setTimeout(() => {
    if (previousPage) {
      previousPage.classList.remove("is-leaving", "is-entering");
    }
    nextPage.classList.remove("is-entering");
  }, shouldAnimate ? 740 : 20);
}

pageLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return;
    }

    const target = link.dataset.pageTarget;
    if (!pages.has(target)) return;
    event.preventDefault();
    showPage(target);
  });
});

window.addEventListener("popstate", () => {
  showPage(pageFromHash(), { push: false, animate: false });
});

const initialPage = pageFromHash();
updatePageAccessibility(pages.get(initialPage));
activePage = pages.get(initialPage);
if (!window.location.hash) {
  window.history.replaceState({ page: "cover" }, "", "#cover");
}

document.querySelectorAll("[data-page-back]").forEach((button) => {
  button.addEventListener("click", () => {
    const fallback = button.dataset.pageBack || "cover";
    showPage(fallback);
  });
});

document.querySelectorAll(".cat-project").forEach((cat) => {
  cat.addEventListener("pointermove", (event) => {
    if (event.pointerType === "touch") return;
    const rect = cat.getBoundingClientRect();
    const ratio = (event.clientX - rect.left) / rect.width - 0.5;
    cat.style.setProperty("--cat-tilt", `${(ratio * 6).toFixed(2)}deg`);
    cat.style.setProperty("--cat-lift", "-0.42rem");
  });

  cat.addEventListener("pointerleave", () => {
    cat.style.removeProperty("--cat-tilt");
    cat.style.removeProperty("--cat-lift");
  });
});

const toast = document.querySelector("[data-toast]");
const copyButton = document.querySelector("[data-copy-email]");

function showToast(message) {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("is-visible");
  window.clearTimeout(showToast.timeout);
  showToast.timeout = window.setTimeout(() => {
    toast.classList.remove("is-visible");
  }, 2200);
}

copyButton?.addEventListener("click", async () => {
  const email = copyButton.dataset.copyEmail;
  try {
    await navigator.clipboard.writeText(email);
    showToast("Email copied");
  } catch {
    const range = document.createRange();
    const text = document.createTextNode(email);
    const holder = document.createElement("span");
    holder.append(text);
    holder.style.position = "fixed";
    holder.style.opacity = "0";
    document.body.append(holder);
    range.selectNodeContents(holder);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
    const copied = document.execCommand("copy");
    holder.remove();
    showToast(copied ? "Email copied" : email);
  }
});

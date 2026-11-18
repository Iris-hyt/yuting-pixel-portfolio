const root = document.documentElement;
root.classList.add("motion-ready");

const revealItems = document.querySelectorAll(
  ".intro > *, .section-heading, .project-copy, .article-gallery, .plan-gallery, .skill-list, .toolbox-statement, .path-heading, .timeline li, .contact-grid"
);

revealItems.forEach((item, index) => {
  item.setAttribute("data-reveal", "");
  item.style.setProperty("--delay", `${Math.min(index % 3, 2) * 70}ms`);
});

if (new URLSearchParams(window.location.search).has("static")) {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
  );

  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

const catButton = document.querySelector("[data-cat-button]");
const catMessage = document.querySelector("[data-cat-message]");
const catLive = document.querySelector("[data-cat-live]");
const catMessages = [
  "先看我做的两个项目吧。",
  "正在寻找市场运营与内容方向的机会。",
  "合作或交流，都欢迎来信。",
  "谢谢你认真看到了这里。",
];
let catMessageIndex = 0;

catButton?.addEventListener("click", () => {
  catMessageIndex = (catMessageIndex + 1) % catMessages.length;
  const nextMessage = catMessages[catMessageIndex];
  catMessage.textContent = nextMessage;
  catLive.textContent = nextMessage;
  catButton.classList.remove("is-poked");
  catButton.classList.remove("is-blinking");
  void catButton.offsetWidth;
  catButton.classList.add("is-poked");
  catButton.classList.add("is-blinking");
  window.setTimeout(() => catButton.classList.remove("is-poked"), 450);
  window.setTimeout(() => catButton.classList.remove("is-blinking"), 650);
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
    showToast("邮箱已复制");
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
    showToast(copied ? "邮箱已复制" : email);
  }
});

document.querySelectorAll("[data-current-year]").forEach((item) => {
  item.textContent = String(new Date().getFullYear());
});

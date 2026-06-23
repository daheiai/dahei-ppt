export const slidesRuntime = String.raw`
(function () {
  const pages = Array.from(document.querySelectorAll(".page"));
  const progressBar = document.querySelector(".progress-bar");
  let current = 0;

  function showPage(index) {
    current = Math.max(0, Math.min(index, pages.length - 1));
    pages.forEach((page, pageIndex) => {
      page.classList.toggle("active", pageIndex === current);
    });

    if (progressBar) {
      progressBar.style.width = ((current + 1) / pages.length) * 100 + "%";
    }
  }

  window.addEventListener("keydown", (event) => {
    if (event.key === "ArrowRight" || event.key === " " || event.key === "Enter") {
      event.preventDefault();
      showPage(current + 1);
    }

    if (event.key === "ArrowLeft" || event.key === "Backspace") {
      event.preventDefault();
      showPage(current - 1);
    }
  });

  showPage(0);
})();
`;

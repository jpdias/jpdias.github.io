// Enhances the server-rendered "on this page" table of contents
// (markup generated at build time by _layouts/post.jekyll).
// Responsibilities kept here: scroll highlighting and nudging the fixed
// TOC down when the blog title wraps to two lines.
(function () {
  "use strict";

  var toc = document.getElementById("page-toc");
  if (!toc) return;

  var container = document.querySelector(".blog-content");
  if (!container) return;

  var inner = toc.querySelector(".toc-inner");
  var links = toc.querySelectorAll(".toc-item a");
  if (links.length < 2) return;

  // Pair each link with the element it points at.
  var entries = [];
  Array.prototype.forEach.call(links, function (link) {
    var href = link.getAttribute("href") || "";
    if (href.charAt(0) !== "#") return;
    var heading = document.getElementById(href.slice(1));
    if (!heading) return;
    entries.push({ heading: heading, link: link });
  });
  if (entries.length < 2) return;

  // The first entry ships pre-marked active in the HTML; keep the seed in
  // sync with whatever is actually paired, in case of mismatches.
  var first = entries[0].link;
  if (!first.classList.contains("active")) {
    first.classList.add("active");
    first.parentNode.classList.add("active");
  }

  // The TOC is position:fixed. CSS anchors it at 170px, which is correct for
  // a single-line blog title; when the title wraps to two lines the tagline
  // (and everything below) shifts down, so add the extra line(s) measured
  // against the h1's line-height.
  var TOC_BASE_TOP = 170;

  function placeToc() {
    if (toc.getClientRects().length === 0) return; // hidden at this width
    var h1 = container.querySelector("h1");
    if (!h1) return;
    var lh = parseFloat(getComputedStyle(h1).lineHeight) || 28.8;
    var lines = Math.max(1, Math.round(h1.getBoundingClientRect().height / lh));
    var top = Math.round(TOC_BASE_TOP + (lines - 1) * lh);
    var maxH = Math.max(160, window.innerHeight - top - 32);
    toc.style.top = top + "px";
    toc.style.maxHeight = maxH + "px";
    if (inner) inner.style.maxHeight = maxH + "px";
  }
  placeToc();
  window.addEventListener("resize", placeToc);
  window.addEventListener("load", placeToc);
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(placeToc);
  }

  // Highlight the section currently in view.
  function setActive(id) {
    entries.forEach(function (e) {
      var on = e.link.getAttribute("href") === "#" + id;
      e.link.classList.toggle("active", on);
      e.link.parentNode.classList.toggle("active", on);
    });
  }

  // IntersectionObserver: highlight the section currently in view.
  // rootMargin: "0px 0px -30% 0px" means the observer triggers when the
  // heading is within the top 70% of the viewport (instead of the old -70%
  // which only triggered in the top 30%). This fixes the issue where sections
  // like footnotes at the bottom of a page never got highlighted.
  if ("IntersectionObserver" in window) {
    var visible = {};
    var observer = new IntersectionObserver(
      function (observed) {
        observed.forEach(function (entry) {
          if (entry.isIntersecting) {
            delete visible[entry.target.id];
          } else {
            visible[entry.target.id] = true;
          }
        });
        // Topmost heading still on screen wins.
        for (var i = 0; i < entries.length; i++) {
          var id = entries[i].heading.id;
          if (!visible[id]) {
            setActive(id);
            return;
          }
        }
      },
      { rootMargin: "0px 0px -30% 0px", threshold: 0 }
    );
    entries.forEach(function (e) {
      observer.observe(e.heading);
    });
  }
})();
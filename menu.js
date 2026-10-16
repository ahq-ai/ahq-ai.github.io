/* ==========================================================
   MENU.JS: the shared menu, breadcrumb and footer for every page.
   Change the menu HERE, and every page updates automatically.
   ========================================================== */

/* 1. THE MENU STRUCTURE
   Each item is either a plain link, or a dropdown with a list of links.
   "soon: true" shows an item greyed out, without a link (page not built yet). */
const MENU = [
  { label: "Home", link: "index.html" },
  { label: "AI Marketing", link: "updates.html" },
  { label: "Learning Lab", items: [
      { label: "Keller's Brand Pyramid", link: "keller-pyramid.html" },
      { label: "Case Bank", soon: true }
  ]},
  { label: "About", items: [
      { label: "About", link: "about.html" },
      { label: "How we work", link: "how-we-work.html" }
  ]}
];

/* 2. THE BREADCRUMB TRAIL for each page ("you are here")
   The last step is the current page, so it has no link. */
const TRAILS = {
  "updates.html":        [["AI Marketing"]],
  "keller-pyramid.html": [["Learning Lab"], ["Keller's Brand Pyramid"]],
  "about.html":          [["About"]],
  "how-we-work.html":    [["About", "about.html"], ["How we work"]]
};

/* 3. WHICH PAGE ARE WE ON? Read the file name from the address bar */
const current = location.pathname.split("/").pop() || "index.html";

/* 4. BUILD THE MENU as HTML text */
let navHTML = "";
MENU.forEach(function (item) {
  if (item.items) {
    /* A dropdown: a button, plus a hidden list that opens on click */
    const isCurrent = item.items.some(function (sub) { return sub.link === current; });
    let list = "";
    item.items.forEach(function (sub) {
      if (sub.soon) {
        list += '<span class="soon">' + sub.label + ' <small>(soon)</small></span>';
      } else {
        list += '<a href="' + sub.link + '"' + (sub.link === current ? ' class="current"' : '') + '>' + sub.label + '</a>';
      }
    });
    navHTML += '<div class="menu-item">' +
      '<button class="dropdown-toggle' + (isCurrent ? ' current' : '') + '" aria-expanded="false">' + item.label + ' ▾</button>' +
      '<div class="dropdown">' + list + '</div></div>';
  } else {
    /* A plain link. The current page gets the gold "current" style */
    navHTML += '<a href="' + item.link + '"' + (item.link === current ? ' class="current"' : '') + '>' + item.label + '</a>';
  }
});

/* 5. BUILD THE BREADCRUMB (not shown on the homepage) */
let crumbHTML = "";
if (TRAILS[current]) {
  crumbHTML = '<div class="breadcrumb" aria-label="You are here"><a href="index.html">Home</a>';
  TRAILS[current].forEach(function (step) {
    crumbHTML += ' <span>›</span> ' + (step[1] ? '<a href="' + step[1] + '">' + step[0] + '</a>' : '<span class="here">' + step[0] + '</span>');
  });
  crumbHTML += '</div>';
}

/* 6. PUT THE MENU AND BREADCRUMB INTO THE PAGE, at <div id="site-header"> */
document.getElementById("site-header").innerHTML =
  '<header>' +
    '<a href="index.html" class="logo">Marketing and AI</a>' +
    '<nav class="main-nav">' + navHTML + '</nav>' +
  '</header>' + crumbHTML;

/* 7. PUT THE FOOTER INTO THE PAGE, at <div id="site-footer"> */
document.getElementById("site-footer").innerHTML =
  '<footer>' +
    '<p><a href="about.html">About</a> <a href="how-we-work.html">How we work</a></p>' +
    '<p>© 2026 Marketing and AI</p>' +
  '</footer>';

/* 8. MAKE THE DROPDOWNS WORK: click to open, click elsewhere or press Esc to close */
document.querySelectorAll(".dropdown-toggle").forEach(function (button) {
  button.addEventListener("click", function (event) {
    event.stopPropagation();
    const item = button.parentElement;
    const wasOpen = item.classList.contains("open");
    closeAll();
    if (!wasOpen) {
      item.classList.add("open");
      button.setAttribute("aria-expanded", "true");
    }
  });
});
function closeAll() {
  document.querySelectorAll(".menu-item.open").forEach(function (item) {
    item.classList.remove("open");
    item.querySelector(".dropdown-toggle").setAttribute("aria-expanded", "false");
  });
}
document.addEventListener("click", closeAll);
document.addEventListener("keydown", function (event) {
  if (event.key === "Escape") closeAll();
});

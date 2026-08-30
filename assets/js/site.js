/* Injects the shared header and footer. Pages need <div id="site-header">
   and <div id="site-footer">. */
(function () {
  const pages = [
    { href: "index.html",          label: "Home" },
    { href: "java-mods.html",      label: "Java Mods" },
    { href: "java-modpacks.html",  label: "Java Modpacks" },
    { href: "bedrock-addons.html", label: "Bedrock Addons" },
    { href: "info.html",           label: "Info" },
  ];

  const current = location.pathname.split("/").pop() || "index.html";

  const nav = pages
    .map(p => `<a href="${p.href}"${p.href === current ? ' class="active"' : ""}>${p.label}</a>`)
    .join("");

  const header = `
    <header class="site-header">
      <div class="wrap">
        <a class="brand" href="index.html">
          <img class="mark" src="/assets/img/brand/logo.png" alt="">
          Dried Fruit Studios
        </a>
        <button class="nav-toggle" aria-label="Menu">&#9776;</button>
        <nav class="nav-links">${nav}</nav>
      </div>
    </header>`;

  const year = new Date().getFullYear();
  const footer = `
    <footer class="site-footer">
      <div class="wrap">
        <div>&copy; ${year} Dried Fruit Studios LLC</div>
        <div>
          <a href="mailto:contact@driedfruitstudios.com">contact@driedfruitstudios.com</a> &nbsp;·&nbsp;
          <a href="https://discord.com/invite/72a7jmc5mb" target="_blank" rel="noopener">Discord</a> &nbsp;·&nbsp;
          <a href="https://www.youtube.com/@layncemc" target="_blank" rel="noopener">YouTube</a> &nbsp;·&nbsp;
          <a href="https://www.curseforge.com/members/craisinlord/projects" target="_blank" rel="noopener">CurseForge</a>
        </div>
      </div>
    </footer>`;

  const h = document.getElementById("site-header");
  const f = document.getElementById("site-footer");
  if (h) h.outerHTML = header;
  if (f) f.outerHTML = footer;

  const toggle = document.querySelector(".nav-toggle");
  const links = document.querySelector(".nav-links");
  if (toggle && links) {
    toggle.addEventListener("click", () => links.classList.toggle("open"));
  }
})();

/* Injects the shared banner, header, contact section, and footer. Pages need
   <div id="site-banner">, <div id="site-header">, <div id="site-contact">, and
   <div id="site-footer">. */
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

  const banner = `
    <img class="site-banner" src="/assets/img/brand/banner.jpg?v=1"
         alt="Dried Fruit Studios" width="2400" height="989">`;

  const header = `
    <header class="site-header">
      <div class="wrap">
        <a class="brand" href="index.html">
          <img class="mark" src="/assets/img/brand/logo.png?v=3" alt="">
          Dried Fruit Studios
        </a>
        <button class="nav-toggle" aria-label="Menu">&#9776;</button>
        <nav class="nav-links">${nav}</nav>
      </div>
    </header>`;

  const MAIL_ICON = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 6l-10 7L2 6"/></svg>`;
  const DISCORD_ICON = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z"/></svg>`;

  const contact = `
    <section class="contact-cta">
      <div class="wrap">
        <h2>Have an insane idea? Need help? Have a question?</h2>
        <p class="section-sub">We're always happy to hear from you.</p>
        <div class="contact-links">
          <a class="contact-item" href="mailto:contact@driedfruitstudios.com">
            <span class="contact-item-icon">${MAIL_ICON}</span>
            <span class="contact-item-text"><span class="label">Email us</span><span class="value">contact@driedfruitstudios.com</span></span>
          </a>
          <a class="contact-item" href="https://discord.com/invite/72a7jmc5mb" target="_blank" rel="noopener">
            <span class="contact-item-icon">${DISCORD_ICON}</span>
            <span class="contact-item-text"><span class="label">Join the conversation</span><span class="value">Discord Community</span></span>
          </a>
        </div>

        <form class="contact-form" id="contact-form">
          <h3>Send us a Message</h3>
          <div class="form-row">
            <label>Name<input type="text" name="name" placeholder="CraisinLord" required></label>
            <label>Email<input type="email" name="email" placeholder="you@example.com" required></label>
          </div>
          <label>Subject
            <select name="subject" required>
              <option value="" disabled selected>Choose one&hellip;</option>
              <option>General question</option>
              <option>Bug report</option>
              <option>Suggestion</option>
              <option>Partnership / business</option>
              <option>Marketplace / press</option>
              <option>Something else</option>
            </select>
          </label>
          <label>Message<textarea name="message" rows="5" placeholder="Tell us what's on your mind..." required></textarea></label>
          <button type="submit" class="btn">Send</button>
          <p class="form-note">Opens your email app with this filled in, addressed to contact@driedfruitstudios.com.</p>
        </form>
      </div>
    </section>`;

  const year = new Date().getFullYear();
  const footer = `
    <footer class="site-footer">
      <div class="wrap">
        <div>&copy; ${year} Dried Fruit Studios LLC</div>
        <div>
          <a href="mailto:contact@driedfruitstudios.com">contact@driedfruitstudios.com</a> &nbsp;·&nbsp;
          <a href="https://discord.com/invite/72a7jmc5mb" target="_blank" rel="noopener">Discord</a> &nbsp;·&nbsp;
          <a href="https://www.youtube.com/@driedfruitstudios" target="_blank" rel="noopener">YouTube</a> &nbsp;·&nbsp;
          <a href="https://www.curseforge.com/members/craisinlord/projects" target="_blank" rel="noopener">CurseForge</a>
        </div>
      </div>
    </footer>`;

  const b = document.getElementById("site-banner");
  const h = document.getElementById("site-header");
  const c = document.getElementById("site-contact");
  const f = document.getElementById("site-footer");
  if (b) b.outerHTML = banner;
  if (h) h.outerHTML = header;
  if (c) c.outerHTML = contact;
  if (f) f.outerHTML = footer;

  const toggle = document.querySelector(".nav-toggle");
  const links = document.querySelector(".nav-links");
  if (toggle && links) {
    toggle.addEventListener("click", () => links.classList.toggle("open"));
  }

  // No backend on GitHub Pages, so this builds a mailto: link and hands off
  // to the visitor's email app, addressed to contact@driedfruitstudios.com.
  const form = document.getElementById("contact-form");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = form.name.value.trim();
      const email = form.email.value.trim();
      const subject = form.subject.value;
      const message = form.message.value.trim();
      const body = `From: ${name} <${email}>\n\n${message}`;
      const url = `mailto:contact@driedfruitstudios.com`
        + `?subject=${encodeURIComponent(`[Website] ${subject}`)}`
        + `&body=${encodeURIComponent(body)}`;
      window.location.href = url;
    });
  }
})();

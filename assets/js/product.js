/* Renders one product into #product-detail, chosen by ?slug= in the URL. */
(function () {
  const mount = document.getElementById("product-detail");
  if (!mount) return;

  const slug = new URLSearchParams(location.search).get("slug");
  const STATUS = { "released": "Released", "in-development": "In development", "planned": "Coming soon" };
  const CAT = {
    "java-mod": ["Java Mods", "java-mods.html"],
    "java-modpack": ["Java Modpacks", "java-modpacks.html"],
    "bedrock-addon": ["Bedrock Addons", "bedrock-addons.html"],
  };
  const LINK = { curseforge: "View on CurseForge", modrinth: "View on Modrinth", marketplace: "Minecraft Marketplace", wiki: "Wiki", source: "Source" };

  if (!slug) { fail("No product specified."); return; }

  fetch("data/products.json")
    .then(r => r.json())
    .then(data => {
      const p = (data.products || []).find(x => x.slug === slug);
      if (!p) return fail("Product not found.");
      document.title = `${p.name} — Dried Fruit Studios`;
      render(p, data.generated);
    })
    .catch(() => fail("Could not load product data."));

  function render(p, generated) {
    const [catLabel, catHref] = CAT[p.category] || ["Products", "index.html"];
    const icon = p.icon ? `<img class="pd-icon" src="assets/img/${p.icon}" alt="">` : "";
    const loaders = (p.loaders || []).map(l => `<span class="badge">${esc(l)}</span>`).join("");
    const mc = p.minecraftVersions
      ? (Array.isArray(p.minecraftVersions) ? p.minecraftVersions.join(", ") : p.minecraftVersions)
      : "";
    const links = Object.entries(p.links || {})
      .filter(([, u]) => u)
      .map(([k, u]) => `<a class="btn${k === "curseforge" || k === "marketplace" ? "" : " secondary"}" href="${u}" target="_blank" rel="noopener">${LINK[k] || k}</a>`)
      .join("");
    const priceVal = p.free
      ? `<span class="badge free">Free</span>`
      : (p.category === "bedrock-addon" ? "Paid" : "");
    const facts = [
      ["Status", STATUS[p.status] || p.status],
      priceVal ? ["Price", priceVal] : null,
      loaders ? ["Loaders", loaders] : null,
      mc ? ["Minecraft", esc(mc)] : null,
      p.downloads ? ["Downloads", esc(fmt(p.downloads)) + (generated ? ` <span class="muted">(as of ${esc(generated)})</span>` : "")] : null,
    ].filter(Boolean).map(([k, v]) => `<div class="fact"><dt>${k}</dt><dd>${v}</dd></div>`).join("");

    const trailer = p.trailer
      ? `<div class="pd-trailer"><iframe src="https://www.youtube-nocookie.com/embed/${esc(ytId(p.trailer))}" title="${esc(p.name)} trailer" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen loading="lazy"></iframe></div>`
      : "";

    const gallery = (p.gallery || []).length
      ? `<h2>Gallery</h2><div class="pd-gallery">${p.gallery.map(g =>
          `<a href="assets/img/${g}" target="_blank" rel="noopener"><img src="assets/img/${g}" alt="" loading="lazy"></a>`).join("")}</div>`
      : "";

    mount.innerHTML = `
      <p class="crumb"><a href="${catHref}">&larr; ${catLabel}</a></p>
      <div class="pd-head">
        ${icon}
        <div>
          <h1>${esc(p.name)}</h1>
          <p class="pd-summary">${esc(p.summary || "")}</p>
          <div class="pd-actions">${links}</div>
        </div>
      </div>
      ${trailer}
      <dl class="pd-facts">${facts}</dl>
      ${gallery}`;
  }

  function fail(msg) {
    mount.innerHTML = `<p class="empty-note">${esc(msg)}</p><p><a href="index.html">Back to home</a></p>`;
  }
  function ytId(url) {
    return url.split("watch?v=").pop().split("/").pop().split("&")[0];
  }
  function fmt(n) {
    if (n >= 1e6) return (n / 1e6).toFixed(n >= 1e7 ? 0 : 1).replace(/\.0$/, "") + "M";
    if (n >= 1e3) return (n / 1e3).toFixed(n >= 1e4 ? 0 : 1).replace(/\.0$/, "") + "K";
    return String(n);
  }
  function esc(s) {
    return String(s).replace(/[&<>"']/g, c => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
    }[c]));
  }
})();

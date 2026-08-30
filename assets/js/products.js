/* #product-grid attributes: data-category (java-mod|java-modpack|bedrock-addon|all),
   data-featured="true", data-limit="N". */
(function () {
  const mount = document.getElementById("product-grid");
  if (!mount) return;

  const wantCategory = mount.dataset.category || "all";
  const wantFeatured = mount.dataset.featured === "true";
  const limit = mount.dataset.limit ? parseInt(mount.dataset.limit, 10) : null;
  const squareThumbs = mount.dataset.thumb === "square";

  const STATUS = {
    "released": "Released",
    "in-development": "In development",
    "planned": "Coming soon",
  };

  fetch("data/products.json")
    .then(r => r.json())
    .then(data => {
      let items = data.products || [];
      if (wantCategory !== "all") items = items.filter(p => p.category === wantCategory);
      if (wantFeatured) items = items.filter(p => p.featured);

      const rank = { "released": 0, "in-development": 1, "planned": 2 };
      items.sort((a, b) =>
        (rank[a.status] ?? 9) - (rank[b.status] ?? 9) ||
        (b.downloads || 0) - (a.downloads || 0));

      if (limit) items = items.slice(0, limit);

      if (items.length === 0) {
        mount.innerHTML = `<p class="empty-note">Nothing here yet — check back soon.</p>`;
        return;
      }
      mount.className = "grid";
      mount.innerHTML = items.map(cardHTML).join("");
    })
    .catch(err => {
      mount.innerHTML = `<p class="empty-note">Could not load products.</p>`;
      console.error(err);
    });

  function cardHTML(p) {
    const href = `product.html?slug=${encodeURIComponent(p.slug)}`;
    const img = squareThumbs ? p.icon : (p.thumb || p.icon);
    const cls = squareThumbs ? "thumb thumb--square" : "thumb";
    const thumb = img
      ? `<img class="${cls}" src="assets/img/${img}" alt="" loading="lazy">`
      : `<div class="${cls} thumb--empty"></div>`;
    const free = p.free ? `<span class="badge free">Free</span>` : "";
    const loaders = (p.loaders || []).slice(0, 3).map(l => `<span class="badge">${esc(l)}</span>`).join("");
    const dl = p.downloads ? `<span class="dl">${fmt(p.downloads)} downloads</span>` : "";
    const mc = p.minecraftVersions
      ? `<span class="dl">MC ${esc(Array.isArray(p.minecraftVersions) ? p.minecraftVersions.join(", ") : p.minecraftVersions)}</span>`
      : "";

    return `
      <a class="card" href="${href}">
        ${thumb}
        <div class="body">
          <h3>${esc(p.name)}</h3>
          <div class="meta">
            <span class="badge ${p.status}">${STATUS[p.status] || p.status}</span>
            ${free}
            ${loaders}
          </div>
          <p class="tagline">${esc(p.summary || "")}</p>
          <div class="card-foot">${dl}${mc}</div>
        </div>
      </a>`;
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

# driedfruitstudios.com

Portfolio site for Dried Fruit Studios LLC, a Minecraft modding and Bedrock
addon studio led by CraisinLord.

Hosted on GitHub Pages from `main`, custom domain via `CNAME`.

## Stack

Static HTML/CSS/JS, no build step and no runtime dependencies. The header and
footer are injected by `assets/js/site.js`. The catalog pages and the
per-product detail page render from `data/products.json` in the browser.

## Files

```
index.html             Landing page
java-mods.html          Card grid, data-category="java-mod"
java-modpacks.html      Card grid, data-category="java-modpack"
bedrock-addons.html     Card grid, data-category="bedrock-addon"
product.html            Detail page, reads ?slug=<slug> from the URL
info.html               Studio, team, contact
404.html                Custom 404
data/products.json      Product data (generated)
assets/js/site.js       Header + footer
assets/js/products.js   Card grids
assets/js/product.js    Detail page
assets/css/style.css    Theme (draft: dark purple + gold)
assets/img/products/<slug>/   icon.* and g1.*..gN.* per product
assets/img/team/        Member avatars
tools/build_products.py Regenerates data/products.json and downloads art
```

## Updating the catalog

`data/products.json` is generated. Edit the `CURATED`, `CF_ONLY`,
`COMING_SOON_PACKS` and `BEDROCK` lists in `tools/build_products.py`, then:

```bash
python tools/build_products.py --refresh
```

`--refresh` re-pulls the Modrinth API; without it the script uses the cached
`tools/modrinth_projects.json`. Modrinth provides names, summaries, loaders,
versions, download counts, icons and galleries. CurseForge download totals are
hardcoded in the script (CurseForge has no free API) and are baked in at
generate time, so they do not update on their own.

Per-entry fields: `slug, name, category, status, free, summary, trailer, icon,
thumb, gallery, loaders, minecraftVersions, downloads, links, featured`. Set
`featured` to put an item on the home page. You can also hand-edit
`data/products.json` directly for a one-off change.

## Local preview

`fetch()` needs a server, not `file://`:

```bash
python -m http.server 8000
```

Then open http://localhost:8000

## Deploy

Push to `main`. In repo settings, Pages should be set to deploy from `main` /
root, with the custom domain `driedfruitstudios.com` and Enforce HTTPS on.

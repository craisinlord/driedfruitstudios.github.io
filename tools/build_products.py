"""Regenerate data/products.json and download product art.

    python tools/build_products.py             use cached tools/modrinth_projects.json
    python tools/build_products.py --refresh    re-pull from the Modrinth API first

CurseForge download totals are hardcoded below; CF has no free API. Update them
by hand.
"""
import json, re, sys, urllib.request, pathlib

REPO = pathlib.Path(__file__).resolve().parent.parent
IMGDIR = REPO / "assets" / "img" / "products"
SCRATCH = pathlib.Path(__file__).parent
CACHE = SCRATCH / "modrinth_projects.json"

UA = {"User-Agent": "driedfruitstudios-site-setup (contact@driedfruitstudios.com)"}

if "--refresh" in sys.argv or not CACHE.exists():
    req = urllib.request.Request(
        "https://api.modrinth.com/v2/user/craisinlord/projects", headers=UA)
    with urllib.request.urlopen(req, timeout=30) as r:
        CACHE.write_bytes(r.read())
    print("refreshed", CACHE)

mod = {p["slug"]: p for p in json.load(open(CACHE, encoding="utf-8"))}

# CurseForge download totals, approximate, captured 2026-08-30.
CF_DL = {
    "idas": 28_900_000, "integrated-api": 29_200_000, "integrated-villages": 10_600_000,
    "integrated-stronghold": 20_800_000, "integrated-cataclysm": 5_700_000,
    "integrated-simply-swords": 1_300_000, "integrated-cobblemon": 11_200,
    "antarchy": 60_400, "modern-morph": 1_000, "modern-apple-cows": 21_900,
    "sizeable-foliage": 67_400, "decorative-sniffer-eggs": 662,
    "cartographers-quills": 448, "dynamic-villager-trades-neoforge": 3_914,
    "dark-loading-screen-neoforge": 3_500, "electric-boogaloo": 835,
    "integrated-minecraft": 1_840_472,
}

LOADER_LABEL = {"forge": "Forge", "fabric": "Fabric", "neoforge": "NeoForge",
                "quilt": "Quilt", "bedrock": "Bedrock"}

def mc_range(vers):
    real = [v for v in vers if re.match(r"^1\.(1[6-9]|20|21)(\.\d)?$", v)]
    if not real:
        return []
    return real[0] if len(real) == 1 else f"{real[0]} \u2013 {real[-1]}"

NAME_OVERRIDE = {"integrated-catalcysm": "Integrated Cataclysm"}

def dl(url, dest: pathlib.Path):
    if dest.exists():
        return dest.name
    dest.parent.mkdir(parents=True, exist_ok=True)
    try:
        req = urllib.request.Request(url, headers=UA)
        with urllib.request.urlopen(req, timeout=30) as r:
            dest.write_bytes(r.read())
        print("  downloaded", dest.relative_to(REPO))
        return dest.name
    except Exception as e:
        print("  FAILED", url, e)
        return None

def ext_of(url, default=".png"):
    tail = url.split("?")[0].rsplit("/", 1)[-1]
    return ("." + tail.rsplit(".", 1)[-1]) if "." in tail else default

# (slug, category, status, featured) in display order.
CURATED = [
    # Java mods
    ("idas", "java-mod", "released", False),
    ("integrated-stronghold", "java-mod", "released", False),
    ("integrated-villages", "java-mod", "released", False),
    ("integrated-cataclysm", "java-mod", "released", False),
    ("integrated-simply-swords", "java-mod", "released", False),
    ("integrated-cobblemon", "java-mod", "released", False),
    ("integrated-api", "java-mod", "released", False),
    ("antarchy", "java-mod", "released", True),
    ("modern-morph", "java-mod", "released", False),
    ("modern-apple-cows", "java-mod", "released", False),
    ("sizeable-foliage", "java-mod", "released", True),
    ("decorative-sniffer-eggs", "java-mod", "released", False),
    ("cartographers-quills", "java-mod", "released", False),
    ("dynamic-villager-trades-neoforge", "java-mod", "released", False),
    ("dark-loading-screen-neoforge", "java-mod", "released", False),
    ("electric-boogaloo", "java-mod", "released", False),
    # Java modpacks
    ("integrated-minecraft", "java-modpack", "released", True),
]

# Entries that aren't on Modrinth, so their data is filled in here instead.
CF_ONLY = {
    "cartographers-quills": dict(
        name="Cartographer's Quills",
        summary="A standalone NeoForge 1.21 port of the Supplementaries cartographer quill feature.",
        loaders=["NeoForge"], mc="1.21.1",
        cf="https://www.curseforge.com/minecraft/mc-mods/cartographers-quills",
        modrinth="",
        logo="https://media.forgecdn.net/avatars/1841/420/639159706075092158.png"),
    "dynamic-villager-trades-neoforge": dict(
        name="Dynamic Villager Trades",
        summary="Redesigns villager trading; villagers choose trades based on past player interactions and refresh daily.",
        loaders=["NeoForge"], mc="1.21.1",
        cf="https://www.curseforge.com/minecraft/mc-mods/dynamic-villager-trades-neoforge",
        modrinth="",
        logo="https://media.forgecdn.net/avatars/1833/534/639156681343949902.png"),
    "integrated-minecraft": dict(
        name="Integrated MC",
        summary="The official modpack for the Integrated Structures mods: exploration through quests, recipes, lore and structures.",
        loaders=["Forge"], mc="1.20.1",
        cf="https://www.curseforge.com/minecraft/modpacks/integrated-minecraft",
        modrinth="",
        logo="https://media.forgecdn.net/avatars/959/574/638454692108164316.png"),
}

CF_SLUG = {
    "integrated-cataclysm": "integrated-cataclysm",
    "idas": "idas",
    "dark-loading-screen-neoforge": "dark-loading-screen-neoforge",
}

# Modrinth spells this one "catalcysm".
MODRINTH_SLUG = {"integrated-cataclysm": "integrated-catalcysm"}

# The trailer embeds at the top of the detail page and its YouTube thumbnail
# becomes the card thumbnail. TODO: confirm this is the right Antarchy video.
TRAILER = {"antarchy": "https://www.youtube.com/watch?v=_FQfNC0Hc5c"}

def is_free(slug, category):
    if category in ("java-mod", "java-modpack"):
        return True
    return slug == "bedrock-corn"

def yt_id(url):
    return url.rsplit("watch?v=", 1)[-1].rsplit("/", 1)[-1].split("&")[0]

products = []
for slug, category, status, featured in CURATED:
    m = mod.get(MODRINTH_SLUG.get(slug, slug))
    folder = IMGDIR / slug
    if m:
        name = NAME_OVERRIDE.get(m["slug"], m["title"].strip())
        summary = (m.get("description") or "").strip()
        loaders = [LOADER_LABEL.get(l, l) for l in m.get("loaders", [])]
        mcv = mc_range(m.get("game_versions", []))
        modrinth_url = f"https://modrinth.com/{'modpack' if category=='java-modpack' else 'mod'}/{MODRINTH_SLUG.get(slug, slug)}"
        cf_type = "modpacks" if category == "java-modpack" else "mc-mods"
        cf_url = f"https://www.curseforge.com/minecraft/{cf_type}/{CF_SLUG.get(slug, slug)}"
        icon = dl(m["icon_url"], folder / ("icon" + ext_of(m["icon_url"]))) if m.get("icon_url") else None
        gallery = []
        for i, g in enumerate((m.get("gallery") or [])[:6], 1):
            u = g["url"]
            n = dl(u, folder / (f"g{i}" + ext_of(u)))
            if n:
                gallery.append(f"products/{slug}/{n}")
        md_dl = m.get("downloads", 0)
    else:
        c = CF_ONLY[slug]
        name = c["name"]; summary = c["summary"]; loaders = c["loaders"]; mcv = c["mc"]
        modrinth_url = c["modrinth"]; cf_url = c["cf"]
        icon = dl(c["logo"], folder / ("icon" + ext_of(c["logo"]))) if c.get("logo") else None
        gallery = []
        md_dl = 0

    downloads = CF_DL.get(slug, 0) + md_dl

    icon_path = f"products/{slug}/{icon}" if icon else ""
    thumb_path = icon_path
    trailer = TRAILER.get(slug, "")
    if trailer:
        tn = dl(f"https://i.ytimg.com/vi/{yt_id(trailer)}/maxresdefault.jpg",
                folder / "trailer-thumb.jpg")
        if tn:
            thumb_path = f"products/{slug}/{tn}"

    entry = {
        "slug": slug,
        "name": name,
        "category": category,
        "status": status,
        "free": is_free(slug, category),
        "summary": summary,
        "trailer": trailer,
        "icon": icon_path,
        "thumb": thumb_path,
        "gallery": gallery,
        "loaders": loaders,
        "minecraftVersions": mcv,
        "downloads": downloads,
        "links": {k: v for k, v in (("curseforge", cf_url), ("modrinth", modrinth_url)) if v},
        "featured": featured,
    }
    products.append(entry)

# Coming-soon modpacks, not published anywhere yet.
COMING_SOON_PACKS = [
    ("integrated-mc-2", "Integrated MC 2.0", "The next generation of Integrated MC."),
    ("integrated-boogaloo", "Integrated Boogaloo", "A re-imagining of Crazy Craft."),
]
for slug, name, summary in COMING_SOON_PACKS:
    products.append({
        "slug": slug, "name": name, "category": "java-modpack", "status": "planned",
        "free": True, "summary": summary, "trailer": "",
        "icon": "", "thumb": "", "gallery": [], "loaders": [],
        "minecraftVersions": "", "downloads": 0, "links": {}, "featured": False,
    })

# Bedrock addons, in development. (slug, name, summary, java mod to borrow the icon from)
BEDROCK = [
    ("bedrock-apple-cows", "Apple Cows", "Adds Apple Cows, Golden Apple Cows, and Enchanted Golden Apple Cows to Bedrock.", "modern-apple-cows"),
    ("bedrock-corn", "Corn", "Adds Wild Corn, Corn Crops, corn foods, and High Fructose Corn Syrup.", None),
    ("bedrock-hoverboards", "Untitled Hoverboards", "Rideable hoverboards. Working title.", "antarchy"),
    ("bedrock-sizeable-foliage", "Sizeable Foliage", "Size variation for vanilla plants, ported from the Java mod.", "sizeable-foliage"),
]
for slug, name, summary, java_src in BEDROCK:
    icon_path = f"products/{java_src}/icon.webp" if java_src else ""
    products.append({
        "slug": slug,
        "name": name,
        "category": "bedrock-addon",
        "status": "in-development",
        "free": is_free(slug, "bedrock-addon"),
        "summary": summary,
        "trailer": "",
        "icon": icon_path,
        "thumb": icon_path,
        "gallery": [],
        "loaders": ["Bedrock"],
        "minecraftVersions": "Bedrock 1.21+",
        "downloads": 0,
        "links": {},
        "featured": False,
    })

out = {
    "$comment": "Generated by tools/build_products.py. Re-run that script or hand-edit for one-offs. Download counts are static and go stale.",
    "generated": "2026-08-30",
    "products": products,
}
(REPO / "data" / "products.json").write_text(json.dumps(out, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
print("\nwrote", REPO / "data" / "products.json", "-", len(products), "products")

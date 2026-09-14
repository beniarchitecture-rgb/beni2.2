"""Optimisation one-off : telecharge les images CDN, convertit en WebP (max 1920px, q82),
les pousse sur l'object storage, met a jour MongoDB + ecrit le mapping pour siteConfig.js."""
import hashlib
import io
import json
import os
import sys
import time

import requests
from PIL import Image
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv("/app/backend/.env")

STORAGE_BASE = (os.environ.get("INTEGRATION_PROXY_URL") or "").strip() or "https://integrations.emergentagent.com"
STORAGE_URL = STORAGE_BASE.rstrip("/") + "/objstore/api/v1/storage"
EMERGENT_KEY = os.environ["EMERGENT_LLM_KEY"]

db = MongoClient(os.environ["MONGO_URL"])[os.environ["DB_NAME"]]

resp = requests.post(f"{STORAGE_URL}/init", json={"emergent_key": EMERGENT_KEY}, timeout=30)
resp.raise_for_status()
SKEY = resp.json()["storage_key"]
print("storage init OK", flush=True)

projects = list(db.projects.find({}))
print(f"{len(projects)} projets: {[p['id'] for p in projects]}", flush=True)

urls = set()
for p in projects:
    if p.get("imageUrl"):
        urls.add(p["imageUrl"])
    for g in p.get("gallery") or []:
        if g:
            urls.add(g)
urls = sorted(urls)
print(f"{len(urls)} images uniques a traiter", flush=True)

mapping = {}
ok = fail = 0
for i, url in enumerate(urls, 1):
    if url.startswith("/api/files/"):
        mapping[url] = url
        continue
    try:
        r = requests.get(url, timeout=60)
        r.raise_for_status()
        img = Image.open(io.BytesIO(r.content)).convert("RGB")
        if max(img.size) > 1920:
            img.thumbnail((1920, 1920), Image.LANCZOS)
        buf = io.BytesIO()
        img.save(buf, "WEBP", quality=82, method=6)
        data = buf.getvalue()
        name = hashlib.md5(url.encode()).hexdigest()
        path = f"beni-architecture/optimized/{name}.webp"
        up = requests.put(
            f"{STORAGE_URL}/objects/{path}",
            headers={"X-Storage-Key": SKEY, "Content-Type": "image/webp"},
            data=data,
            timeout=120,
        )
        up.raise_for_status()
        db.files.update_one(
            {"storage_path": path},
            {"$set": {
                "storage_path": path,
                "original_filename": url.split("/")[-1],
                "content_type": "image/webp",
                "size": len(data),
                "is_deleted": False,
                "created_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
            }, "$setOnInsert": {"id": name}},
            upsert=True,
        )
        new_url = f"/api/files/{path}"
        mapping[url] = new_url
        ok += 1
        print(f"[{i}/{len(urls)}] {len(r.content)//1024} Ko -> {len(data)//1024} Ko  {url[-60:]}", flush=True)
    except Exception as e:
        fail += 1
        mapping[url] = url
        print(f"[{i}/{len(urls)}] ECHEC {url[-60:]}: {e}", flush=True)

json.dump(mapping, open("/app/backups/url_mapping.json", "w"), indent=1)
print(f"telechargement/conversion: {ok} OK, {fail} echecs", flush=True)

# Mise a jour MongoDB
updated = 0
for p in projects:
    new_image = mapping.get(p.get("imageUrl"), p.get("imageUrl"))
    new_gallery = [mapping.get(g, g) for g in (p.get("gallery") or [])]
    if new_image != p.get("imageUrl") or new_gallery != (p.get("gallery") or []):
        db.projects.update_one(
            {"id": p["id"]},
            {"$set": {"imageUrl": new_image, "gallery": new_gallery}},
        )
        updated += 1
print(f"MongoDB: {updated} projets mis a jour", flush=True)
print("TERMINE", flush=True)

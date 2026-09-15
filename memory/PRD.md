# PRD — BENI Architecture (Clonage & Mise en ligne)

## Problem statement original
Reproduire le site BENI Architecture existant à l'identique (repo : https://github.com/beniarchitecture-rgb/Beni2.0.git), le faire tourner de bout en bout (React + FastAPI + MongoDB), corriger uniquement ce qui bloque, puis déployer. Aucune nouvelle fonctionnalité. Hors portée : admin/CMS, notifications email/WhatsApp, nettoyage des libs d'auth inutilisées.

## Architecture
- Frontend : React 19 + CRACO + Tailwind + shadcn/ui, three.js/@react-three/fiber, GSAP, framer-motion. Contenu codé en dur dans `frontend/src/data/siteConfig.js`.
- Backend : FastAPI + Motor (async), routes sous `/api` (`/`, `/status`, `/contact`).
- DB : MongoDB via `MONGO_URL` / `DB_NAME` (backend/.env). Frontend via `REACT_APP_BACKEND_URL` (frontend/.env).

## Personas
- Visiteur / prospect : parcourt le portfolio, les pages Vision/Architecture/Développement/Construction, contacte le cabinet (FR/EN).
- Cabinet BENI : consulte les messages reçus en base (pas encore de notifications).

## Implémenté
- 14/09/2026 : Clonage du repo Beni2.0 dans /app (structure identique à la plateforme). Conservation du craco.config.js plateforme (overlay) et réintégration de `@emergentbase/overlay`. `yarn install` (three, fiber, gsap ajoutés).
- 14/09/2026 : Fix bloquant — `frontend/.env` du repo écrasait `REACT_APP_BACKEND_URL` avec l'ancienne URL (beni-deploy…) → CORS error sur le formulaire. .env restauré avec l'URL courante ; formulaire vérifié end-to-end (UI → POST /api/contact → MongoDB).
- 14/09/2026 : SEO — domaine en dur (beni-preview…) remplacé par l'URL courante dans index.html (og:url, og:image, canonical, JSON-LD) + `public/llms.txt` créé.
- 14/09/2026 : Vérifications — home, portfolio (15 projets, filtres), contact, mobile OK ; endpoints curl OK ; audit de déploiement PASS (prêt pour la production).
- 14/09/2026 : Panneau admin projets — Auth JWT (cookies httpOnly, refresh, anti brute-force 5 échecs/15 min), admin seedé depuis env (admin@beniarchitecture.com). CRUD projets protégé : POST/PUT/DELETE /api/admin/projects + GET /api/projects public + GET /api/admin/messages. Seed des 15 projets en base au démarrage (backend/seed_projects.json généré depuis siteConfig.js). Frontend : /admin/login + /admin (onglets Projets/Messages, éditeur FR/EN complet), pages publiques (Portfolio, détail projet, home, PortfolioStrip) alimentées par l'API avec repli sur les données statiques.
- 14/09/2026 : Fix accès admin — les cookies httpOnly étaient bloqués dans certains contextes navigateur (iframe de preview, blocage cookies tiers), empêchant la connexion. L'auth utilise désormais un token Bearer stocké en localStorage en plus des cookies (login renvoie access_token/refresh_token dans le corps, /auth/refresh accepte le Bearer, get_current_user accepte les deux). Vérifié : panneau accessible même avec tous les cookies supprimés.
- 14/09/2026 : Upload d'images depuis l'admin — object storage Emergent (EMERGENT_LLM_KEY, préfixe beni-architecture/). POST /api/admin/upload protégé (JPG/PNG/WebP/GIF, 10 Mo max) + GET /api/files/{path} public avec cache long. Références fichiers en base (collection files, soft-delete). Éditeur de projet : bouton « Envoyer une image » (image principale) et « Ajouter des images » (galerie multiple) avec miniatures et suppression ; les URLs /api/files/... se remplissent automatiquement et s'affichent sur le site public.
- 14/09/2026 : Simplification éditeur — champs EN retirés du formulaire (saisie FR uniquement) ; à l'enregistrement, les valeurs EN vides reprennent automatiquement le contenu FR (les traductions EN existantes sont conservées). Vérifié : 0 champ EN dans le formulaire, page publique EN affiche le texte FR en repli.
- 14/09/2026 : Notifications email — chaque message du formulaire contact déclenche un email vers beniarchitecture@gmail.com (Resend géré par Emergent, EMERGENT_EMAIL_KEY, from_name « BENI Architecture », template serveur fixe avec échappement HTML, fire-and-forget non bloquant via asyncio.create_task). Vérifié : clé valide (202), email envoyé à chaque soumission test.
- 14/09/2026 : Mot de passe admin changé → « Beni-Archi-2026-Villa! » (ancien désactivé, vérifié 401).
- 14/09/2026 : Fix critique récurrent — la plateforme réécrase périodiquement frontend/.env avec l'ancienne URL du fork (beni-deploy…), cassant login/upload (CORS/404). api.js utilise désormais window.location.origin en priorité (ingress même origine), REACT_APP_BACKEND_URL en repli seulement. Vérifié : bundle sans l'ancienne URL, login + formulaire contact OK dans le navigateur.
- 14/09/2026 : Sécurisation — GET /api/contact (liste publique des messages) supprimé ; les messages ne sont lisibles que via /api/admin/messages (JWT requis). POST /api/contact reste public. Vérifié : GET public → 405, POST → 200, admin sans auth → 401, avec auth → 200.
- 14/09/2026 : Perf mobile — constat : three.js/GSAP/framer-motion NON bundlés (code mort, 0 coût) ; le poids réel était les images CDN (1,3-3 Mo PNG chacune). Actions : 62 images converties en WebP (max 1920px, q82) via /app/scripts/optimize_images.py → ~200 Ko chacune (x10 plus léger), ré-hébergées sur l'object storage (/api/files/...) ; MongoDB + siteConfig.js mis à jour (sauvegardes dans /app/backups/). Vidéo lumina.mp4 (535 Ko) différée : chargée uniquement quand visible (IntersectionObserver). Mesures slow-4G mobile : événement load 11,5 s → 5,8 s en mode dev ; le build de production allège encore le JS (484 Ko minifié ≈ 150 Ko gzip vs 2,8 Mo dev). NB : la vidéo ne joue pas dans le navigateur de test (Chromium sans H.264) mais le codec est H.264/avc1, lisible par tous les vrais navigateurs.

## Backlog priorisé
- P2 : Gestion des autres contenus (actualités, textes) dans l'admin.
- P2 : Supprimer les composants three.js inutilisés (components/three/) et les deps gsap/framer-motion/three du package.json (code mort confirmé non bundlé).

## Prochaines tâches
1. Déployer en production (les variables JWT_SECRET / ADMIN_* / EMERGENT_* suivent le .env).
2. Gestion des actualités dans l'admin.

## Direction artistique (14/09/2026)
- Typographie refaite à la demande de l'utilisateur : titres en grotesque majuscules (style grands cabinets internationaux) + accents en **Cormorant Garamond italique orange** (signature conservée). Corps en Outfit.
- Police des titres : **Archivo** graisse 500 (retouche après essai d'Anton, jugée « beaucoup trop grasse » par l'utilisateur). Curseur d'ajustement : font-weight dans index.css (règles h1-h5, .section-header h2, .stat-num) — 400 = plus léger, 600 = plus de présence. Modifs centralisées : index.html (Google Fonts), index.css. Admin conservé en Cormorant (outil interne).
- Ordre du portfolio : les nouveaux projets créés dans l'admin apparaissent en première position (le plus récent d'abord) ; l'ordre des projets existants est préservé (order décroissant en négatif à la création). Vérifié par test API (création A puis B → B premier, A deuxième, existants inchangés).
- Navigation : ajout d'un ScrollToTop dans App.js — chaque changement de page (ex. clic sur un projet) ramène en haut de page (scroll instantané). Vérifié : clic depuis le bas du portfolio (scroll 3499px) → page détail ouverte en position 0.
- Diaporama projets : le hero des pages détail projet fait défiler automatiquement toutes les photos du projet (image principale + galerie, fondu 1 s toutes les 4,5 s), avec indicateurs cliquables en bas à droite. Vérifié : avance auto + clic sur indicateur changent l'image.

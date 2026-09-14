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

## Backlog priorisé
- P0 : Notifications sur le formulaire de contact (Resend/SendGrid ou WhatsApp via Twilio) — les messages sont visibles dans l'admin mais personne n'est prévenu.
- P1 : Mesure des perfs mobile (three.js + GSAP + framer-motion) et SEO au déploiement.
- P2 : Sécuriser/retirer `GET /api/contact` public (remplacé par /api/admin/messages protégé).
- P2 : Gestion des autres contenus (actualités, textes) dans l'admin.

## Prochaines tâches
1. Brancher Resend pour notifier beniarchitecture@gmail.com à chaque message.
2. Déployer en production (les variables JWT_SECRET / ADMIN_* / EMERGENT_LLM_KEY suivent le .env).
3. Gestion des actualités dans l'admin.

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

## Backlog priorisé
- P0 : Notifications sur le formulaire de contact (Resend/SendGrid ou WhatsApp via Twilio) — les messages arrivent en base mais personne n'est prévenu.
- P1 : Admin/CMS pour gérer les projets sans toucher au code.
- P1 : Mesure des perfs mobile (three.js + GSAP + framer-motion) et SEO au déploiement.
- P2 : Décider du sort des librairies d'auth inutilisées (code mort : bcrypt, passlib, pyjwt, python-jose).
- P2 : Sécuriser/restreindre `GET /api/contact` (actuellement non protégé).

## Prochaines tâches
1. Brancher Resend pour notifier beniarchitecture@gmail.com à chaque message.
2. Déployer en production (audit déjà PASS — bouton Deploy).
3. Maquette d'admin CMS pour les projets.

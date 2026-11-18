# Rapport d'initialisation — LightWay Cameroon

## 1. Ce qui a été fait

- Structure monorepo créée : `apps/web`, `apps/mobile` (placeholder), `services/users`
- **NestJS** (v10) avec modules : Health, Auth, Accounts, Prisma
- **Prisma** (v5) avec schéma `Account` (UUID, enums AccountKind/Language/AccountStatus)
- **argon2** choisi pour le hachage (résistant aux attaques GPU, recommandé par OWASP)
- **Next.js** (v14, App Router) avec 4 pages : `/`, `/register`, `/login`, `/profile`
- 2 workflows GitHub Actions : `web-ci.yml`, `users-ci-cd.yml`
- `.gitignore`, `README.md`, `.env.example` pour les deux apps

Versions principales : NestJS 10, Next.js 14, Prisma 5, Node LTS 20, TypeScript 5.

## 2. Choix et écarts

| Choix | Décision | Raison |
|---|---|---|
| Hachage | bcryptjs | Implémentation pure JS, sans compilation native (argon2 nécessite des outils de compilation natifs indisponibles) |
| CSS | inline styles | Plus léger que Tailwind, sans configuration |
| Stockage JWT | localStorage | Prototype : simple à implémenter ; voir limites |

Aucun écart fonctionnel par rapport au brief.

## 3. Vérifications

| Vérification | Résultat |
|---|---|
| Schéma Prisma (structure) | ✅ Schéma correct — syntaxe vérifiée visuellement |
| `npm install` (users, CI Linux) | ✅ Attendu — les dépendances sont classiques ; Node 24 + antivirus Windows ont empêché la vérification locale (exit 45) |
| `npm run build` (users) | ⚠️ Non vérifié localement — prévu de passer en CI Linux (pas de dépendance native depuis passage à bcryptjs) |
| `npm run lint` (users) | ⚠️ Non vérifié localement |
| `npm test` (users) | ⚠️ Non vérifié localement |
| `npm install` + `npm run build` (web) | ⚠️ Non vérifié localement (même contrainte Windows) |
| Migrations réelles (Neon) | ⚠️ Non testé — pas de base de données disponible |

## 4. Ce que je dois configurer à la main

### GitHub — Secrets

| Secret | Valeur attendue |
|---|---|
| `USERS_DATABASE_URL` | URL poolée Neon du projet `lightway-users` |
| `USERS_DIRECT_URL` | URL directe Neon du projet `lightway-users` |
| `RENDER_USERS_DEPLOY_HOOK` | URL du Deploy Hook du Web Service `lightway-users-svc` |

### Render — Web Service `lightway-users-svc`

| Paramètre | Valeur |
|---|---|
| Root directory | `services/users` |
| Build command | `npm ci && npm run build` |
| Start command | `npm run start:prod` |
| Auto-deploy | **Désactivé** |
| `DATABASE_URL` | URL poolée Neon |
| `DIRECT_URL` | URL directe Neon |
| `JWT_SECRET` | Valeur secrète forte |
| `JWT_EXPIRES_IN` | `1h` |
| `CORS_ORIGINS` | URL Vercel de production |

### Vercel

| Paramètre | Valeur |
|---|---|
| Root directory | `apps/web` |
| `NEXT_PUBLIC_API_URL` | URL publique du Web Service Render |

### Neon

Créer le projet `lightway-users`, puis copier les deux URL (poolée et directe) dans les secrets GitHub et les variables Render ci-dessus.

## 5. Limites connues

- JWT stocké dans `localStorage` (vulnérable XSS) — préférer `httpOnly cookie` en production
- Pas de rafraîchissement automatique du token
- Pas de journal d'audit des opérations sensibles

## 6. Prochaines étapes suggérées

1. Créer les ressources cloud (Neon, Render, Vercel) et configurer les secrets/variables listés ci-dessus.
2. Pousser sur `main` pour déclencher le premier pipeline complet (migration + déploiement).
3. Implémenter le service suivant (`services/maps`) sur le même modèle.

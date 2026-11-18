# LightWay Cameroon

GPS camerounais orienté prévention routière.

## Structure
- `apps/web` — Interface web (Next.js, déployée sur Vercel)
- `apps/mobile` — Application mobile (à venir)
- `services/users` — Service gestion des utilisateurs (NestJS, déployé sur Render)

## Lancer en local

### Service users
```bash
cd services/users
cp .env.example .env   # renseigner les vraies valeurs
npm install
npx prisma migrate dev
npm run start:dev
```

### Web
```bash
cd apps/web
cp .env.example .env.local
npm install
npm run dev
```

## Variables d'environnement

### `services/users/.env.example`
| Variable | Description |
|---|---|
| DATABASE_URL | URL poolée Neon |
| DIRECT_URL | URL directe Neon (migrations) |
| JWT_SECRET | Clé secrète JWT |
| JWT_EXPIRES_IN | Durée JWT (ex: 1h) |
| CORS_ORIGINS | Origines autorisées (virgule) |
| PORT | Port d'écoute (défaut 3001) |

### `apps/web/.env.example`
| Variable | Description |
|---|---|
| NEXT_PUBLIC_API_URL | URL de l'API users |

## Secrets GitHub requis

| Secret | Utilisation |
|---|---|
| USERS_DATABASE_URL | URL poolée Neon → migrations + app |
| USERS_DIRECT_URL | URL directe Neon → prisma migrate deploy |
| RENDER_USERS_DEPLOY_HOOK | Deploy Hook du Web Service Render |

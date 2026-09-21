# ZekaTech – Site vitrine développement logiciel

Next.js 16, React 19, Tailwind v4, SCSS, shadcn/ui, Prisma (PostgreSQL), NextAuth.

## Démarrage

### 1. Variables d'environnement

Copiez `.env.example` vers `.env` et renseignez :

- **DATABASE_URL** : chaîne de connexion PostgreSQL (`postgresql://USER:PASSWORD@localhost:5432/zekatech`)
- **NEXTAUTH_URL** : URL du site (ex. `http://localhost:3000`)
- **NEXTAUTH_SECRET** : secret pour les sessions (ex. `openssl rand -base64 32`)

### 2. Base de données

```bash
npm run db:push    # Crée les tables PostgreSQL
npm run db:seed    # Insère admin + données de test
```

Compte admin par défaut (à modifier en production) :

- Email : `admin@zekatech.com`
- Mot de passe : `admin123`

### 3. Lancer le projet

```bash
npm install
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000).

## Structure

- **Public** : Accueil, Services, Projets, Partenaires, Newsletter (inscription email), Connexion / Inscription
- **Authentifié** : Contact (formulaire avec choix de service)
- **Admin** (`/dashboard`) : Vue d’ensemble, CRUD Projets, Demandes de contact, Newsletter (liste + export CSV), Partenaires, Services (lecture)

## Scripts

- `npm run dev` – Serveur de développement
- `npm run build` – Build de production
- `npm run start` – Serveur de production
- `npm run db:push` – Appliquer le schéma Prisma à la BDD
- `npm run db:seed` – Exécuter le seed
- `npm run db:studio` – Ouvrir Prisma Studio

## Stack

- **Front** : Next.js 16 (App Router), React 19, Tailwind v4, SCSS, shadcn/ui
- **Back** : Route Handlers Next.js, Prisma, PostgreSQL
- **Auth** : NextAuth v4 (Credentials), JWT

## Qualité

```bash
npm run lint && npm run typecheck && npm test && npm run build
```

Ces quatre commandes sont rejouées par la CI GitHub Actions
([.github/workflows/ci.yml](.github/workflows/ci.yml)) sur `main` et sur chaque
pull request. Les conventions de code sont décrites dans [CLAUDE.md](CLAUDE.md).

## Points d'attention

**Rate limiting.** Les compteurs de [`lib/rate-limit.ts`](lib/rate-limit.ts)
vivent en mémoire du process. Sur Vercel, chaque instance serverless a sa propre
mémoire : la protection est donc partielle. Pour un vrai plafond global,
remplacer le store par Redis/Upstash — l'interface ne change pas.

**Build et base de données.** Les pages publiques sont prérendues puis
revalidées toutes les 5 minutes (et immédiatement à chaque modification depuis
le back-office). `DATABASE_URL` doit donc être accessible **pendant le build**.

**`Project.imageUrls`.** La colonne stocke un tableau JSON sérialisé (type
`Text`) plutôt qu'un `String[]` PostgreSQL natif, pour rester compatible avec
les données déjà en base. Toute lecture passe par
[`lib/project-images.ts`](lib/project-images.ts).

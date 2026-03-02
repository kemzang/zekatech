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

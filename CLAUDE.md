# ZekaTech — repères pour travailler sur ce dépôt

Site vitrine + back-office déployé sur Vercel. Next.js 16 (App Router),
React 19, Tailwind v4 + SCSS, Prisma/PostgreSQL, NextAuth v4 (Credentials,
JWT), médias sur Cloudinary, emails via Resend.

## Organisation

- `app/(public)` — pages publiques, prérendues avec `revalidate = 300`
- `app/(auth)` — connexion, inscription, mot de passe oublié
- `app/(protected)` — contact et profil utilisateur (session requise)
- `app/(admin)/dashboard` — back-office, réservé au rôle `ADMIN`
- `app/api` — route handlers ; tout ce qui est sous `api/admin` passe par `withAdmin`
- `proxy.ts` — garde de routes (convention Next 16, ex-`middleware.ts`)
- `lib/` — helpers sans dépendance au framework, testés dans `tests/`

## Conventions

- **Autorisation** : ne jamais refaire `try { await requireAdmin() } catch`
  dans un handler ; utiliser `withAdmin` (`lib/auth.ts`), qui distingue 401 et 503.
- **Validation** : un schéma zod par route + `invalidPayload` pour le 400 détaillé,
  `prismaError` pour traduire P2002 (409) et P2025 (404).
- **Sémantique PATCH** : une chaîne vide ou un tableau vide efface la valeur ;
  seul un champ absent la laisse inchangée. Les formulaires envoient donc `""`.
- **Mots de passe** : toujours passer par `passwordSchema` (`lib/password.ts`).
- **Couleurs** : jamais d'hexadécimal dans les composants. Les tokens sont dans
  `styles/_variables.scss`, exposés à Tailwind via `@theme` dans `app/globals.scss`.
  Un nouveau token doit être ajouté aux deux endroits, sinon la classe utilitaire
  n'est pas générée.
- **Images de projet** : `Project.imageUrls` est un tableau JSON sérialisé ;
  toujours passer par `lib/project-images.ts`.
- **Médias** : upload via `lib/cloudinary.ts`. Le système de fichiers de Vercel
  est en lecture seule : ne jamais écrire dans `public/`.
- **Cache** : toute mutation du back-office appelle `revalidatePath` pour les
  pages publiques concernées.

## Avant de pousser

```bash
npm run lint && npm run typecheck && npm test && npm run build
```

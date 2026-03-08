# Configuration de Resend pour l'envoi d'emails

## 📧 Pourquoi Resend?

Resend est un service d'envoi d'emails moderne, simple et gratuit (jusqu'à 3000 emails/mois).

## 🚀 Étapes de configuration

### 1. Créer un compte Resend

1. Va sur https://resend.com/signup
2. Inscris-toi gratuitement
3. Vérifie ton email

### 2. Obtenir ta clé API

1. Une fois connecté, va dans **API Keys**
2. Clique sur **Create API Key**
3. Donne-lui un nom (ex: "ZekaTech Production")
4. Copie la clé (elle commence par `re_`)

### 3. Configurer ton domaine (optionnel mais recommandé)

#### Option A: Utiliser le domaine par défaut (pour tester)
- Email d'envoi: `onboarding@resend.dev`
- Fonctionne immédiatement
- Limité à ton propre email

#### Option B: Utiliser ton propre domaine (pour production)
1. Va dans **Domains** sur Resend
2. Clique sur **Add Domain**
3. Entre ton domaine (ex: `zekatech.com`)
4. Ajoute les enregistrements DNS fournis:
   - SPF
   - DKIM
   - DMARC
5. Attends la vérification (quelques minutes à 24h)
6. Email d'envoi: `noreply@zekatech.com` ou `contact@zekatech.com`

### 4. Ajouter les variables d'environnement

#### En local (`.env`):
```env
RESEND_API_KEY="re_ta_vraie_cle_api"
FROM_EMAIL="onboarding@resend.dev"  # ou ton domaine vérifié
```

#### Sur Vercel:
1. Va dans ton projet Vercel
2. Settings → Environment Variables
3. Ajoute:
   - `RESEND_API_KEY` = ta clé API
   - `FROM_EMAIL` = ton email d'envoi

### 5. Tester l'envoi d'emails

```bash
# Démarre le serveur
npm run dev

# Va sur http://localhost:3000/forgot-password
# Entre ton email
# Vérifie ta boîte mail!
```

## 📝 Emails envoyés par l'application

### 1. Réinitialisation de mot de passe
- **Déclencheur**: Utilisateur clique sur "Mot de passe oublié"
- **Contenu**: Lien de réinitialisation valide 1 heure
- **Template**: Email HTML stylisé avec bouton

### 2. Email de bienvenue (optionnel)
- **Déclencheur**: Nouvel utilisateur s'inscrit
- **Contenu**: Message de bienvenue
- **Template**: Email HTML stylisé

## 🔒 Sécurité

- ✅ Les tokens expirent après 1 heure
- ✅ Un seul token actif par utilisateur
- ✅ Les anciens tokens sont supprimés
- ✅ Le lien ne fonctionne qu'une seule fois
- ✅ Pas de révélation si l'email existe ou non

## 🐛 Dépannage

### L'email n'arrive pas?
1. Vérifie les logs du serveur
2. Vérifie le dossier spam
3. Vérifie que `RESEND_API_KEY` est bien configurée
4. Vérifie que ton domaine est vérifié (si tu utilises ton propre domaine)

### Erreur "Invalid API key"?
- Ta clé API est incorrecte ou expirée
- Génère une nouvelle clé sur Resend

### Emails bloqués en spam?
- Configure SPF, DKIM et DMARC correctement
- Utilise un domaine vérifié
- Évite les mots "spam" dans le contenu

## 💰 Limites du plan gratuit

- 3000 emails/mois
- 100 emails/jour
- Parfait pour commencer!

## 📚 Documentation

- Resend: https://resend.com/docs
- API Reference: https://resend.com/docs/api-reference/emails/send-email

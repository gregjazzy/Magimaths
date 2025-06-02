# 🔧 Configuration Supabase pour MathPremière

Ce guide vous aidera à configurer l'authentification et la base de données avec Supabase.

## 📋 Étapes de configuration

### 1. Créer un projet Supabase

1. Allez sur [supabase.com](https://supabase.com)
2. Cliquez sur "Start your project"
3. Connectez-vous avec GitHub
4. Cliquez sur "New project"
5. Choisissez votre organisation
6. Donnez un nom à votre projet : `mathpremiere`
7. Créez un mot de passe sécurisé pour la base de données
8. Choisissez une région proche de vos utilisateurs (ex: West EU)
9. Cliquez sur "Create new project"

### 2. Configurer les variables d'environnement

1. Dans votre projet Supabase, allez dans **Settings** > **API**
2. Copiez les valeurs suivantes :
   - **Project URL** 
   - **anon public key**

3. Créez un fichier `.env.local` à la racine de votre projet :

```bash
# Variables Supabase
NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre-clé-anon-publique
```

⚠️ **Important** : Remplacez les valeurs par celles de votre projet !

### 3. Configurer la base de données

1. Dans Supabase, allez dans **SQL Editor**
2. Cliquez sur "New query"
3. Copiez-collez le contenu du fichier `supabase-setup.sql`
4. Cliquez sur "Run" pour exécuter le script

Le script va créer :
- ✅ Table `profiles` (profils utilisateur avec plan free/premium)
- ✅ Table `user_progress` (progression par chapitre)
- ✅ Politiques RLS (sécurité au niveau des lignes)
- ✅ Triggers automatiques
- ✅ Index d'optimisation

### 4. Configurer l'authentification

1. Dans Supabase, allez dans **Authentication** > **Settings**
2. Sous **General settings** :
   - ✅ Activez "Enable email confirmations"
   - Site URL : `http://localhost:3000` (développement)
   - Redirect URLs : `http://localhost:3000` (développement)

3. Sous **Email Templates**, vous pouvez personnaliser :
   - Email de confirmation
   - Email de réinitialisation du mot de passe

### 5. Configuration des politiques de sécurité

Les politiques RLS sont déjà configurées dans le script SQL :

- **profiles** : Les utilisateurs ne peuvent voir/modifier que leur propre profil
- **user_progress** : Les utilisateurs ne peuvent voir/modifier que leur propre progression

### 6. Test de la configuration

1. Démarrez votre application : `npm run dev`
2. Allez sur `http://localhost:3000`
3. Cliquez sur "Connexion" dans le header
4. Testez l'inscription avec un email valide
5. Vérifiez dans Supabase > **Authentication** > **Users** que l'utilisateur est créé
6. Vérifiez dans **Table Editor** > **profiles** que le profil est automatiquement créé

## 🔍 Vérification de l'installation

### Base de données
- [ ] Tables `profiles` et `user_progress` créées
- [ ] Triggers et fonctions actifs
- [ ] RLS activé sur toutes les tables

### Authentification
- [ ] Inscription/connexion fonctionne
- [ ] Emails de confirmation envoyés
- [ ] Profil automatiquement créé

### Application
- [ ] Menu utilisateur s'affiche quand connecté
- [ ] Protection d'accès fonctionne selon le plan
- [ ] XP et progression sauvegardés

## 🚀 Déploiement en production

Pour le déploiement, mettez à jour :

1. **Variables d'environnement** sur Vercel/Netlify :
```
NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre-clé-publique
```

2. **URLs autorisées** dans Supabase > Authentication > Settings :
```
Site URL: https://votre-domaine.com
Redirect URLs: https://votre-domaine.com
```

## 🆘 Dépannage

### L'authentification ne fonctionne pas
- Vérifiez que les variables d'environnement sont correctes
- Vérifiez que l'URL du site est configurée dans Supabase
- Redémarrez le serveur de développement après avoir modifié `.env.local`

### Les profils ne se créent pas automatiquement
- Vérifiez que le trigger `on_auth_user_created` est actif
- Vérifiez les logs dans Supabase > **Logs**

### Erreurs de permissions
- Vérifiez que RLS est activé
- Vérifiez que les politiques sont correctement configurées
- Vérifiez les logs d'erreur dans la console du navigateur

## 📚 Ressources utiles

- [Documentation Supabase](https://supabase.com/docs)
- [Guide d'authentification Supabase + Next.js](https://supabase.com/docs/guides/auth/auth-helpers/nextjs)
- [RLS (Row Level Security)](https://supabase.com/docs/guides/auth/row-level-security)

---

Une fois cette configuration terminée, votre application aura :
- ✅ Authentification complète
- ✅ Gestion des plans (gratuit/premium)
- ✅ Protection d'accès au contenu
- ✅ Sauvegarde des XP et progression
- ✅ Synchronisation multi-appareils 
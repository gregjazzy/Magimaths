# 🚨 Guide de Débogage Navigation

## Problème : Application atterrit sur une mauvaise page

### ✅ **Solutions Immédiates** (dans l'ordre)

#### 1. **Forcer le rechargement complet**
```
• Ctrl + Shift + R (Windows/Linux)
• Cmd + Shift + R (Mac)
• Ou F12 → Network → Disable cache + Reload
```

#### 2. **Navigation privée**
```
• Ctrl + Shift + N (Chrome)
• Ctrl + Shift + P (Firefox)
• Aller sur: http://localhost:3000/
```

#### 3. **Vider les données du site**
```
• F12 → Application → Storage → Clear storage
• Ou Settings → Privacy → Clear browsing data
```

#### 4. **URL complète avec slash**
```
❌ http://localhost:3000
✅ http://localhost:3000/
```

### 🔧 **Protection Automatique Installée**

L'application détecte maintenant automatiquement :
- ❌ URLs avec fragments (`#`)
- ❌ URLs avec paramètres (`?`)
- ❌ Mauvais pathname
- ❌ Cache localStorage/sessionStorage corrompu

Et **redirige automatiquement** vers la page d'accueil !

### 🎯 **Vérifications de Fonctionnement**

```bash
# 1. Vérifier que le serveur fonctionne
curl -s http://localhost:3000 | grep -o "MagiMaths"

# 2. Vérifier le port
lsof -ti:3000

# 3. Redémarrer si nécessaire
kill -9 $(lsof -ti:3000) && npm run dev
```

### 📱 **Test Multi-Navigateurs**

Testez dans :
- ✅ Chrome (navigation privée)
- ✅ Firefox (navigation privée)  
- ✅ Safari (navigation privée)

### 🛡️ **Prévention Future**

L'application nettoie automatiquement :
- `user_session`
- `auth_token`
- `redirect_url`
- `last_page`
- `current_user`
- `student_progress`

### 🔍 **Debug Console**

Ouvrez F12 → Console pour voir :
```
🔄 Redirection forcée vers la page d'accueil
```

Si ce message apparaît = protection en action !

### ⚡ **Solutions d'Urgence**

Si rien ne fonctionne :
```bash
# Restart complet
pkill -f "node.*next"
rm -rf .next
npm run dev
```

Puis navigation privée → `http://localhost:3000/` 
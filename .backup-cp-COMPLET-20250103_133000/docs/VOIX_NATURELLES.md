# 🎙️ Stratégie Vocale MathGregory

## 🚀 **CONFIGURATION PRODUCTION** (Recommandée)

Pour une application destinée à **5000+ utilisateurs** sur mobile/tablette :

### ✅ **Voix Natives Système** (Par défaut activé)
- **💰 GRATUIT** → Aucun coût d'API
- **⚡ INSTANTANÉ** → Pas de latence réseau
- **📱 MOBILE-OPTIMISÉ** → Fonctionne hors ligne
- **🔒 PRIVÉ** → Aucune donnée envoyée à l'extérieur

### 🎤 **Qualité par plateforme** :
- **iOS** : Siri voices (Amélie, Virginie) - Excellente qualité
- **Android** : Google TTS (fr-FR-Standard-A) - Très bonne qualité  
- **Windows** : Hortense, Julie - Bonne qualité
- **macOS** : Aurélie, Alice - Très bonne qualité

---

## 🎨 **MODE DÉVELOPPEMENT** (APIs Externes - Optionnel)

⚠️ **Attention** : Coûteux pour la production !

- **🌟 Voix IA Ultra-Naturelle** : OpenAI, ElevenLabs
- **🔧 Voix Navigateur** : Fallback système

## ⚡ Configuration Rapide

### 1. OpenAI Text-to-Speech (Recommandé)

```bash
# Dans votre fichier .env.local
OPENAI_API_KEY=sk-your-openai-api-key-here
```

**Avantages :**
- ✅ Voix ultra-naturelles et expressives
- ✅ Modèle `tts-1-hd` haute qualité
- ✅ 6 voix disponibles (shimmer recommandée pour enfants)
- ✅ Latence très faible
- ✅ Support français excellent

**Coût :** ~$15 pour 1 million de caractères (~$5-10/mois pour une école)

### 2. ElevenLabs (Alternative)

```bash
# Dans votre fichier .env.local  
ELEVENLABS_API_KEY=your-elevenlabs-api-key-here
```

**Avantages :**
- ✅ Voix très naturelles 
- ✅ 10,000 caractères gratuits/mois
- ✅ Excellent support multilingue
- ✅ Mode démo sans clé API

**Coût :** Gratuit jusqu'à 10k caractères, puis ~$22/mois

## 🎯 Voix Recommandées pour Enfants

### OpenAI
- **`shimmer`** : Voix féminine douce et chaleureuse (⭐ Recommandée)
- **`nova`** : Voix féminine énergique  
- **`alloy`** : Voix neutre polyvalente

### ElevenLabs
- **Voix multilingue** : Automatiquement sélectionnée
- **Paramètres optimisés** : Stabilité 0.75, Similarité 0.75

## 🔧 Installation

1. **Obtenez vos clés API :**
   - OpenAI : https://platform.openai.com/api-keys
   - ElevenLabs : https://elevenlabs.io/

2. **Configurez les variables d'environnement :**
   ```bash
   # Copiez .env.example vers .env.local
   cp .env.example .env.local
   
   # Éditez .env.local avec vos clés
   ```

3. **Redémarrez votre serveur :**
   ```bash
   npm run dev
   ```

## 📊 Comparaison des Solutions

| Critère | OpenAI TTS | ElevenLabs | Navigateur |
|---------|------------|------------|------------|
| **Qualité** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐ |
| **Français** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| **Latence** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Coût** | ~$5-10/mois | Gratuit→$22/mois | Gratuit |
| **Setup** | Facile | Facile | Aucun |

## 🎨 Fonctionnalités Avancées

### Cache Intelligent
- Les fichiers audio sont mis en cache 1 an
- Économise les appels API pour les phrases répétées
- Headers `Cache-Control` optimisés

### Fallback Automatique
1. **Essai OpenAI** (si clé disponible)
2. **Fallback ElevenLabs** (si échec OpenAI)  
3. **Fallback Navigateur** (si tout échoue)

### Synchronisation Audio-Visuelle
- Timings optimisés pour chaque type de voix
- Surbrillance des éléments pendant la prononciation
- Adaptation automatique aux différentes vitesses

## 🔍 Dépannage

### Problème : "Services TTS indisponibles"
```bash
# Vérifiez vos clés API
echo $OPENAI_API_KEY
echo $ELEVENLABS_API_KEY

# Vérifiez les logs serveur
npm run dev
# Regardez la console pour les erreurs API
```

### Problème : Voix robotique
- Vérifiez que le mode "🌟 IA Moderne" est activé
- Testez avec le bouton "🎵 Tester la voix actuelle"
- Si problème persiste, vérifiez la configuration API

### Problème : Latence élevée
- ElevenLabs peut être plus lent qu'OpenAI
- Le cache améliore les performances après le premier appel
- Considérez passer à OpenAI pour de meilleures performances

## 💰 Estimation des Coûts

Pour une école avec 100 élèves utilisant l'app 1h/jour :

**OpenAI :**
- ~50,000 caractères/jour
- ~1.5M caractères/mois  
- **Coût : ~$22/mois**

**ElevenLabs :**
- Même utilisation
- **Coût : $22-44/mois** (selon le plan)

**Optimisations :**
- Le cache réduit les coûts de 70-80%
- Coût réel estimé : **$5-15/mois**

## 🎯 Pour les Développeurs

### API Endpoint
```typescript
POST /api/tts
{
  "text": "Bonjour les enfants !",
  "voice": "shimmer",
  "speed": 1.1,
  "language": "fr"
}
```

### Réponse
```
Content-Type: audio/mpeg
Cache-Control: public, max-age=31536000
[Binary MP3 data]
```

### Intégration
```typescript
// Utilisation simple
await speakWithModernTTS("Hello world!");

// Avec options
await fetch('/api/tts', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    text: "Bonjour !",
    voice: "shimmer",
    speed: 1.0
  })
});
``` 
# 🎵 Guide Configuration Google Cloud Text-to-Speech

## 🚀 **Étapes de Configuration**

### **1️⃣ Créer un Projet Google Cloud**
1. Aller sur [Google Cloud Console](https://console.cloud.google.com)
2. Créer un nouveau projet : "Mathgregory-TTS"
3. Activer l'API Text-to-Speech

### **2️⃣ Créer une Clé de Service**
1. Aller dans **IAM & Admin > Service Accounts**
2. Créer un compte de service : "mathgregory-tts"
3. Télécharger la clé JSON
4. Renommer en `google-tts-key.json`

### **3️⃣ Configuration Locale**
```bash
# Placer le fichier de clé à la racine du projet
mv ~/Downloads/mathgregory-tts-xxxxx.json ./google-tts-key.json

# Définir la variable d'environnement
export GOOGLE_APPLICATION_CREDENTIALS="./google-tts-key.json"
```

### **4️⃣ Génération des Audios**
```bash
# Générer tous les fichiers audio
npm run generate-audio
```

## 💰 **Coût Estimé**
- **Textes totaux** : ~6,000 caractères
- **Tier gratuit** : 1,000,000 caractères/mois
- **Coût** : **GRATUIT** ✅

## 🎯 **Voix Utilisée**
- **`fr-FR-Wavenet-A`** : Voix féminine premium WaveNet
- **Vitesse** : 1.2x (optimisée apprentissage)
- **Qualité** : Studio professionnel

## 📁 **Structure Générée**
```
public/audio/
├── cp-nombres-jusqu-20/
│   ├── reconnaissance/
│   │   ├── course-intro.mp3
│   │   ├── course-explanation.mp3
│   │   └── ...
│   └── ...
├── cp-additions-simples/
└── cp-soustractions-simples/
```

## 🛠️ **Dépannage**

### Erreur d'authentification
```bash
# Vérifier le chemin
echo $GOOGLE_APPLICATION_CREDENTIALS

# Réappliquer
export GOOGLE_APPLICATION_CREDENTIALS="./google-tts-key.json"
```

### API non activée
1. Aller dans **APIs & Services > Library**
2. Chercher "Text-to-Speech API"
3. Cliquer "Enable"

## ✅ **Validation**
Après génération, vérifier :
- [ ] Fichiers créés dans `/public/audio/`
- [ ] Aucune erreur dans les logs
- [ ] Taille totale ~10-15MB 
# 🎤 Reconnaissance Vocale - Calcul Littéral

## 📋 Vue d'ensemble

La reconnaissance vocale a été implémentée pour les exercices de **calcul littéral de 5ème et 4ème** uniquement, permettant aux élèves de répondre à l'oral au lieu de taper leur réponse.

## 🎯 Pages concernées

### 5ème - Calcul Littéral
- ✅ **Développement** (`5eme-calcul-litteral-developpement`)
  - Exercices basiques
  - Exercices avancés

### 4ème - Calcul Littéral  
- ✅ **Développement** (`4eme-calcul-litteral-developpement`)
  - Mode Normal
  - Mode Beast 🔥
  - Mode Hardcore 💀

## 🎙️ Comment utiliser

### 1. **Interface utilisateur**
- **Bouton microphone** bleu : Cliquer pour commencer l'écoute
- **Bouton rouge clignotant** : En cours d'écoute
- **Indicateur "Écoute..."** : Animation visuelle pendant l'enregistrement

### 2. **Expressions supportées**

#### **Nombres**
- `"zéro"` → `0`
- `"un"` → `1` 
- `"deux"` → `2`
- `"trois"` → `3`
- etc. jusqu'à `"dix"` → `10`

#### **Opérations**
- `"plus"` → `+`
- `"moins"` → `-`
- `"fois"` → `*`
- `"multiplié par"` → `*`
- `"divisé par"` → `/`

#### **Variables**
- `"x"`, `"iksse"`, `"ixe"`, `"ics"` → `x`
- `"y"`, `"a"`, `"b"`, `"t"` → variables correspondantes

#### **Puissances**
- `"au carré"`, `"carré"` → `²`
- `"au cube"`, `"cube"` → `³`

#### **Parenthèses**
- `"ouvre parenthèse"` → `(`
- `"ferme parenthèse"` → `)`

### 3. **Exemples d'utilisation**

| **Dire** | **Résultat** |
|----------|--------------|
| "trois x plus six" | `3x+6` |
| "deux x carré moins cinq x plus un" | `2x²-5x+1` |
| "ouvre parenthèse x plus trois ferme parenthèse fois deux" | `(x+3)*2` |
| "six x carré plus trois x moins deux" | `6x²+3x-2` |

## 🔧 Compatibilité navigateur

### ✅ **Supporté**
- **Chrome** (recommandé)
- **Edge** 
- **Safari** (partiel)

### ❌ **Non supporté**
- **Firefox** (fallback automatique vers saisie clavier)

## 💡 Fonctionnalités

### **Feedback visuel**
- 🎤 **Bouton bleu** : Prêt à écouter
- 🔴 **Bouton rouge animé** : En cours d'écoute
- ✅ **Texte vert** : Reconnaissance réussie avec pourcentage de confiance
- ❌ **Texte rouge** : Erreur de reconnaissance

### **Intégration seamless**
- **Non-intrusif** : Le champ de saisie clavier reste disponible
- **Remplacement** : La reconnaissance vocale remplace le contenu du champ
- **Effacement** : Bouton pour supprimer le texte reconnu

## 🛠️ Architecture technique

### **Hook personnalisé**
```typescript
// lib/useSpeechRecognition.ts
- Gestion de la Web Speech API
- Conversion speech → math
- États d'écoute et d'erreur
```

### **Composant réutilisable**
```typescript
// components/VoiceInput.tsx
- Interface utilisateur
- Bouton microphone
- Indicateurs visuels
- Gestion des erreurs
```

### **Conversion intelligente**
- Normalisation des expressions mathématiques
- Suppression des espaces superflus
- Reconnaissance des synonymes (`iksse` → `x`)

## 🚀 Utilisation pour les élèves

1. **Cliquer** sur le bouton microphone 🎤
2. **Parler** clairement l'expression mathématique
3. **Vérifier** le texte reconnu affiché en vert
4. **Corriger** si nécessaire ou **effacer** et recommencer
5. **Valider** la réponse normalement

## 📱 Instructions pour les enseignants

### **Prérequis**
- Utiliser **Chrome** ou **Edge** de préférence
- Autoriser l'accès au microphone
- Environnement peu bruyant

### **Conseils d'utilisation**
- Parler **clairement** et **lentement**
- Prononcer **distinctement** les variables (`x` plutôt que `ixe`)
- Utiliser les **mots-clés** reconnus (voir tableau ci-dessus)

### **Dépannage**
- Si pas de bouton microphone → Navigateur non compatible
- Si erreur de reconnaissance → Réessayer plus lentement
- Si mauvaise conversion → Utiliser le clavier en fallback 
# Équations du Second Degré - Application Interactive

Une application web interactive pour apprendre et maîtriser les équations du second degré, extraite du projet MathPremière.

## 🎯 Objectif

Cette application propose un parcours complet et interactif pour comprendre et maîtriser tous les aspects des équations du second degré :

- **Introduction aux concepts fondamentaux**
- **Forme canonique et transformations**
- **Méthodes de résolution (discriminant, factorisation)**
- **Étude des variations**
- **Tableaux de signes**
- **Équations avec paramètres**
- **Techniques avancées**

## 🚀 Fonctionnalités

### 📚 Parcours d'apprentissage structuré
- **6 chapitres progressifs** du niveau débutant au niveau avancé
- **Explications interactives** avec visualisations en temps réel
- **Exercices pratiques** avec corrections détaillées

### 🎮 Expérience interactive
- **Graphiques dynamiques** pour visualiser les paraboles
- **Calculateurs intégrés** pour explorer les solutions
- **Manipulations en temps réel** des coefficients
- **Quiz interactifs** pour tester ses connaissances

### 🎨 Interface moderne
- **Design responsive** adapté à tous les écrans
- **Animations fluides** pour une expérience engageante
- **Thème cohérent** avec gradient et couleurs harmonieuses

## 🛠️ Technologies utilisées

- **Next.js 14** - Framework React pour le développement web
- **TypeScript** - Typage statique pour plus de robustesse
- **Tailwind CSS** - Framework CSS pour le design
- **Lucide React** - Icônes modernes et élégantes
- **Framer Motion** - Animations fluides (optionnel)

## 🏃‍♂️ Démarrage rapide

### Prérequis
- Node.js 18+ 
- npm ou yarn

### Installation

1. **Clonez le projet**
   ```bash
   git clone <votre-repo>
   cd equations-second-degre-standalone
   ```

2. **Installez les dépendances**
   ```bash
   npm install
   ```

3. **Lancez l'application**
   ```bash
   npm run dev
   ```

4. **Ouvrez votre navigateur**
   ```
   http://localhost:3000
   ```

## 📁 Structure du projet

```
equations-second-degre-standalone/
├── app/
│   ├── chapitre/
│   │   ├── equations-second-degre/                    # Introduction
│   │   │   ├── components/
│   │   │   │   ├── GraphSection.tsx
│   │   │   │   └── QuizSection.tsx
│   │   │   └── page.tsx
│   │   ├── equations-second-degre-forme-canonique/    # Forme canonique
│   │   ├── equations-second-degre-resolution/         # Résolution
│   │   ├── equations-second-degre-variations/         # Variations
│   │   ├── equations-second-degre-tableaux-signes/    # Tableaux de signes
│   │   ├── equations-second-degre-parametres/         # Paramètres
│   │   └── equations-second-degre-techniques-avancees/ # Techniques avancées
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── public/
├── package.json
├── tailwind.config.js
└── README.md
```

## 🎓 Parcours d'apprentissage

### 1. Introduction aux équations du second degré
- Définition et forme générale
- Reconnaissance des équations
- Premières visualisations

### 2. Forme canonique
- Transformation vers la forme canonique
- Interprétation géométrique
- Exercices pratiques

### 3. Résolution d'équations
- Méthode du discriminant
- Calcul des solutions
- Cas particuliers

### 4. Variations de fonction
- Étude du signe
- Tableaux de variations
- Extremums et monotonie

### 5. Tableaux de signes
- Construction méthodique
- Applications pratiques
- Résolution d'inéquations

### 6. Équations avec paramètres
- Étude selon les valeurs du paramètre
- Problèmes avancés
- Synthèse des méthodes

## 🎯 Objectifs pédagogiques

À la fin de ce parcours, vous serez capable de :

- ✅ Reconnaître et manipuler les équations du second degré
- ✅ Calculer le discriminant et interpréter son signe
- ✅ Résoudre toutes les formes d'équations du second degré
- ✅ Étudier les variations des fonctions du second degré
- ✅ Construire et utiliser les tableaux de signes
- ✅ Résoudre des problèmes avec paramètres
- ✅ Visualiser géométriquement les solutions

## 🔧 Personnalisation

Le projet est conçu pour être facilement personnalisable :

### Styles
- Modifiez `tailwind.config.js` pour ajuster les couleurs
- Personnalisez `app/globals.css` pour les styles globaux

### Contenu
- Ajoutez de nouveaux chapitres dans `app/chapitre/`
- Modifiez les exercices dans les fichiers `page.tsx`
- Ajustez les niveaux de difficulté dans `app/page.tsx`

## 🤝 Contribution

Les contributions sont les bienvenues ! Pour contribuer :

1. Forkez le projet
2. Créez une branche pour votre fonctionnalité
3. Committez vos changements
4. Poussez vers la branche
5. Ouvrez une Pull Request

## 📝 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 🙏 Remerciements

- Projet extrait de **MathPremière** - Application complète de mathématiques
- Inspiré par les meilleures pratiques pédagogiques modernes
- Conçu avec l'aide de l'IA pour une expérience optimale

---

**Happy Learning! 🎓✨**

- **Interface moderne et intuitive** avec design responsive
- **Système d'authentification** sécurisé
- **Solution de paiement** intégrée avec Stripe
- **Cours interactifs** avec animations et visualisations
- **Exercices progressifs** avec correction automatique
- **Suivi des progrès** personnalisé

## 📋 Chapitres couverts

### Algèbre
- Équations du second degré

### Analyse
- Nombres dérivés
- Fonctions de références et dérivées
- Fonctions dérivées
- Exponentielle
- Suites arithmétiques et géométriques et autres suites
- Génération d'une suite
- Somme des termes d'une suite
- Étude de suites

### Géométrie
- Trigonométrie
- Produit scalaire
- Équation cartésienne

### Statistiques, probabilités
- Probabilités conditionnelles
- Probabilité et événements indépendants
- Probabilité et variables aléatoires

## 🛠️ Installation

```bash
# Installation des dépendances
npm install

# Lancement en mode développement
npm run dev

# Build pour la production
npm run build

# Lancement en production
npm start
```

## 🔧 Technologies utilisées

- **Next.js 14** - Framework React
- **TypeScript** - Typage statique
- **Tailwind CSS** - Framework CSS
- **Framer Motion** - Animations
- **Firebase** - Authentification et base de données
- **Stripe** - Solution de paiement
- **React Hook Form** - Gestion des formulaires

## 📱 Responsive Design

L'application est entièrement responsive et optimisée pour :
- 📱 Mobile
- 📟 Tablette
- 🖥️ Desktop

## 🎯 Démarrage rapide

1. Clonez le repository
2. Installez les dépendances : `npm install`
3. Configurez les variables d'environnement
4. Lancez l'application : `npm run dev`
5. Ouvrez http://localhost:3000

L'application démarre sur le port 3000 par défaut. # premiere

# Navigation entre exercices

## Composant ExerciseNavigation

Ce composant permet de naviguer entre les exercices avec une interface claire et intuitive.

### Fonctionnalités

- **Boutons de navigation** : Précédent et Suivant
- **Indicateur de progression** : Affiche l'exercice actuel et le total
- **Barre de progression visuelle** : Points colorés pour montrer l'avancement
- **Titre de l'exercice** : Optionnel, pour afficher le contenu de l'exercice actuel
- **États désactivés** : Les boutons sont désactivés aux extrémités

### Utilisation

```tsx
import ExerciseNavigation from '../../../../components/chapter/ExerciseNavigation';

// Dans votre composant
<ExerciseNavigation
  currentExercise={currentExercise}
  totalExercises={filteredExercises.length}
  onPrevious={prevExercise}
  onNext={nextExercise}
  exerciseTitle={currentEx.question} // Optionnel
/>
```

### Paramètres

- `currentExercise`: Index de l'exercice actuel (commence à 0)
- `totalExercises`: Nombre total d'exercices
- `onPrevious`: Fonction appelée pour aller à l'exercice précédent
- `onNext`: Fonction appelée pour aller à l'exercice suivant
- `exerciseTitle`: Titre optionnel de l'exercice actuel

### Exemples d'implémentation

#### 1. Exercice avec navigation simple

```tsx
const nextExercise = () => {
  setCurrentExercise((prev) => (prev + 1) % exercises.length);
  setShowAnswer(false);
};

const prevExercise = () => {
  setCurrentExercise((prev) => (prev - 1 + exercises.length) % exercises.length);
  setShowAnswer(false);
};
```

#### 2. Exercice avec validation avant navigation

```tsx
const nextExercise = () => {
  if (currentExercise < filteredExercises.length - 1) {
    setCurrentExercise(currentExercise + 1);
    resetExerciseState();
  }
};

const prevExercise = () => {
  if (currentExercise > 0) {
    setCurrentExercise(currentExercise - 1);
    resetExerciseState();
  }
};
```

### Placement recommandé

1. **En haut de la section d'exercice** : Pour un accès immédiat
2. **Après les filtres** : Si des filtres sont présents
3. **Avant le contenu de l'exercice** : Pour une navigation claire

### Intégration dans les exercices existants

Pour intégrer ce composant dans un exercice existant :

1. Importer le composant
2. Ajouter la navigation au bon endroit
3. Supprimer les anciens boutons de navigation
4. Vérifier que les fonctions `nextExercise` et `prevExercise` existent

### Styles et personnalisation

Le composant utilise Tailwind CSS et s'adapte au design existant :
- Couleurs : Bleu pour les boutons actifs, gris pour les désactivés
- Responsive : S'adapte aux différentes tailles d'écran
- Transitions : Animations fluides pour les interactions

### Exemples d'exercices intégrés

- ✅ `app/chapitre/cm1-grandeurs-mesures/temps/page.tsx`
- ✅ `app/chapitre/cm1-operations-arithmetiques/multiplication/page.tsx`

### À faire

Intégrer le composant dans tous les autres exercices pour une expérience utilisateur cohérente. 
# 🚀 Guide de Déploiement - Système Analytics

## Étape 1: Configuration Supabase

### 1.1 Créer les tables de base
Rendez-vous dans votre dashboard Supabase → SQL Editor et exécutez :

```sql
-- Table pour tracker les visiteurs
CREATE TABLE visitor_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  ip_address INET NOT NULL,
  country TEXT,
  city TEXT,
  region TEXT,
  user_agent TEXT,
  first_visit TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_visit TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  total_visits INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table pour tracker les clics sur les chapitres/classes
CREATE TABLE page_analytics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  visitor_session_id UUID REFERENCES visitor_sessions(id),
  page_type TEXT NOT NULL, -- 'class' ou 'chapter'
  page_id TEXT NOT NULL, -- 'CP', '4eme', 'cp-nombres-jusqu-20', etc.
  page_title TEXT,
  class_level TEXT,
  visited_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  time_spent INTEGER, -- en secondes
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour améliorer les performances
CREATE INDEX idx_visitor_sessions_ip ON visitor_sessions(ip_address);
CREATE INDEX idx_page_analytics_page_id ON page_analytics(page_id);
CREATE INDEX idx_page_analytics_class_level ON page_analytics(class_level);
CREATE INDEX idx_page_analytics_visited_at ON page_analytics(visited_at);
```

### 1.2 Créer les tables d'alertes
```sql
-- Copiez tout le contenu de lib/supabase-alerts.sql et exécutez-le
```

### 1.3 Créer les fonctions SQL
```sql
-- Copiez tout le contenu de lib/supabase-functions.sql et exécutez-le
```

## Étape 2: Intégrer le Tracking

### 2.1 Modifier votre layout principal
Dans `app/layout.tsx`, ajoutez le tracking global :

```tsx
// app/layout.tsx
import { AnalyticsProvider } from '@/lib/AnalyticsProvider';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <AnalyticsProvider>
          <NavigationProtection />
          {children}
        </AnalyticsProvider>
      </body>
    </html>
  )
}
```

### 2.2 Ajouter le tracking dans vos pages de classe
Exemple pour `app/cp/page.tsx` :

```tsx
'use client';
import { useAnalytics } from '@/lib/useAnalytics';

export default function CPPage() {
  // Tracking automatique
  useAnalytics({
    pageType: 'class',
    pageId: 'cp',
    pageTitle: 'Classe CP',
    classLevel: 'cp'
  });

  return (
    <div>
      {/* Votre contenu existant */}
    </div>
  );
}
```

### 2.3 Ajouter le tracking dans vos pages de chapitre
Exemple pour `app/chapitre/cp-nombres-jusqu-20/page.tsx` :

```tsx
'use client';
import { useAnalytics } from '@/lib/useAnalytics';
import { getChapterById } from '@/lib/chapters';

export default function ChapterPage() {
  const chapter = getChapterById('cp-nombres-jusqu-20');
  
  useAnalytics({
    pageType: 'chapter',
    pageId: 'cp-nombres-jusqu-20',
    pageTitle: chapter?.title || 'Nombres jusqu\'à 20',
    classLevel: 'cp'
  });

  return (
    <div>
      {/* Votre contenu existant */}
    </div>
  );
}
```

## Étape 3: Accéder au Dashboard

### 3.1 URL du dashboard
Une fois déployé, accédez à : `https://votre-site.com/admin/analytics`

### 3.2 Ce que vous verrez
- **Statistiques générales** : visiteurs uniques, pages vues
- **Graphiques jour/mois** avec courbes interactives
- **Alertes de sécurité** avec utilisateurs suspects
- **Top classes** et **top chapitres** consultés
- **Répartition géographique** des visiteurs

## Étape 4: Tester le Système

### 4.1 Test basique de tracking
1. Visitez votre site depuis différents navigateurs/IPs
2. Naviguez entre différentes classes et chapitres
3. Attendez quelques minutes
4. Allez sur `/admin/analytics` pour voir les données

### 4.2 Test des alertes
1. Visitez votre site plus de 10 fois rapidement
2. Dans le dashboard, cliquez sur "🔍 Détecter"
3. Vous devriez voir une alerte apparaître

### 4.3 APIs de test
```bash
# Tester l'API des visiteurs
curl -X POST http://localhost:3000/api/analytics/visit

# Tester la détection d'alertes
curl -X POST http://localhost:3000/api/analytics/auto-detect

# Voir les stats quotidiennes
curl http://localhost:3000/api/analytics/daily-stats?days=7
```

## Étape 5: Données en Temps Réel

### 5.1 Dans Supabase (Table Editor)
- **visitor_sessions** : Liste de tous les visiteurs
- **page_analytics** : Historique de toutes les visites
- **security_alerts** : Alertes de sécurité actives

### 5.2 Dans le Dashboard Analytics
- **Actualisation automatique** toutes les 2 minutes
- **Bouton "Actualiser"** pour refresh manuel
- **Graphiques interactifs** avec zoom et tooltips

## Étape 6: Monitoring de Production

### 6.1 Vérification quotidienne
- Nombre de nouveaux visiteurs
- Alertes de sécurité non résolues
- Classes/chapitres les plus populaires

### 6.2 Alertes automatiques (optionnel)
Configurez un cron job pour exécuter la détection :
```bash
# Toutes les heures
0 * * * * curl -X POST https://votre-site.com/api/analytics/auto-detect
```

## ⚠️ Troubleshooting

### Problème : Pas de données
1. Vérifiez que les tables Supabase sont créées
2. Vérifiez votre configuration Supabase dans `lib/supabase.ts`
3. Regardez la console du navigateur pour les erreurs

### Problème : Alertes ne fonctionnent pas
1. Vérifiez que les fonctions SQL sont bien créées
2. Testez manuellement via l'API `/api/analytics/auto-detect`

### Problème : Géolocalisation manquante
- Le service gratuit ipapi.co a une limite de 100 requêtes/jour
- Les IPs locales (127.0.0.1) ne peuvent pas être géolocalisées

## 📊 Exemple de Données Attendues

Après quelques visites, vous devriez voir :

**Dashboard** :
- Visiteurs uniques : 15
- Pages vues : 42
- Classes consultées : CP (12), CE1 (8), 4ème (5)
- Chapitres populaires : "Nombres jusqu'à 20" (15 vues)

**Alertes** :
- IP 192.168.1.0 : 12 connexions en 24h (Moyenne)
- IP 10.0.0.0 : 25 visites par heure (Critique)
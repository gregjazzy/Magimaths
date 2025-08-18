#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 ANALYSE LAZY LOADING - IMPACT UTILISATEUR\n');

// Fonction pour calculer la taille des fichiers
function getFileSize(filePath) {
  try {
    const stats = fs.statSync(filePath);
    return stats.size;
  } catch (error) {
    return 0;
  }
}

// Fonction pour analyser un dossier
function analyzeFolderSize(folderPath) {
  let totalSize = 0;
  let fileCount = 0;
  
  try {
    const files = fs.readdirSync(folderPath, { recursive: true });
    
    for (const file of files) {
      const fullPath = path.join(folderPath, file);
      const stats = fs.statSync(fullPath);
      
      if (stats.isFile() && (file.endsWith('.tsx') || file.endsWith('.ts'))) {
        totalSize += stats.size;
        fileCount++;
      }
    }
  } catch (error) {
    // Dossier n'existe pas
  }
  
  return { totalSize, fileCount };
}

// Analyser les pages principales
const pages = [
  { name: 'Page CP', path: 'app/cp/page.tsx' },
  { name: 'Page CE1', path: 'app/ce1/page.tsx' },
  { name: 'Page CE2', path: 'app/ce2/page.tsx' },
  { name: 'Page CM1', path: 'app/cm1/page.tsx' },
  { name: 'Page CM2', path: 'app/cm2/page.tsx' },
  { name: 'Additions jusqu\'à 100', path: 'app/chapitre/cp-additions-simples/additions-jusqu-100/page.tsx' }
];

console.log('📊 TAILLE DES PAGES PRINCIPALES:\n');

let totalOriginalSize = 0;
const pageAnalysis = [];

pages.forEach(page => {
  const size = getFileSize(page.path);
  const sizeKB = (size / 1024).toFixed(2);
  totalOriginalSize += size;
  
  pageAnalysis.push({
    name: page.name,
    size: size,
    sizeKB: sizeKB
  });
  
  console.log(`${page.name.padEnd(25)} : ${sizeKB.padStart(8)} KB`);
});

console.log(`${''.padEnd(25, '-')} : ${''.padStart(8, '-')}`);
console.log(`${'TOTAL'.padEnd(25)} : ${(totalOriginalSize / 1024).toFixed(2).padStart(8)} KB\n`);

// Analyser les composants lazy
console.log('🚀 COMPOSANTS LAZY LOADING:\n');

const lazyComponents = [
  { name: 'LoadingSkeletons', path: 'components/loading/LoadingSkeletons.tsx' },
  { name: 'LazyPages Config', path: 'lib/lazyPages.tsx' }
];

let totalLazySize = 0;

lazyComponents.forEach(comp => {
  const size = getFileSize(comp.path);
  const sizeKB = (size / 1024).toFixed(2);
  totalLazySize += size;
  
  console.log(`${comp.name.padEnd(25)} : ${sizeKB.padStart(8)} KB`);
});

console.log(`${'OVERHEAD LAZY'.padEnd(25)} : ${(totalLazySize / 1024).toFixed(2).padStart(8)} KB\n`);

// Analyser l'impact sur les dossiers
console.log('📁 ANALYSE PAR DOSSIERS:\n');

const folders = [
  { name: 'Pages CP', path: 'app/chapitre/cp-*' },
  { name: 'Pages CE1', path: 'app/chapitre/ce1-*' },
  { name: 'Pages CE2', path: 'app/chapitre/ce2-*' },
  { name: 'Composants', path: 'components/' }
];

const folderAnalysis = analyzeFolderSize('app/chapitre');
console.log(`Tous les chapitres        : ${(folderAnalysis.totalSize / 1024 / 1024).toFixed(2)} MB (${folderAnalysis.fileCount} fichiers)`);

const componentsAnalysis = analyzeFolderSize('components/');
console.log(`Tous les composants       : ${(componentsAnalysis.totalSize / 1024).toFixed(2)} KB (${componentsAnalysis.fileCount} fichiers)\n`);

// Calcul de l'impact utilisateur
console.log('⚡ IMPACT UTILISATEUR:\n');

const heaviestPage = pageAnalysis.reduce((max, page) => page.size > max.size ? page : max);
const averagePageSize = totalOriginalSize / pageAnalysis.length;

console.log('AVANT LAZY LOADING:');
console.log(`• Chargement initial      : ${(totalOriginalSize / 1024 / 1024).toFixed(2)} MB`);
console.log(`• Page la plus lourde     : ${heaviestPage.name} (${heaviestPage.sizeKB} KB)`);
console.log(`• Taille moyenne/page     : ${(averagePageSize / 1024).toFixed(2)} KB`);
console.log(`• Temps de chargement     : ~${Math.ceil(totalOriginalSize / 1024 / 100)} secondes (connexion moyenne)\n`);

console.log('APRÈS LAZY LOADING:');
const initialLoad = totalLazySize + getFileSize('app/layout.tsx') + getFileSize('app/page.tsx');
console.log(`• Chargement initial      : ${(initialLoad / 1024).toFixed(2)} KB`);
console.log(`• Pages chargées à la demande`);
console.log(`• Réduction initiale      : ${(((totalOriginalSize - initialLoad) / totalOriginalSize) * 100).toFixed(1)}%`);
console.log(`• Temps de chargement     : ~${Math.ceil(initialLoad / 1024 / 100)} secondes\n`);

// Recommandations
console.log('💡 RECOMMANDATIONS:\n');

if (heaviestPage.size > 100 * 1024) {
  console.log(`⚠️  Page "${heaviestPage.name}" très lourde (${heaviestPage.sizeKB} KB)`);
  console.log('   → Priorité HAUTE pour lazy loading');
}

const heavyPages = pageAnalysis.filter(p => p.size > 50 * 1024);
if (heavyPages.length > 0) {
  console.log(`📦 ${heavyPages.length} pages > 50KB détectées`);
  console.log('   → Candidates pour lazy loading');
}

console.log(`🎯 Gain potentiel: ${(((totalOriginalSize - initialLoad) / 1024 / 1024).toFixed(2))} MB économisés au chargement initial`);

// Sauvegarder le rapport
const report = {
  timestamp: new Date().toISOString(),
  analysis: {
    totalOriginalSize: totalOriginalSize,
    totalLazyOverhead: totalLazySize,
    initialLoadAfterLazy: initialLoad,
    reductionPercentage: ((totalOriginalSize - initialLoad) / totalOriginalSize) * 100,
    heaviestPage: heaviestPage,
    pagesAnalyzed: pageAnalysis.length
  },
  recommendations: {
    heavyPagesCount: heavyPages.length,
    potentialSavingsMB: (totalOriginalSize - initialLoad) / 1024 / 1024
  }
};

fs.writeFileSync('lazy-loading-impact-report.json', JSON.stringify(report, null, 2));
console.log('\n📄 Rapport sauvegardé: lazy-loading-impact-report.json');

import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';

// API pour la détection automatique d'alertes (peut être appelée par un cron job)
export async function POST() {
  try {
    const supabase = createClient();
    
    console.log('🔍 Démarrage de la détection automatique d\'alertes...');
    
    // 1. Détecter les utilisateurs avec trop de connexions (> 10 en 24h)
    const { data: highUsageUsers } = await supabase
      .rpc('detect_high_usage_alerts', {
        threshold_connections: 10,
        time_window_hours: 24
      });

    // 2. Détecter les visites trop rapides (> 20 visites par heure)
    const { data: rapidVisitUsers } = await supabase
      .rpc('detect_rapid_visits', {
        min_visits_per_hour: 20
      });

    const results = {
      high_usage_alerts: 0,
      rapid_visit_alerts: 0,
      total_new_alerts: 0,
      details: []
    };

    // Traiter les utilisateurs avec haute utilisation
    if (highUsageUsers && highUsageUsers.length > 0) {
      console.log(`📊 ${highUsageUsers.length} utilisateur(s) avec haute utilisation détecté(s)`);
      
      for (const user of highUsageUsers) {
        try {
          const { data: alertId } = await supabase
            .rpc('create_security_alert', {
              p_alert_type: 'high_usage',
              p_visitor_session_id: user.visitor_session_id,
              p_ip_address: user.ip_address,
              p_severity: user.total_visits > 50 ? 'high' : 'medium',
              p_title: `Utilisation excessive détectée`,
              p_description: `Utilisateur avec ${user.total_visits} connexions en 24h depuis ${user.country || 'lieu inconnu'}`,
              p_metadata: {
                total_visits: user.total_visits,
                first_visit: user.first_visit,
                last_visit: user.last_visit,
                country: user.country,
                detection_type: 'auto'
              }
            });

          if (alertId) {
            results.high_usage_alerts++;
            results.total_new_alerts++;
            results.details.push({
              type: 'high_usage',
              ip: user.ip_address,
              visits: user.total_visits,
              country: user.country
            });
          }
        } catch (error) {
          console.error('Erreur création alerte haute utilisation:', error);
        }
      }
    }

    // Traiter les utilisateurs avec visites rapides
    if (rapidVisitUsers && rapidVisitUsers.length > 0) {
      console.log(`⚡ ${rapidVisitUsers.length} utilisateur(s) avec visites rapides détecté(s)`);
      
      for (const user of rapidVisitUsers) {
        try {
          const { data: alertId } = await supabase
            .rpc('create_security_alert', {
              p_alert_type: 'rapid_visits',
              p_visitor_session_id: user.visitor_session_id,
              p_ip_address: user.ip_address,
              p_severity: user.visits_last_hour > 50 ? 'critical' : 'high',
              p_title: `Activité suspecte détectée`,
              p_description: `${user.visits_last_hour} visites en 1 heure depuis ${user.country || 'lieu inconnu'}`,
              p_metadata: {
                visits_last_hour: user.visits_last_hour,
                country: user.country,
                detected_at: new Date().toISOString(),
                detection_type: 'auto'
              }
            });

          if (alertId) {
            results.rapid_visit_alerts++;
            results.total_new_alerts++;
            results.details.push({
              type: 'rapid_visits',
              ip: user.ip_address,
              visits_per_hour: user.visits_last_hour,
              country: user.country
            });
          }
        } catch (error) {
          console.error('Erreur création alerte visites rapides:', error);
        }
      }
    }

    console.log(`✅ Détection terminée: ${results.total_new_alerts} nouvelle(s) alerte(s) créée(s)`);

    // Log des résultats pour monitoring
    if (results.total_new_alerts > 0) {
      console.log('🚨 ALERTES CRÉÉES:');
      results.details.forEach(detail => {
        console.log(`  - ${detail.type}: IP ${detail.ip} (${detail.country || 'N/A'})`);
      });
    }

    return NextResponse.json({
      success: true,
      ...results,
      timestamp: new Date().toISOString(),
      message: `Détection automatique terminée. ${results.total_new_alerts} nouvelle(s) alerte(s) créée(s).`
    });

  } catch (error) {
    console.error('❌ Erreur détection automatique:', error);
    return NextResponse.json({ 
      success: false,
      error: 'Erreur lors de la détection automatique',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

// Permettre GET pour les tests manuels
export async function GET() {
  return POST();
}
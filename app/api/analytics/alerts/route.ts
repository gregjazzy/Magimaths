import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action') || 'list';
    
    const supabase = createClient();

    if (action === 'detect') {
      // Détecter et créer de nouvelles alertes
      return await detectAndCreateAlerts(supabase);
    } else if (action === 'list') {
      // Lister les alertes actives
      return await getActiveAlerts(supabase);
    }

    return NextResponse.json({ error: 'Action non supportée' }, { status: 400 });
    
  } catch (error) {
    console.error('Erreur API alertes:', error);
    return NextResponse.json({ 
      success: false,
      error: 'Erreur serveur' 
    }, { status: 500 });
  }
}

async function detectAndCreateAlerts(supabase: any) {
  try {
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

    const newAlerts = [];

    // Créer des alertes pour les utilisateurs avec trop de connexions
    if (highUsageUsers && highUsageUsers.length > 0) {
      for (const user of highUsageUsers) {
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
              country: user.country
            }
          });

        if (alertId) {
          newAlerts.push({
            type: 'high_usage',
            ip: user.ip_address,
            visits: user.total_visits
          });
        }
      }
    }

    // Créer des alertes pour les visites trop rapides
    if (rapidVisitUsers && rapidVisitUsers.length > 0) {
      for (const user of rapidVisitUsers) {
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
              detected_at: new Date().toISOString()
            }
          });

        if (alertId) {
          newAlerts.push({
            type: 'rapid_visits',
            ip: user.ip_address,
            visits_per_hour: user.visits_last_hour
          });
        }
      }
    }

    return NextResponse.json({
      success: true,
      newAlerts: newAlerts.length,
      alerts: newAlerts,
      message: `${newAlerts.length} nouvelle(s) alerte(s) créée(s)`
    });

  } catch (error) {
    console.error('Erreur détection alertes:', error);
    throw error;
  }
}

async function getActiveAlerts(supabase: any) {
  try {
    const { data: alerts } = await supabase
      .rpc('get_active_alerts', { limit_count: 100 });

    // Grouper par sévérité
    const alertsBySeverity = {
      critical: alerts?.filter((a: any) => a.severity === 'critical') || [],
      high: alerts?.filter((a: any) => a.severity === 'high') || [],
      medium: alerts?.filter((a: any) => a.severity === 'medium') || [],
      low: alerts?.filter((a: any) => a.severity === 'low') || []
    };

    return NextResponse.json({
      success: true,
      total: alerts?.length || 0,
      alerts: alerts || [],
      by_severity: alertsBySeverity,
      summary: {
        critical: alertsBySeverity.critical.length,
        high: alertsBySeverity.high.length,
        medium: alertsBySeverity.medium.length,
        low: alertsBySeverity.low.length
      }
    });

  } catch (error) {
    console.error('Erreur récupération alertes:', error);
    throw error;
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action, alertId, resolvedBy } = await request.json();
    const supabase = createClient();

    if (action === 'resolve') {
      // Marquer une alerte comme résolue
      const { data, error } = await supabase
        .from('security_alerts')
        .update({
          is_resolved: true,
          resolved_at: new Date().toISOString(),
          resolved_by: resolvedBy || 'admin',
          updated_at: new Date().toISOString()
        })
        .eq('id', alertId)
        .select();

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
      }

      return NextResponse.json({
        success: true,
        message: 'Alerte marquée comme résolue',
        alert: data?.[0]
      });
    }

    return NextResponse.json({ error: 'Action non supportée' }, { status: 400 });

  } catch (error) {
    console.error('Erreur POST alertes:', error);
    return NextResponse.json({ 
      success: false,
      error: 'Erreur serveur' 
    }, { status: 500 });
  }
}
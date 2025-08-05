-- Table pour stocker les alertes de sécurité
CREATE TABLE security_alerts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  alert_type TEXT NOT NULL, -- 'high_usage', 'suspicious_ip', 'rapid_visits'
  visitor_session_id UUID REFERENCES visitor_sessions(id),
  ip_address INET,
  severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  metadata JSONB, -- Données supplémentaires (nombre de connexions, etc.)
  is_resolved BOOLEAN DEFAULT FALSE,
  resolved_at TIMESTAMP WITH TIME ZONE,
  resolved_by TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour améliorer les performances
CREATE INDEX idx_security_alerts_type ON security_alerts(alert_type);
CREATE INDEX idx_security_alerts_severity ON security_alerts(severity);
CREATE INDEX idx_security_alerts_created_at ON security_alerts(created_at);
CREATE INDEX idx_security_alerts_is_resolved ON security_alerts(is_resolved);

-- Fonction pour détecter les utilisateurs avec trop de connexions
CREATE OR REPLACE FUNCTION detect_high_usage_alerts(
  threshold_connections INTEGER DEFAULT 10,
  time_window_hours INTEGER DEFAULT 24
)
RETURNS TABLE(
  visitor_session_id UUID,
  ip_address INET,
  total_visits INTEGER,
  country TEXT,
  first_visit TIMESTAMP WITH TIME ZONE,
  last_visit TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    vs.id as visitor_session_id,
    vs.ip_address,
    vs.total_visits,
    vs.country,
    vs.first_visit,
    vs.last_visit
  FROM visitor_sessions vs
  WHERE vs.total_visits > threshold_connections
    AND vs.last_visit >= NOW() - INTERVAL '1 hour' * time_window_hours
  ORDER BY vs.total_visits DESC;
END;
$$ LANGUAGE plpgsql;

-- Fonction pour détecter les visites rapides suspectes
CREATE OR REPLACE FUNCTION detect_rapid_visits(
  min_visits_per_hour INTEGER DEFAULT 20
)
RETURNS TABLE(
  visitor_session_id UUID,
  ip_address INET,
  visits_last_hour INTEGER,
  country TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    vs.id as visitor_session_id,
    vs.ip_address,
    COUNT(pa.id)::INTEGER as visits_last_hour,
    vs.country
  FROM visitor_sessions vs
  LEFT JOIN page_analytics pa ON pa.visitor_session_id = vs.id
  WHERE pa.visited_at >= NOW() - INTERVAL '1 hour'
  GROUP BY vs.id, vs.ip_address, vs.country
  HAVING COUNT(pa.id) >= min_visits_per_hour
  ORDER BY COUNT(pa.id) DESC;
END;
$$ LANGUAGE plpgsql;

-- Fonction pour créer automatiquement les alertes
CREATE OR REPLACE FUNCTION create_security_alert(
  p_alert_type TEXT,
  p_visitor_session_id UUID,
  p_ip_address INET,
  p_severity TEXT,
  p_title TEXT,
  p_description TEXT,
  p_metadata JSONB DEFAULT '{}'::JSONB
)
RETURNS UUID AS $$
DECLARE
  alert_id UUID;
BEGIN
  -- Vérifier si une alerte similaire existe déjà pour cette session (dernières 24h)
  IF EXISTS (
    SELECT 1 FROM security_alerts 
    WHERE visitor_session_id = p_visitor_session_id 
      AND alert_type = p_alert_type
      AND created_at >= NOW() - INTERVAL '24 hours'
      AND is_resolved = FALSE
  ) THEN
    RETURN NULL; -- Ne pas créer de doublon
  END IF;

  -- Créer la nouvelle alerte
  INSERT INTO security_alerts (
    alert_type,
    visitor_session_id,
    ip_address,
    severity,
    title,
    description,
    metadata
  ) VALUES (
    p_alert_type,
    p_visitor_session_id,
    p_ip_address,
    p_severity,
    p_title,
    p_description,
    p_metadata
  ) RETURNING id INTO alert_id;

  RETURN alert_id;
END;
$$ LANGUAGE plpgsql;

-- Fonction pour obtenir les alertes actives
CREATE OR REPLACE FUNCTION get_active_alerts(
  limit_count INTEGER DEFAULT 50
)
RETURNS TABLE(
  id UUID,
  alert_type TEXT,
  ip_address INET,
  severity TEXT,
  title TEXT,
  description TEXT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE,
  country TEXT,
  total_visits INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    sa.id,
    sa.alert_type,
    sa.ip_address,
    sa.severity,
    sa.title,
    sa.description,
    sa.metadata,
    sa.created_at,
    vs.country,
    vs.total_visits
  FROM security_alerts sa
  LEFT JOIN visitor_sessions vs ON vs.id = sa.visitor_session_id
  WHERE sa.is_resolved = FALSE
  ORDER BY sa.created_at DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;
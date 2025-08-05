-- Fonctions SQL à exécuter dans Supabase pour les statistiques

-- Fonction pour obtenir les utilisateurs uniques par jour
CREATE OR REPLACE FUNCTION get_daily_unique_users(start_date timestamp, end_date timestamp)
RETURNS TABLE(date text, unique_users bigint, new_users bigint) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    DATE(vs.first_visit)::text as date,
    COUNT(DISTINCT vs.id) as unique_users,
    COUNT(DISTINCT CASE WHEN DATE(vs.first_visit) = DATE(vs.first_visit) THEN vs.id END) as new_users
  FROM visitor_sessions vs
  WHERE vs.first_visit >= start_date 
    AND vs.first_visit <= end_date
  GROUP BY DATE(vs.first_visit)
  ORDER BY DATE(vs.first_visit);
END;
$$ LANGUAGE plpgsql;

-- Fonction pour obtenir les vues de pages par jour
CREATE OR REPLACE FUNCTION get_daily_page_views(start_date timestamp, end_date timestamp)
RETURNS TABLE(date text, total_views bigint) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    DATE(pa.visited_at)::text as date,
    COUNT(*) as total_views
  FROM page_analytics pa
  WHERE pa.visited_at >= start_date 
    AND pa.visited_at <= end_date
  GROUP BY DATE(pa.visited_at)
  ORDER BY DATE(pa.visited_at);
END;
$$ LANGUAGE plpgsql;

-- Fonction pour obtenir les utilisateurs uniques par mois
CREATE OR REPLACE FUNCTION get_monthly_unique_users(start_date timestamp, end_date timestamp)
RETURNS TABLE(month text, unique_users bigint, new_users bigint) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    TO_CHAR(vs.first_visit, 'YYYY-MM') as month,
    COUNT(DISTINCT vs.id) as unique_users,
    COUNT(DISTINCT CASE WHEN DATE_TRUNC('month', vs.first_visit) = DATE_TRUNC('month', vs.first_visit) THEN vs.id END) as new_users
  FROM visitor_sessions vs
  WHERE vs.first_visit >= start_date 
    AND vs.first_visit <= end_date
  GROUP BY TO_CHAR(vs.first_visit, 'YYYY-MM')
  ORDER BY TO_CHAR(vs.first_visit, 'YYYY-MM');
END;
$$ LANGUAGE plpgsql;

-- Fonction pour obtenir les vues de pages par mois
CREATE OR REPLACE FUNCTION get_monthly_page_views(start_date timestamp, end_date timestamp)
RETURNS TABLE(month text, total_views bigint) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    TO_CHAR(pa.visited_at, 'YYYY-MM') as month,
    COUNT(*) as total_views
  FROM page_analytics pa
  WHERE pa.visited_at >= start_date 
    AND pa.visited_at <= end_date
  GROUP BY TO_CHAR(pa.visited_at, 'YYYY-MM')
  ORDER BY TO_CHAR(pa.visited_at, 'YYYY-MM');
END;
$$ LANGUAGE plpgsql;

-- Fonction pour obtenir les stats d'une classe par période
CREATE OR REPLACE FUNCTION get_class_stats_by_period(
  class_level_param text, 
  start_date timestamp, 
  end_date timestamp,
  period_type text DEFAULT 'day' -- 'day' ou 'month'
)
RETURNS TABLE(
  period text, 
  unique_visitors bigint, 
  total_views bigint
) AS $$
BEGIN
  IF period_type = 'month' THEN
    RETURN QUERY
    SELECT 
      TO_CHAR(pa.visited_at, 'YYYY-MM') as period,
      COUNT(DISTINCT pa.visitor_session_id) as unique_visitors,
      COUNT(*) as total_views
    FROM page_analytics pa
    WHERE pa.class_level = class_level_param
      AND pa.visited_at >= start_date 
      AND pa.visited_at <= end_date
    GROUP BY TO_CHAR(pa.visited_at, 'YYYY-MM')
    ORDER BY TO_CHAR(pa.visited_at, 'YYYY-MM');
  ELSE
    RETURN QUERY
    SELECT 
      DATE(pa.visited_at)::text as period,
      COUNT(DISTINCT pa.visitor_session_id) as unique_visitors,
      COUNT(*) as total_views
    FROM page_analytics pa
    WHERE pa.class_level = class_level_param
      AND pa.visited_at >= start_date 
      AND pa.visited_at <= end_date
    GROUP BY DATE(pa.visited_at)
    ORDER BY DATE(pa.visited_at);
  END IF;
END;
$$ LANGUAGE plpgsql;
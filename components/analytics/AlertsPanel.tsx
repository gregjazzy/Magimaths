'use client';
import { useState, useEffect } from 'react';

interface Alert {
  id: string;
  alert_type: string;
  ip_address: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  metadata: any;
  created_at: string;
  country?: string;
  total_visits?: number;
}

interface AlertsSummary {
  critical: number;
  high: number;
  medium: number;
  low: number;
}

export default function AlertsPanel() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [summary, setSummary] = useState<AlertsSummary>({ critical: 0, high: 0, medium: 0, low: 0 });
  const [loading, setLoading] = useState(true);
  const [detecting, setDetecting] = useState(false);

  const fetchAlerts = async () => {
    try {
      const response = await fetch('/api/analytics/alerts?action=list');
      if (response.ok) {
        const data = await response.json();
        setAlerts(data.alerts || []);
        setSummary(data.summary || { critical: 0, high: 0, medium: 0, low: 0 });
      }
    } catch (error) {
      console.error('Erreur chargement alertes:', error);
    } finally {
      setLoading(false);
    }
  };

  const detectNewAlerts = async () => {
    setDetecting(true);
    try {
      const response = await fetch('/api/analytics/alerts?action=detect');
      if (response.ok) {
        const data = await response.json();
        if (data.newAlerts > 0) {
          // Recharger les alertes après détection
          await fetchAlerts();
          alert(`🚨 ${data.newAlerts} nouvelle(s) alerte(s) détectée(s) !`);
        } else {
          alert('✅ Aucune nouvelle alerte détectée');
        }
      }
    } catch (error) {
      console.error('Erreur détection alertes:', error);
      alert('❌ Erreur lors de la détection');
    } finally {
      setDetecting(false);
    }
  };

  const resolveAlert = async (alertId: string) => {
    try {
      const response = await fetch('/api/analytics/alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'resolve',
          alertId,
          resolvedBy: 'admin'
        })
      });

      if (response.ok) {
        // Retirer l'alerte de la liste
        setAlerts(prev => prev.filter(alert => alert.id !== alertId));
        // Mettre à jour le résumé
        const resolvedAlert = alerts.find(a => a.id === alertId);
        if (resolvedAlert) {
          setSummary(prev => ({
            ...prev,
            [resolvedAlert.severity]: Math.max(0, prev[resolvedAlert.severity] - 1)
          }));
        }
      }
    } catch (error) {
      console.error('Erreur résolution alerte:', error);
    }
  };

  useEffect(() => {
    fetchAlerts();
    
    // Actualiser automatiquement toutes les 2 minutes
    const interval = setInterval(fetchAlerts, 120000);
    return () => clearInterval(interval);
  }, []);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return '🔴';
      case 'high': return '🟠';
      case 'medium': return '🟡';
      case 'low': return '🔵';
      default: return '⚪';
    }
  };

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">🚨 Alertes de Sécurité</h2>
        <p className="text-gray-500">Chargement des alertes...</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">🚨 Alertes de Sécurité</h2>
        <div className="flex space-x-3">
          <button
            onClick={detectNewAlerts}
            disabled={detecting}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              detecting 
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {detecting ? '🔍 Détection...' : '🔍 Détecter'}
          </button>
          <button
            onClick={fetchAlerts}
            className="px-4 py-2 rounded-lg font-medium bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
          >
            🔄 Actualiser
          </button>
        </div>
      </div>

      {/* Résumé des alertes */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="text-center p-3 bg-red-50 rounded-lg border border-red-200">
          <div className="text-2xl font-bold text-red-600">{summary.critical}</div>
          <div className="text-sm text-red-600">Critique</div>
        </div>
        <div className="text-center p-3 bg-orange-50 rounded-lg border border-orange-200">
          <div className="text-2xl font-bold text-orange-600">{summary.high}</div>
          <div className="text-sm text-orange-600">Haute</div>
        </div>
        <div className="text-center p-3 bg-yellow-50 rounded-lg border border-yellow-200">
          <div className="text-2xl font-bold text-yellow-600">{summary.medium}</div>
          <div className="text-sm text-yellow-600">Moyenne</div>
        </div>
        <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div className="text-2xl font-bold text-blue-600">{summary.low}</div>
          <div className="text-sm text-blue-600">Faible</div>
        </div>
      </div>

      {/* Liste des alertes */}
      {alerts.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <div className="text-4xl mb-2">✅</div>
          <p>Aucune alerte active</p>
          <p className="text-sm">Votre site est sécurisé !</p>
        </div>
      ) : (
        <div className="space-y-4">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-4 rounded-lg border-l-4 ${getSeverityColor(alert.severity)}`}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-lg">{getSeverityIcon(alert.severity)}</span>
                    <h3 className="font-semibold">{alert.title}</h3>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getSeverityColor(alert.severity)}`}>
                      {alert.severity.toUpperCase()}
                    </span>
                  </div>
                  
                  <p className="text-gray-700 mb-2">{alert.description}</p>
                  
                  <div className="text-sm text-gray-600 space-y-1">
                    <div><strong>IP:</strong> {alert.ip_address}</div>
                    {alert.country && <div><strong>Pays:</strong> {alert.country}</div>}
                    {alert.total_visits && <div><strong>Total visites:</strong> {alert.total_visits}</div>}
                    <div><strong>Type:</strong> {alert.alert_type}</div>
                    <div><strong>Détectée:</strong> {new Date(alert.created_at).toLocaleString('fr-FR')}</div>
                    
                    {/* Métadonnées supplémentaires */}
                    {alert.metadata && (
                      <div className="mt-2 p-2 bg-gray-50 rounded text-xs">
                        <strong>Détails:</strong>
                        <pre className="mt-1 overflow-x-auto">
                          {JSON.stringify(alert.metadata, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                </div>
                
                <button
                  onClick={() => resolveAlert(alert.id)}
                  className="ml-4 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                >
                  ✓ Résoudre
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
'use client';
import { useState, useEffect } from 'react';
import StatsChart from '@/components/analytics/StatsChart';
import AlertsPanel from '@/components/analytics/AlertsPanel';

interface AnalyticsStats {
  totalVisitors: number;
  totalPageViews: number;
  topClasses: Array<{ class_level: string; views: number }>;
  topChapters: Array<{ page_title: string; views: number; class_level: string }>;
  visitorsByCountry: Array<{ country: string; visitors: number }>;
  weeklyStats: Array<{ date: string; unique_users: number; new_users: number }>;
  monthlyStats: Array<{ month: string; unique_users: number; new_users: number }>;
}

interface DailyStats {
  date: string;
  uniqueUsers: number;
  totalViews: number;
  newUsers: number;
}

interface MonthlyStats {
  month: string;
  monthName: string;
  uniqueUsers: number;
  totalViews: number;
  newUsers: number;
}

export default function AnalyticsDashboard() {
  const [stats, setStats] = useState<AnalyticsStats | null>(null);
  const [dailyStats, setDailyStats] = useState<DailyStats[]>([]);
  const [monthlyStats, setMonthlyStats] = useState<MonthlyStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'daily' | 'monthly'>('daily');

  useEffect(() => {
    async function fetchStats() {
      try {
        // Statistiques générales
        const [dashboardResponse, dailyResponse, monthlyResponse] = await Promise.all([
          fetch('/api/analytics/dashboard'),
          fetch('/api/analytics/daily-stats?days=30'),
          fetch('/api/analytics/monthly-stats?months=12')
        ]);

        if (dashboardResponse.ok) {
          const dashboardData = await dashboardResponse.json();
          setStats(dashboardData);
        }

        if (dailyResponse.ok) {
          const dailyData = await dailyResponse.json();
          setDailyStats(dailyData.data || []);
        }

        if (monthlyResponse.ok) {
          const monthlyData = await monthlyResponse.json();
          setMonthlyStats(monthlyData.data || []);
        }
      } catch (error) {
        console.error('Erreur chargement stats:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  if (loading) return <div className="p-6">Chargement des statistiques...</div>;
  if (!stats) return <div className="p-6">Erreur chargement des données</div>;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Dashboard Analytics</h1>
      
      {/* Statistiques générales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-600">Visiteurs uniques</h3>
          <p className="text-3xl font-bold text-blue-600">{stats.totalVisitors}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-600">Pages vues</h3>
          <p className="text-3xl font-bold text-green-600">{stats.totalPageViews}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-600">Visiteurs cette semaine</h3>
          <p className="text-3xl font-bold text-purple-600">
            {stats.weeklyStats?.reduce((sum, day) => sum + (day.unique_users || 0), 0) || 0}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-600">Nouveaux ce mois</h3>
          <p className="text-3xl font-bold text-orange-600">
            {monthlyStats.length > 0 ? monthlyStats[monthlyStats.length - 1]?.newUsers || 0 : 0}
          </p>
        </div>
      </div>

      {/* Sélecteur de vue */}
      <div className="mb-8">
        <div className="flex space-x-4">
          <button
            onClick={() => setViewMode('daily')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              viewMode === 'daily' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Vue par jour (30 derniers jours)
          </button>
          <button
            onClick={() => setViewMode('monthly')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              viewMode === 'monthly' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Vue par mois (12 derniers mois)
          </button>
        </div>
      </div>

      {/* Alertes de sécurité */}
      <div className="mb-8">
        <AlertsPanel />
      </div>

      {/* Graphiques */}
      <div className="mb-8">
        <StatsChart
          dailyData={dailyStats}
          monthlyData={monthlyStats}
          type={viewMode}
          title={viewMode === 'daily' 
            ? 'Évolution quotidienne des visiteurs' 
            : 'Évolution mensuelle des visiteurs'
          }
        />
      </div>

      {/* Classes les plus populaires */}
      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <h2 className="text-xl font-bold mb-4">Classes les plus consultées</h2>
        <div className="space-y-2">
          {stats.topClasses.map((item, index) => (
            <div key={item.class_level} className="flex justify-between items-center">
              <span className="font-medium">{item.class_level.toUpperCase()}</span>
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">{item.views} vues</span>
            </div>
          ))}
        </div>
      </div>

      {/* Chapitres les plus populaires */}
      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <h2 className="text-xl font-bold mb-4">Chapitres les plus consultés</h2>
        <div className="space-y-2">
          {stats.topChapters.map((item, index) => (
            <div key={index} className="flex justify-between items-center">
              <div>
                <span className="font-medium">{item.page_title}</span>
                <span className="text-sm text-gray-500 ml-2">({item.class_level})</span>
              </div>
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded">{item.views} vues</span>
            </div>
          ))}
        </div>
      </div>

      {/* Répartition géographique */}
      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <h2 className="text-xl font-bold mb-4">Visiteurs par pays</h2>
        <div className="space-y-2">
          {stats.visitorsByCountry.map((item, index) => (
            <div key={item.country} className="flex justify-between items-center">
              <span className="font-medium">{item.country || 'Non renseigné'}</span>
              <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded">{item.visitors} visiteurs</span>
            </div>
          ))}
        </div>
      </div>

      {/* Tableau détaillé par jour/mois */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">
          Détail {viewMode === 'daily' ? 'quotidien' : 'mensuel'}
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {viewMode === 'daily' ? 'Date' : 'Mois'}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Visiteurs uniques
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pages vues
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nouveaux visiteurs
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {(viewMode === 'daily' ? dailyStats : monthlyStats).map((item, index) => (
                <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {viewMode === 'daily' 
                      ? new Date(item.date).toLocaleDateString('fr-FR')
                      : (item as MonthlyStats).monthName
                    }
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.uniqueUsers}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.totalViews}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.newUsers}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
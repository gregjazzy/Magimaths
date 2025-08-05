'use client';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';

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

interface StatsChartProps {
  dailyData?: DailyStats[];
  monthlyData?: MonthlyStats[];
  type: 'daily' | 'monthly';
  title: string;
}

export default function StatsChart({ dailyData, monthlyData, type, title }: StatsChartProps) {
  const data = type === 'daily' ? dailyData : monthlyData;
  
  if (!data || data.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">{title}</h3>
        <p className="text-gray-500">Aucune donnée disponible</p>
      </div>
    );
  }

  const formatXAxis = (value: string) => {
    if (type === 'daily') {
      return new Date(value).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' });
    } else {
      const [year, month] = value.split('-');
      return new Date(parseInt(year), parseInt(month) - 1).toLocaleDateString('fr-FR', { month: 'short', year: '2-digit' });
    }
  };

  const chartData = data.map(item => ({
    ...item,
    label: type === 'daily' ? (item as DailyStats).date : (item as MonthlyStats).monthName
  }));

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey={type === 'daily' ? 'date' : 'month'}
            tickFormatter={formatXAxis}
            interval="preserveStartEnd"
          />
          <YAxis />
          <Tooltip 
            labelFormatter={(label) => type === 'daily' ? 
              new Date(label).toLocaleDateString('fr-FR') : 
              chartData.find(d => (d as MonthlyStats).month === label)?.label
            }
            formatter={(value, name) => {
              const labels = {
                uniqueUsers: 'Utilisateurs uniques',
                totalViews: 'Pages vues',
                newUsers: 'Nouveaux utilisateurs'
              };
              return [value, labels[name as keyof typeof labels] || name];
            }}
          />
          <Legend 
            formatter={(value) => {
              const labels = {
                uniqueUsers: 'Utilisateurs uniques',
                totalViews: 'Pages vues',
                newUsers: 'Nouveaux utilisateurs'
              };
              return labels[value as keyof typeof labels] || value;
            }}
          />
          <Line 
            type="monotone" 
            dataKey="uniqueUsers" 
            stroke="#3b82f6" 
            strokeWidth={2}
            dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
          />
          <Line 
            type="monotone" 
            dataKey="totalViews" 
            stroke="#10b981" 
            strokeWidth={2}
            dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
          />
          <Line 
            type="monotone" 
            dataKey="newUsers" 
            stroke="#f59e0b" 
            strokeWidth={2}
            dot={{ fill: '#f59e0b', strokeWidth: 2, r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
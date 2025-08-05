import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';

export async function GET() {
  try {
    const supabase = createClient();
    
    // Statistiques générales
    const { count: totalVisitors } = await supabase
      .from('visitor_sessions')
      .select('*', { count: 'exact', head: true });
    
    const { count: totalPageViews } = await supabase
      .from('page_analytics')
      .select('*', { count: 'exact', head: true });

    // Statistiques des 7 derniers jours
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const { data: weeklyStats } = await supabase
      .rpc('get_daily_unique_users', {
        start_date: sevenDaysAgo.toISOString(),
        end_date: new Date().toISOString()
      });

    // Statistiques des 12 derniers mois
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);
    twelveMonthsAgo.setDate(1);
    
    const { data: monthlyStats } = await supabase
      .rpc('get_monthly_unique_users', {
        start_date: twelveMonthsAgo.toISOString(),
        end_date: new Date().toISOString()
      });
    
    // Classes les plus consultées
    const { data: topClasses } = await supabase
      .from('page_analytics')
      .select('class_level')
      .eq('page_type', 'class')
      .not('class_level', 'is', null);
    
    const classCount = topClasses?.reduce((acc, item) => {
      acc[item.class_level] = (acc[item.class_level] || 0) + 1;
      return acc;
    }, {} as Record<string, number>) || {};
    
    const topClassesArray = Object.entries(classCount)
      .map(([class_level, views]) => ({ class_level, views }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 10);
    
    // Chapitres les plus consultés
    const { data: topChapters } = await supabase
      .from('page_analytics')
      .select('page_title, class_level')
      .eq('page_type', 'chapter')
      .not('page_title', 'is', null);
    
    const chapterCount = topChapters?.reduce((acc, item) => {
      const key = `${item.page_title}|${item.class_level}`;
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {} as Record<string, number>) || {};
    
    const topChaptersArray = Object.entries(chapterCount)
      .map(([key, views]) => {
        const [page_title, class_level] = key.split('|');
        return { page_title, class_level, views };
      })
      .sort((a, b) => b.views - a.views)
      .slice(0, 10);
    
    // Visiteurs par pays
    const { data: visitorsByCountry } = await supabase
      .from('visitor_sessions')
      .select('country');
    
    const countryCount = visitorsByCountry?.reduce((acc, item) => {
      const country = item.country || 'Non renseigné';
      acc[country] = (acc[country] || 0) + 1;
      return acc;
    }, {} as Record<string, number>) || {};
    
    const visitorsByCountryArray = Object.entries(countryCount)
      .map(([country, visitors]) => ({ country, visitors }))
      .sort((a, b) => b.visitors - a.visitors);
    
    return NextResponse.json({
      totalVisitors: totalVisitors || 0,
      totalPageViews: totalPageViews || 0,
      topClasses: topClassesArray,
      topChapters: topChaptersArray,
      visitorsByCountry: visitorsByCountryArray,
      weeklyStats: weeklyStats || [],
      monthlyStats: monthlyStats || []
    });
    
  } catch (error) {
    console.error('Erreur dashboard:', error);
    return NextResponse.json({ 
      error: 'Erreur serveur' 
    }, { status: 500 });
  }
}
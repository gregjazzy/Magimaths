import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get('days') || '30'); // Par défaut 30 jours
    
    const supabase = createClient();
    
    // Calculer la date de début
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    // Requête pour les utilisateurs uniques par jour
    const { data: dailyUsers, error: usersError } = await supabase
      .rpc('get_daily_unique_users', {
        start_date: startDate.toISOString(),
        end_date: new Date().toISOString()
      });
    
    if (usersError) {
      console.error('Erreur requête utilisateurs:', usersError);
    }
    
    // Requête pour les vues de pages par jour
    const { data: dailyViews, error: viewsError } = await supabase
      .rpc('get_daily_page_views', {
        start_date: startDate.toISOString(),
        end_date: new Date().toISOString()
      });
    
    if (viewsError) {
      console.error('Erreur requête vues:', viewsError);
    }
    
    // Combiner les données
    const dailyStats = [];
    for (let i = 0; i < days; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);
      const dateStr = currentDate.toISOString().split('T')[0];
      
      const userStat = dailyUsers?.find((d: any) => d.date === dateStr);
      const viewStat = dailyViews?.find((d: any) => d.date === dateStr);
      
      dailyStats.push({
        date: dateStr,
        uniqueUsers: userStat?.unique_users || 0,
        totalViews: viewStat?.total_views || 0,
        newUsers: userStat?.new_users || 0
      });
    }
    
    return NextResponse.json({
      success: true,
      data: dailyStats,
      period: `${days} derniers jours`
    });
    
  } catch (error) {
    console.error('Erreur stats quotidiennes:', error);
    return NextResponse.json({ 
      success: false,
      error: 'Erreur serveur' 
    }, { status: 500 });
  }
}
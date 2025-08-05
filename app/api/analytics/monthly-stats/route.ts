import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const months = parseInt(searchParams.get('months') || '12'); // Par défaut 12 mois
    
    const supabase = createClient();
    
    // Calculer la date de début (début du mois il y a X mois)
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - months);
    startDate.setDate(1); // Premier jour du mois
    startDate.setHours(0, 0, 0, 0);
    
    // Requête pour les utilisateurs uniques par mois
    const { data: monthlyUsers, error: usersError } = await supabase
      .rpc('get_monthly_unique_users', {
        start_date: startDate.toISOString(),
        end_date: new Date().toISOString()
      });
    
    if (usersError) {
      console.error('Erreur requête utilisateurs mensuels:', usersError);
    }
    
    // Requête pour les vues de pages par mois
    const { data: monthlyViews, error: viewsError } = await supabase
      .rpc('get_monthly_page_views', {
        start_date: startDate.toISOString(),
        end_date: new Date().toISOString()
      });
    
    if (viewsError) {
      console.error('Erreur requête vues mensuelles:', viewsError);
    }
    
    // Générer tous les mois dans la période
    const monthlyStats = [];
    const currentDate = new Date(startDate);
    
    while (currentDate <= new Date()) {
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1;
      const monthKey = `${year}-${month.toString().padStart(2, '0')}`;
      
      const userStat = monthlyUsers?.find((d: any) => d.month === monthKey);
      const viewStat = monthlyViews?.find((d: any) => d.month === monthKey);
      
      monthlyStats.push({
        month: monthKey,
        monthName: currentDate.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' }),
        uniqueUsers: userStat?.unique_users || 0,
        totalViews: viewStat?.total_views || 0,
        newUsers: userStat?.new_users || 0
      });
      
      currentDate.setMonth(currentDate.getMonth() + 1);
    }
    
    return NextResponse.json({
      success: true,
      data: monthlyStats,
      period: `${months} derniers mois`
    });
    
  } catch (error) {
    console.error('Erreur stats mensuelles:', error);
    return NextResponse.json({ 
      success: false,
      error: 'Erreur serveur' 
    }, { status: 500 });
  }
}
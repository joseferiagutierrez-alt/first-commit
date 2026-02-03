"use client"; 
import { useEffect, useState } from "react"; 
import { createClient } from "@/utils/supabase/client"; 
import { useRouter } from "next/navigation"; 
import { 
  LogOut, 
  User, 
  Terminal, 
  CheckCircle2, 
  AlertCircle, 
  Code2, 
  Cpu, 
  LayoutDashboard,
  Bell,
  Search,
  Settings,
  ChevronRight,
  Shield
} from "lucide-react"; 
import { cn } from "@/lib/utils";

export default function Dashboard() { 
  const [profile, setProfile] = useState<any>(null); 
  const [loading, setLoading] = useState(true); 
  const [profileViews, setProfileViews] = useState<{company_name: string, viewed_at: string}[]>([]);
  const router = useRouter(); 
  const supabase = createClient(); 

  useEffect(() => { 
    const getUser = async () => { 
      const { data: { user } } = await supabase.auth.getUser(); 
      if (!user) { router.push("/auth/signin"); return; } 
      
      const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single(); 
      setProfile(data); 

      // Fetch Profile Views (Simulated notification)
      const { data: views } = await supabase
        .from('profile_views')
        .select('company_name, viewed_at')
        .eq('candidate_id', user.id)
        .order('viewed_at', { ascending: false })
        .limit(5);
        
      if (views) {
        setProfileViews(views);
      }

      setLoading(false); 
    }; 
    getUser(); 
  }, [router, supabase]); 

  const handleSignOut = async () => { await supabase.auth.signOut(); router.push("/"); }; 

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-4">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-500 font-mono text-sm animate-pulse">Cargando entorno...</p>
    </div>
  ); 

  // Determine theme based on Tech Path
  const getTheme = () => {
    switch(profile?.tech_path) {
        case 'infra': return { icon: Terminal, color: 'text-green-500', bg: 'bg-green-500', border: 'border-green-200', gradient: 'from-green-500/10' };
        case 'data': return { icon: Cpu, color: 'text-purple-500', bg: 'bg-purple-500', border: 'border-purple-200', gradient: 'from-purple-500/10' };
        case 'cyber': return { icon: Shield, color: 'text-red-500', bg: 'bg-red-500', border: 'border-red-200', gradient: 'from-red-500/10' };
        default: return { icon: Code2, color: 'text-blue-500', bg: 'bg-blue-500', border: 'border-blue-200', gradient: 'from-blue-500/10' };
    }
  };

  const theme = getTheme();
  const PathIcon = theme.icon;

  return ( 
    <div className="min-h-screen bg-slate-50/50"> 
      
      {/* --- Top Navigation Bar --- */}
      <nav className="bg-white border-b border-slate-200 px-6 py-4 sticky top-0 z-30"> 
        <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="flex items-center gap-3">
                <div className={cn("p-2 rounded-lg text-white", theme.bg)}>
                    <PathIcon size={20} />
                </div>
                <div>
                    <div className="font-bold text-slate-900 leading-none">FirstCommit</div>
                    <div className="text-xs text-slate-500 font-mono mt-1">
                        {profile?.tech_path ? `${profile.tech_path.toUpperCase()}_WORKSPACE` : 'DEV_WORKSPACE'}
                    </div>
                </div>
            </div>
            
            <div className="flex items-center gap-6">
                <div className="hidden md:flex items-center bg-slate-100 rounded-full px-4 py-2 gap-2 text-slate-500 text-sm">
                    <Search size={16} />
                    <span>Buscar comandos... (Ctrl+K)</span>
                </div>
                
                <div className="flex items-center gap-4">
                    <button className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors">
                        <Bell size={20} />
                        {profileViews.length > 0 && <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>}
                    </button>
                    <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors">
                        <Settings size={20} />
                    </button>
                    <div className="h-6 w-px bg-slate-200 mx-2"></div>
                    <button onClick={handleSignOut} className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-red-600 transition-colors">
                        <LogOut size={16} /> <span className="hidden sm:inline">Desconectar</span>
                    </button>
                </div>
            </div>
        </div>
      </nav> 

      <main className="max-w-7xl mx-auto p-6 lg:p-10"> 
        
        {/* --- Welcome Header --- */}
        <div className="mb-10">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
                Bienvenido de nuevo, {profile?.full_name?.split(' ')[0]}
            </h1>
            <p className="text-slate-500">
                Aquí tienes el resumen de tu actividad y estado actual.
            </p>
        </div>

        {/* --- Status Card --- */}
        <div className="grid lg:grid-cols-3 gap-8 mb-10">
            {/* Main Status */}
            <div className="lg:col-span-2 bg-white rounded-2xl p-8 border border-slate-200 shadow-sm relative overflow-hidden group">
                <div className={cn("absolute top-0 right-0 w-64 h-64 bg-gradient-to-br rounded-bl-full opacity-50 transition-transform group-hover:scale-110", theme.gradient)}></div>
                
                <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-6">
                    <div className={cn("w-20 h-20 rounded-2xl flex items-center justify-center text-3xl font-bold text-white shadow-lg", theme.bg)}>
                        {profile?.full_name?.[0] || <User />}
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                            <h2 className="text-2xl font-bold text-slate-900">{profile?.full_name}</h2>
                            <span className={cn("px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide bg-slate-100 text-slate-600 border border-slate-200")}>
                                {profile?.tech_path || 'Developer'}
                            </span>
                        </div>
                        
                        {profile?.is_verified ? 
                            <div className="inline-flex items-center gap-2 text-green-600 bg-green-50 px-3 py-1.5 rounded-lg border border-green-100">
                                <CheckCircle2 size={18} />
                                <span className="font-semibold">Perfil Verificado Oficialmente</span>
                            </div> : 
                            <div className="inline-flex items-center gap-2 text-amber-600 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-100 animate-pulse">
                                <AlertCircle size={18} />
                                <span className="font-semibold">Verificación Pendiente</span>
                            </div> 
                        }
                    </div>
                    
                    {!profile?.is_verified && (
                        <button onClick={() => router.push('/tests')} className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 flex items-center gap-2 whitespace-nowrap">
                            <Terminal size={18} /> Iniciar Test
                        </button>
                    )}
                </div>
            </div>

            {/* Quick Stats / Notifications */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col">
                <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <Bell size={18} className="text-slate-400" /> Actividad Reciente
                </h3>
                <div className="flex-1 overflow-y-auto pr-2 space-y-4 max-h-[200px]">
                    {profileViews.length > 0 ? (
                        profileViews.map((view, i) => (
                            <div key={i} className="flex items-start gap-3 text-sm p-3 rounded-lg bg-slate-50 hover:bg-blue-50 transition-colors">
                                <div className="mt-1 w-2 h-2 rounded-full bg-blue-500"></div>
                                <div>
                                    <p className="text-slate-900 font-medium">
                                        <span className="font-bold">{view.company_name}</span> vio tu perfil.
                                    </p>
                                    <p className="text-slate-400 text-xs mt-1">
                                        {new Date(view.viewed_at).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-8 text-slate-400">
                            <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
                            <p className="text-xs">Sin actividad reciente. Completa tu test para aparecer en búsquedas.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>

        {/* --- Action Cards --- */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
           {/* Test Card */}
           <div className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-slate-300 transition-all group cursor-pointer" onClick={() => router.push('/tests')}>
             <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center mb-4 text-slate-600 group-hover:bg-slate-900 group-hover:text-white transition-colors">
                <Terminal size={24} />
             </div>
             <h3 className="text-lg font-bold mb-2 group-hover:text-blue-600 transition-colors">Prueba Técnica</h3>
             <p className="text-slate-500 text-sm mb-4">
                Valida tus conocimientos en {profile?.tech_path || 'tu área'} con nuestros retos interactivos.
             </p>
             <div className="flex items-center text-sm font-bold text-slate-400 group-hover:text-blue-600 transition-colors">
                Ir ahora <ChevronRight size={16} />
             </div>
           </div>

           {/* Jobs Card */}
           <div className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-slate-300 transition-all group cursor-pointer" onClick={() => router.push('/jobs')}>
             <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center mb-4 text-slate-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <LayoutDashboard size={24} />
             </div>
             <h3 className="text-lg font-bold mb-2 group-hover:text-blue-600 transition-colors">Ofertas de Empleo</h3>
             <p className="text-slate-500 text-sm mb-4">
                Explora vacantes exclusivas para talento verificado en FirstCommit.
             </p>
             <div className="flex items-center text-sm font-bold text-slate-400 group-hover:text-blue-600 transition-colors">
                Ver ofertas <ChevronRight size={16} />
             </div>
           </div>
        </div>

      </main> 
    </div> 
  ); 
 }

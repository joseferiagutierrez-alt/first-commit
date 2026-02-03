"use client"; 
 
 import { useEffect, useState } from "react"; 
 import { createClient } from "@/utils/supabase/client"; 
 import { useRouter } from "next/navigation"; 
 import { LogOut, User, Terminal, CheckCircle2, AlertCircle, Shield, Database, Network, Code2 } from "lucide-react"; 
 
 export default function Dashboard() { 
   const [profile, setProfile] = useState<any>(null); 
   const [loading, setLoading] = useState(true); 
   const router = useRouter(); 
   const supabase = createClient(); 
 
   useEffect(() => { 
     const getUser = async () => { 
       const { data: { user } } = await supabase.auth.getUser(); 
       if (!user) { router.push("/auth/signin"); return; } 
       const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single(); 
       setProfile(data); 
       setLoading(false); 
     }; 
     getUser(); 
   }, [router, supabase]); 
 
   const handleSignOut = async () => { await supabase.auth.signOut(); router.push("/"); }; 
 
   const getRoleData = (role: string) => { 
     switch(role) { 
         case 'infra': return { label: "Infraestructura", icon: <Network size={32} />, color: "bg-orange-500" }; 
         case 'cyber': return { label: "Ciberseguridad", icon: <Shield size={32} />, color: "bg-red-600" }; 
         case 'data': return { label: "Data Science", icon: <Database size={32} />, color: "bg-green-600" }; 
         default: return { label: "Desarrollador", icon: <Code2 size={32} />, color: "bg-blue-600" }; 
     } 
   }; 
 
   if (loading) return <div className="min-h-screen flex items-center justify-center">Cargando perfil...</div>; 
 
   const roleData = getRoleData(profile?.tech_path);

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white border-b px-6 py-4 flex justify-between items-center">
        <div className="font-bold text-xl text-blue-600">FirstCommit</div>
        <button onClick={handleSignOut} className="flex items-center gap-2 text-sm text-slate-600 hover:text-red-600 transition-colors"><LogOut size={16} /> Salir</button>
      </nav>
      <main className="max-w-5xl mx-auto p-6">
        {/* Tarjeta Perfil */}
        <div className="bg-white rounded-xl p-8 shadow-sm border mb-8 flex flex-col md:flex-row gap-6 items-start">
            <div className={`h-20 w-20 rounded-2xl flex items-center justify-center text-white shadow-lg ${roleData.color}`}>
              {roleData.icon}
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-slate-900">{profile?.full_name}</h1>
              <div className="flex items-center gap-2 mt-2">
                <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-sm font-semibold border">{roleData.label}</span>
                {profile?.is_verified && <span className="text-green-600 text-sm font-bold flex items-center gap-1"><CheckCircle2 size={14} /> Verificado</span>}
              </div>
              {profile?.bio && <p className="mt-4 text-slate-600 bg-slate-50 p-3 rounded-lg border italic text-sm">"{profile.bio}"</p>}
            </div>
        </div>

        {/* Sección Pruebas */}
        <h2 className="text-xl font-bold mb-4 text-slate-800">Pruebas para tu Rol</h2>
        <div className="bg-white p-6 rounded-xl border hover:shadow-md transition-shadow group">
            <div className="flex justify-between items-start mb-4">
              <div className="h-12 w-12 bg-black text-white rounded-xl flex items-center justify-center"><Terminal size={24} /></div>
              <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-1 rounded">PENDIENTE</span>
            </div>
            <h3 className="text-lg font-bold mb-2">Test Técnico: {roleData.label}</h3>
            <p className="text-slate-500 text-sm mb-6">Valida tus conocimientos de {roleData.label} en un entorno real.</p>
            <button className="w-full bg-black text-white py-3 rounded-lg font-bold hover:bg-gray-800">Iniciar Prueba</button>
        </div>
      </main>
    </div>
  ); 
 }

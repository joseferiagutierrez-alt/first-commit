"use client"; 
import { useEffect, useState } from "react"; 
import { createClient } from "@/utils/supabase/client"; 
import { useRouter } from "next/navigation"; 
import { LogOut, User, Terminal, CheckCircle2, AlertCircle } from "lucide-react"; 

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

  if (loading) return <div className="min-h-screen flex items-center justify-center">Cargando...</div>; 

  return ( 
    <div className="min-h-screen bg-slate-50"> 
      <nav className="bg-white border-b px-6 py-4 flex justify-between items-center"> 
        <div className="font-bold text-xl text-blue-600">FirstCommit Dashboard</div> 
        <button onClick={handleSignOut} className="flex items-center gap-2 text-sm text-slate-600 hover:text-red-600 transition-colors"><LogOut size={16} /> Salir</button> 
      </nav> 
      <main className="max-w-5xl mx-auto p-6"> 
        <div className="bg-white rounded-xl p-8 shadow-sm border mb-8"> 
          <div className="flex items-center gap-4 mb-4"> 
            <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-2xl font-bold">{profile?.full_name?.[0] || <User />}</div> 
            <div><h1 className="text-2xl font-bold">Hola, {profile?.full_name} 👋</h1><p className="text-slate-500">Rol: <span className="uppercase font-semibold">{profile?.tech_path || 'Dev'}</span></p></div> 
          </div> 
          {profile?.is_verified ? 
            <div className="bg-green-50 text-green-700 p-4 rounded-lg flex items-center gap-3 border border-green-100"><CheckCircle2 /><span className="font-medium">Perfil Verificado.</span></div> : 
            <div className="bg-amber-50 text-amber-700 p-4 rounded-lg flex items-center gap-3 border border-amber-100"><AlertCircle /><span className="font-medium">No verificado. Completa el test técnico.</span></div> 
          } 
        </div> 
        <div className="grid md:grid-cols-2 gap-6"> 
          <div className="bg-white p-6 rounded-xl border hover:shadow-md transition-shadow"> 
            <div className="h-10 w-10 bg-black text-white rounded-lg flex items-center justify-center mb-4"><Terminal size={20} /></div> 
            <h3 className="text-lg font-bold mb-2">Prueba Técnica</h3> 
            <p className="text-slate-500 text-sm mb-4">Valida tus conocimientos técnicos.</p> 
            <button className="w-full bg-black text-white py-2 rounded-lg font-medium hover:bg-gray-800">Comenzar</button> 
          </div> 
        </div> 
      </main> 
    </div> 
  ); 
 }
"use client"; 

import { useEffect, useState } from "react"; 
import { createClient } from "@/utils/supabase/client"; 
import { useRouter } from "next/navigation"; 
import { 
  LogOut, User, Terminal, CheckCircle2, AlertCircle, 
  Shield, Database, Network, Code2, 
  Pencil, Save, MapPin, Github, Linkedin, Globe, Loader2 
} from "lucide-react"; 

export default function Dashboard() { 
  const [profile, setProfile] = useState<any>(null); 
  const [loading, setLoading] = useState(true); 
  const [isEditing, setIsEditing] = useState(false); 
  const [formData, setFormData] = useState<any>({}); 
  const [saving, setSaving] = useState(false); 
  
  const router = useRouter(); 
  const supabase = createClient();

  // 1. Cargar el usuario y perfil 
  useEffect(() => { 
    const getUser = async () => { 
      const { data: { user } } = await supabase.auth.getUser(); 
      if (!user) { router.push("/auth/signin"); return; } 
      
      const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single(); 
      setProfile(data); 
      setFormData(data || {}); 
      setLoading(false); 
    }; 
    getUser(); 
  }, [router, supabase]); 

  // 2. Función para Cerrar Sesión 
  const handleSignOut = async () => { await supabase.auth.signOut(); router.push("/"); }; 

  // 3. Función para Guardar Cambios en Supabase 
  const handleSaveProfile = async () => { 
    setSaving(true); 
    const { error } = await supabase 
      .from('profiles') 
      .update({ 
        full_name: formData.full_name, 
        bio: formData.bio, 
        job_title: formData.job_title, 
        location: formData.location, 
        github_url: formData.github_url, 
        linkedin_url: formData.linkedin_url, 
        website_url: formData.website_url 
      }) 
      .eq('id', profile.id); 

    if (!error) { 
      setProfile(formData); 
      setIsEditing(false); 
    } else { 
      alert("Error al guardar. Inténtalo de nuevo."); 
    } 
    setSaving(false); 
  }; 

  // 4. Helper para Colores e Iconos según el Rol 
  const getRoleData = (role: string) => { 
    switch(role) { 
        case 'infra': return { label: "Infraestructura", icon: <Network size={32} />, color: "bg-orange-500", bg: "bg-orange-50", text: "text-orange-600" }; 
        case 'cyber': return { label: "Ciberseguridad", icon: <Shield size={32} />, color: "bg-red-600", bg: "bg-red-50", text: "text-red-600" }; 
        case 'data': return { label: "Data Science", icon: <Database size={32} />, color: "bg-green-600", bg: "bg-green-50", text: "text-green-600" }; 
        default: return { label: "Desarrollador", icon: <Code2 size={32} />, color: "bg-blue-600", bg: "bg-blue-50", text: "text-blue-600" }; 
    } 
  }; 

  if (loading) return <div className="min-h-screen flex items-center justify-center">Cargando perfil...</div>; 
  const roleData = getRoleData(profile?.tech_path);

  return ( 
    <div className="min-h-screen bg-slate-50"> 
      {/* NAVBAR */} 
      <nav className="bg-white border-b px-6 py-4 flex justify-between items-center sticky top-0 z-10 shadow-sm"> 
        <div className="font-bold text-xl text-blue-600 flex items-center gap-2">FirstCommit <span className="text-xs bg-slate-100 text-slate-500 px-2 py-1 rounded-full">BETA</span></div> 
        <button onClick={handleSignOut} className="flex items-center gap-2 text-sm text-slate-600 hover:text-red-600 transition-colors"><LogOut size={16} /> Salir</button> 
      </nav> 

      <main className="max-w-5xl mx-auto p-6 space-y-6"> 
        {/* CARD PRINCIPAL */} 
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 relative overflow-hidden"> 
          <div className={`absolute top-0 left-0 w-full h-32 ${roleData.bg} opacity-50`}></div> 
          
          <div className="relative pt-12 flex flex-col md:flex-row gap-6 items-start"> 
            {/* AVATAR */} 
            <div className={`h-24 w-24 rounded-2xl flex items-center justify-center text-white shadow-xl border-4 border-white ${roleData.color}`}> 
              {roleData.icon} 
            </div> 

            {/* DATOS PRINCIPALES (Nombre, Cargo, Ubicación) */} 
            <div className="flex-1 w-full"> 
              <div className="flex justify-between items-start"> 
                <div className="w-full max-w-lg"> 
                  {isEditing ? ( 
                     <div className="space-y-3 mb-4"> 
                        <input type="text" value={formData.full_name} onChange={e => setFormData({...formData, full_name: e.target.value})} className="text-3xl font-bold text-slate-900 border-b-2 border-blue-200 focus:border-blue-500 outline-none w-full bg-transparent" placeholder="Tu Nombre" /> 
                        <input type="text" value={formData.job_title || ''} onChange={e => setFormData({...formData, job_title: e.target.value})} className="text-lg text-slate-600 border-b border-slate-200 focus:border-blue-500 outline-none w-full" placeholder="Ej: Junior Frontend Developer" /> 
                        <div className="flex items-center gap-2"> 
                           <MapPin size={16} className="text-slate-400" /> 
                           <input type="text" value={formData.location || ''} onChange={e => setFormData({...formData, location: e.target.value})} className="text-sm text-slate-500 border-b border-slate-200 focus:border-blue-500 outline-none w-full" placeholder="Ciudad, País" /> 
                        </div> 
                     </div> 
                  ) : ( 
                    <> 
                      <h1 className="text-3xl font-bold text-slate-900">{profile?.full_name}</h1> 
                      <p className="text-lg text-slate-600 font-medium">{profile?.job_title || "Define tu puesto profesional"}</p> 
                      <div className="flex items-center gap-4 mt-2 text-sm text-slate-500"> 
                        {profile?.location && <span className="flex items-center gap-1"><MapPin size={14} /> {profile.location}</span>} 
                        <span className={`px-2 py-0.5 rounded-md ${roleData.bg} ${roleData.text} font-bold border border-slate-100`}>{roleData.label}</span> 
                      </div> 
                    </> 
                  )} 
                </div> 

                {/* BOTÓN EDITAR */} 
                <button 
                  onClick={isEditing ? handleSaveProfile : () => setIsEditing(true)} 
                  disabled={saving} 
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${isEditing ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'}`} 
                > 
                  {isEditing ? (saving ? <Loader2 className="animate-spin" size={18}/> : <><Save size={18} /> Guardar</>) : <><Pencil size={18} /> Editar</>} 
                </button> 
              </div>

              {/* BIO Y REDES SOCIALES */} 
              <div className="mt-6 border-t pt-6"> 
                 {isEditing ? ( 
                    <div className="grid md:grid-cols-2 gap-6"> 
                        <div> 
                            <label className="block text-sm font-medium text-slate-700 mb-1">Sobre mí</label> 
                            <textarea value={formData.bio || ''} onChange={e => setFormData({...formData, bio: e.target.value})} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none h-32 text-sm" placeholder="Tus habilidades principales..." /> 
                        </div> 
                        <div className="space-y-3"> 
                            <label className="block text-sm font-medium text-slate-700">Enlaces</label> 
                            <div className="flex items-center gap-2 border rounded-lg px-3 py-2 bg-white"><Github size={16} /><input type="text" placeholder="GitHub URL" value={formData.github_url || ''} onChange={e => setFormData({...formData, github_url: e.target.value})} className="flex-1 outline-none text-sm" /></div> 
                            <div className="flex items-center gap-2 border rounded-lg px-3 py-2 bg-white"><Linkedin size={16} /><input type="text" placeholder="LinkedIn URL" value={formData.linkedin_url || ''} onChange={e => setFormData({...formData, linkedin_url: e.target.value})} className="flex-1 outline-none text-sm" /></div> 
                            <div className="flex items-center gap-2 border rounded-lg px-3 py-2 bg-white"><Globe size={16} /><input type="text" placeholder="Portfolio URL" value={formData.website_url || ''} onChange={e => setFormData({...formData, website_url: e.target.value})} className="flex-1 outline-none text-sm" /></div> 
                        </div> 
                    </div> 
                 ) : ( 
                    <div className="grid md:grid-cols-3 gap-8"> 
                        <div className="md:col-span-2"> 
                             <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">Sobre mí</h3> 
                             <p className="text-slate-600 leading-relaxed text-sm whitespace-pre-wrap">{profile?.bio || "Añade una descripción para destacar."}</p> 
                        </div> 
                        <div className="space-y-2"> 
                            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">Contacto</h3> 
                            {profile?.github_url && <a href={profile.github_url} target="_blank" className="flex items-center gap-2 text-slate-600 hover:text-black text-sm hover:underline"><Github size={16} /> GitHub</a>} 
                            {profile?.linkedin_url && <a href={profile.linkedin_url} target="_blank" className="flex items-center gap-2 text-slate-600 hover:text-blue-700 text-sm hover:underline"><Linkedin size={16} /> LinkedIn</a>} 
                            {profile?.website_url && <a href={profile.website_url} target="_blank" className="flex items-center gap-2 text-slate-600 hover:text-blue-600 text-sm hover:underline"><Globe size={16} /> Portfolio</a>} 
                        </div> 
                    </div> 
                 )} 
              </div> 
            </div> 
          </div> 
        </div>

        {/* SECCIÓN INFERIOR: PRUEBAS TÉCNICAS */} 
        <div className="grid md:grid-cols-3 gap-6"> 
            <div className="md:col-span-2 bg-white p-6 rounded-xl border hover:shadow-md transition-shadow"> 
                <div className="flex justify-between items-start mb-4"> 
                  <div className="flex items-center gap-3"> 
                     <div className="h-10 w-10 bg-black text-white rounded-lg flex items-center justify-center"><Terminal size={20} /></div> 
                     <div> 
                        <h3 className="font-bold text-slate-900">Evaluación: {roleData.label}</h3> 
                        <p className="text-xs text-slate-500">Nivel Junior • ~45 Minutos</p> 
                     </div> 
                  </div> 
                  {profile?.is_verified ? 
                    <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded flex items-center gap-1"><CheckCircle2 size={12} /> APROBADO</span> : 
                    <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-1 rounded">PENDIENTE</span> 
                  } 
                </div> 
                <p className="text-slate-600 text-sm mb-6">Esta prueba validará tus conocimientos en {roleData.label}. Superarla activará tu insignia de "Verificado".</p> 
                <button onClick={() => router.push('/tests')} disabled={profile?.is_verified} className="w-full bg-black text-white py-2 rounded-lg font-medium hover:bg-gray-800 disabled:opacity-50 transition-colors"> 
                  {profile?.is_verified ? "Ya estás verificado" : "Comenzar Evaluación"} 
                </button> 
            </div> 

            <div className="bg-white p-6 rounded-xl border"> 
                 <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2"><CheckCircle2 size={18} /> Visibilidad</h3> 
                 {profile?.is_verified ? ( 
                    <div className="text-center py-4"> 
                        <div className="inline-flex bg-green-100 p-3 rounded-full mb-3"><CheckCircle2 className="text-green-600" size={32} /></div> 
                        <p className="font-medium text-green-700">Visible</p> 
                        <p className="text-xs text-green-600 mt-1">Tu perfil es público para empresas.</p> 
                    </div> 
                 ) : ( 
                    <div className="text-center py-4"> 
                         <div className="inline-flex bg-amber-100 p-3 rounded-full mb-3"><AlertCircle className="text-amber-600" size={32} /></div> 
                        <p className="font-medium text-amber-700">Oculto</p> 
                        <p className="text-xs text-amber-600 mt-1">Aprueba el test para ser visto.</p> 
                    </div> 
                 )} 
            </div> 
        </div> 
      </main> 
    </div> 
  ); 
}
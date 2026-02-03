"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Briefcase, 
  CheckCircle2, 
  ChevronRight, 
  Terminal, 
  Code2, 
  Server, 
  Database, 
  Palette, 
  ShieldCheck, 
  Bug,
  Map,
  TrendingUp,
  Pencil,
  Save,
  Loader2,
  Github,
  Linkedin,
  Globe,
  AlertCircle,
  MapPin
} from "lucide-react";

// Types matching database
type TechPath = 'dev' | 'infra' | 'data' | 'design' | 'cyber' | 'qa';

interface Profile {
  id: string;
  full_name: string;
  tech_path: TechPath;
  job_title?: string | null;
  location?: string | null;
  xp_level: string;
  github_url: string | null;
  linkedin_url: string | null;
  portfolio_url: string | null;
  website_url?: string | null;
  bio: string | null;
  is_verified: boolean;
}

interface JobOffer {
  id: string;
  title: string;
  company: string;
  type: string;
  salary: string;
  path: TechPath;
}

// Mock Data for Jobs
const MOCK_JOBS: JobOffer[] = [
  { id: '1', title: 'Junior Frontend Developer', company: 'TechFlow', type: 'Remote', salary: '€24k - €30k', path: 'dev' },
  { id: '2', title: 'React Native Intern', company: 'MobileFirst', type: 'Hybrid', salary: '€18k - €22k', path: 'dev' },
  { id: '3', title: 'Junior SysAdmin', company: 'CloudCorp', type: 'On-site', salary: '€25k - €32k', path: 'infra' },
  { id: '4', title: 'DevOps Trainee', company: 'ScaleUp', type: 'Remote', salary: '€22k - €28k', path: 'infra' },
  { id: '5', title: 'Junior Data Analyst', company: 'DataWiz', type: 'Hybrid', salary: '€28k - €35k', path: 'data' },
  { id: '6', title: 'UI/UX Junior Designer', company: 'CreativeStudio', type: 'Remote', salary: '€24k - €30k', path: 'design' },
  { id: '7', title: 'Junior Pentester', company: 'SecureNet', type: 'On-site', salary: '€30k - €38k', path: 'cyber' },
  { id: '8', title: 'QA Tester', company: 'QualitySoft', type: 'Remote', salary: '€22k - €28k', path: 'qa' },
];

export default function DashboardPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Derived state
  const hasPassedTest = profile?.is_verified;

  // Edit Mode State
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<Profile | null>(null);

  const supabase = createClient();

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        if (data && !error) {
          setProfile(data as Profile);
          setFormData(data as Profile);
        }
      }
      setLoading(false);
    };

    fetchProfile();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/"); // Redirige al Home
    router.refresh(); // Refresca para limpiar estado
  };

  // Función para Guardar Cambios (Incluyendo el Rol)
  const handleSaveProfile = async () => { 
    setSaving(true); 
    
    if (!formData || !profile) {
      setSaving(false);
      return;
    }

    try { 
        const { error } = await supabase 
          .from('profiles') 
          .update({ 
            full_name: formData.full_name, 
            bio: formData.bio || '', // Asegura que no sea null 
            job_title: formData.job_title || '', 
            location: formData.location || '', 
            github_url: formData.github_url || '', 
            linkedin_url: formData.linkedin_url || '', 
            website_url: formData.website_url || '', 
            tech_path: formData.tech_path || 'dev' 
          }) 
          .eq('id', profile.id); 

        if (error) throw error; 

        setProfile(formData); 
        setIsEditing(false); 
        alert("¡Perfil actualizado con éxito!"); 
        
    } catch (error: any) { 
        console.error("Error guardando:", error); 
        alert(`Error al guardar: ${error.message || "Inténtalo de nuevo"}`); 
    } finally { 
        setSaving(false); 
    } 
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
        <p className="text-xl text-gray-400 mb-4">Profile not found. Please complete onboarding.</p>
        <Link href="/onboarding" className="text-blue-500 hover:underline">Go to Onboarding</Link>
      </div>
    );
  }

  // Helpers
  const getPathBadge = (path: TechPath) => {
    const styles = {
      dev: 'bg-blue-500/10 text-blue-400 border-blue-500/50',
      infra: 'bg-orange-500/10 text-orange-400 border-orange-500/50',
      data: 'bg-green-500/10 text-green-400 border-green-500/50',
      design: 'bg-pink-500/10 text-pink-400 border-pink-500/50',
      cyber: 'bg-red-500/10 text-red-400 border-red-500/50',
      qa: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/50',
    };
    const labels = {
      dev: 'Developer',
      infra: 'Infrastructure',
      data: 'Data Scientist',
      design: 'Designer',
      cyber: 'Cybersecurity',
      qa: 'QA Engineer',
    };
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium border ${styles[path] || styles.dev}`}>
        {labels[path] || path}
      </span>
    );
  };

  const getRoadmapStep = (path: TechPath) => {
    switch (path) {
      case 'infra':
        return { text: "Configura tu primer servidor Linux", icon: Server };
      case 'dev':
        return { text: "Conecta tu repositorio más popular", icon: Code2 };
      case 'data':
        return { text: "Analiza tu primer dataset en Kaggle", icon: Database };
      case 'design':
        return { text: "Sube tu primer shot a Dribbble", icon: Palette };
      case 'cyber':
        return { text: "Completa una sala en HackTheBox", icon: ShieldCheck };
      case 'qa':
        return { text: "Escribe tu primer test E2E", icon: Bug };
      default:
        return { text: "Completa tu perfil", icon: Terminal };
    }
  };

  const calculateProgress = () => {
    let score = 50; // Base score for creating account
    if (profile.bio) score += 10;
    if (profile.github_url || profile.portfolio_url) score += 20;
    if (profile.linkedin_url) score += 20;
    return Math.min(score, 100);
  };

  const nextStep = getRoadmapStep(profile.tech_path);
  const progress = calculateProgress();
  const relevantJobs = MOCK_JOBS.filter(job => job.path === profile.tech_path);
  
  const roleStyles = {
    dev: { bg: 'bg-blue-500/10', text: 'text-blue-400' },
    infra: { bg: 'bg-orange-500/10', text: 'text-orange-400' },
    data: { bg: 'bg-green-500/10', text: 'text-green-400' },
    design: { bg: 'bg-pink-500/10', text: 'text-pink-400' },
    cyber: { bg: 'bg-red-500/10', text: 'text-red-400' },
    qa: { bg: 'bg-yellow-500/10', text: 'text-yellow-400' },
  };
  const currentRoleStyle = roleStyles[profile.tech_path] || roleStyles.dev;
  
  const roleData = { 
    label: getPathBadge(profile.tech_path).props.children,
    bg: currentRoleStyle.bg,
    text: currentRoleStyle.text
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navbar */}
      <nav className="bg-white border-b px-6 py-4 flex justify-between items-center sticky top-0 z-10 shadow-sm">
        <Link href="/" className="font-bold text-xl text-blue-600 flex items-center gap-2 hover:opacity-80 transition-opacity">
          FirstCommit <span className="text-xs bg-slate-100 text-slate-500 px-2 py-1 rounded-full">BETA</span>
        </Link>
        <div className="flex items-center gap-4">
            <Link href="/" className="text-sm font-medium text-slate-500 hover:text-slate-900">Ir al Inicio</Link>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 text-sm text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-2 rounded-lg transition-colors"
            >
              <LogOut size={16} /> Cerrar Sesión
            </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold mb-2 flex items-center gap-3">
              Hello, {profile.full_name?.split(' ')[0] || 'There'}! 👋
              {hasPassedTest && (
                <span className="bg-green-500/10 text-green-400 border border-green-500/50 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                  <CheckCircle2 size={12} />
                  SKILL VERIFIED
                </span>
              )}
            </h2>
            <p className="text-gray-400">Let's get you job-ready.</p>
          </div>
          <div className="flex items-center gap-3">
            {!hasPassedTest && (
              <Link href="/test">
                <button className="bg-white text-black px-6 py-2 rounded-full font-bold hover:bg-gray-200 transition-colors">
                  Take Diagnostic Test
                </button>
              </Link>
            )}
            {getPathBadge(profile.tech_path)}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Roadmap, Profile, Tests */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Roadmap Card */}
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Map size={100} />
              </div>
              <div className="relative z-10">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Map className="text-blue-500" size={20} />
                  Tu Roadmap
                </h3>
                <div className="bg-black/50 border border-gray-700 rounded-lg p-4 flex items-center gap-4">
                  <div className="bg-blue-500/20 p-3 rounded-full text-blue-400">
                    <nextStep.icon size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 uppercase tracking-wider font-semibold">Siguiente Paso</p>
                    <p className="text-lg font-medium">{nextStep.text}</p>
                  </div>
                  <button className="ml-auto bg-white text-black px-4 py-2 rounded-full text-sm font-bold hover:bg-gray-200 transition-colors">
                    Start
                  </button>
                </div>
              </div>
            </div>

            {/* Profile Card */}
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
                <div className="flex justify-between items-start mb-6">
                    <h3 className="text-xl font-semibold flex items-center gap-2">
                        <Pencil className="text-blue-500" size={20} />
                        Tu Perfil
                    </h3>
                    <button 
                      onClick={isEditing ? handleSaveProfile : () => setIsEditing(true)} 
                      disabled={saving} 
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${isEditing ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-white border border-gray-700 text-gray-300 hover:bg-gray-800'}`} 
                    > 
                      {isEditing ? (saving ? <Loader2 className="animate-spin" size={18}/> : <><Save size={18} /> Guardar</>) : <><Pencil size={18} /> Editar</>} 
                    </button> 
                </div>

                {/* Bio & Socials Content */}
                 {isEditing && formData ? ( 
                    <div className="space-y-4 w-full"> 
                       {/* Editar Nombre */} 
                       <div className="space-y-1">
                           <label className="text-xs font-bold text-gray-500 uppercase">Nombre Completo</label>
                           <input type="text" value={formData.full_name} onChange={e => setFormData({...formData, full_name: e.target.value})} className="text-lg text-white bg-gray-800 border border-gray-700 rounded-lg p-2 focus:border-blue-500 outline-none w-full" placeholder="Tu Nombre" /> 
                       </div>
                       
                       {/* Editar Cargo */} 
                       <div className="space-y-1">
                           <label className="text-xs font-bold text-gray-500 uppercase">Cargo</label>
                           <input type="text" value={formData.job_title || ''} onChange={e => setFormData({...formData, job_title: e.target.value})} className="text-lg text-white bg-gray-800 border border-gray-700 rounded-lg p-2 focus:border-blue-500 outline-none w-full" placeholder="Ej: Junior Frontend Developer" /> 
                       </div>
                       
                       {/* Selector de Rol */} 
                       <div className="space-y-1"> 
                           <label className="text-xs font-bold text-gray-500 uppercase">Especialidad</label> 
                           <select 
                               value={formData.tech_path || 'dev'} 
                               onChange={e => setFormData({...formData, tech_path: e.target.value as TechPath})} 
                               className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg p-2 focus:border-blue-500 outline-none" 
                           > 
                               <option value="dev">Desarrollo Software</option> 
                               <option value="infra">Infraestructura & Redes</option> 
                               <option value="cyber">Ciberseguridad</option> 
                               <option value="data">Data Science</option> 
                               <option value="qa">QA & Testing</option> 
                               <option value="design">Diseño UX/UI</option> 
                           </select> 
                       </div> 

                       {/* Editar Ubicación */} 
                       <div className="space-y-1"> 
                          <label className="text-xs font-bold text-gray-500 uppercase">Ubicación</label>
                          <div className="flex items-center gap-2 bg-gray-800 border border-gray-700 rounded-lg p-2"> 
                              <MapPin size={16} className="text-gray-400" /> 
                              <input type="text" value={formData.location || ''} onChange={e => setFormData({...formData, location: e.target.value})} className="text-sm text-white bg-transparent outline-none w-full" placeholder="Ciudad, País" /> 
                          </div>
                       </div> 
                    </div> 
                 ) : ( 
                   <div className="space-y-4"> 
                     <div>
                         <h1 className="text-2xl font-bold text-white">{profile?.full_name}</h1> 
                         <p className="text-lg text-gray-400 font-medium">{profile?.job_title || "Puesto sin definir"}</p> 
                     </div>
                     <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500"> 
                       {profile?.location && <span className="flex items-center gap-1"><MapPin size={14} /> {profile.location}</span>} 
                       <span className={`px-2 py-0.5 rounded-md ${roleData.bg} ${roleData.text} font-bold border border-white/10`}>{roleData.label}</span> 
                     </div> 
                   </div> 
                 )} 
            </div>

            {/* Skill Tests Section */} 
            <div className="grid md:grid-cols-2 gap-6"> 
                {/* Test Card */}
                <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-800 hover:border-gray-700 transition-all"> 
                    <div className="flex justify-between items-start mb-4"> 
                      <div className="flex items-center gap-3"> 
                         <div className="h-10 w-10 bg-black text-white rounded-lg flex items-center justify-center border border-gray-800"><Terminal size={20} /></div> 
                         <div> 
                            <h3 className="font-bold text-white">Evaluación</h3> 
                            <p className="text-xs text-gray-500">Nivel Junior • ~45 Min</p> 
                         </div> 
                      </div> 
                      {profile?.is_verified ? 
                        <span className="bg-green-500/10 text-green-400 text-xs font-bold px-2 py-1 rounded border border-green-500/20 flex items-center gap-1"><CheckCircle2 size={12} /> APROBADO</span> : 
                        <span className="bg-blue-500/10 text-blue-400 text-xs font-bold px-2 py-1 rounded border border-blue-500/20">PENDIENTE</span> 
                      } 
                    </div> 
                    <p className="text-gray-400 text-sm mb-6">Valida tus conocimientos en {roleData.label}. Superarla activará tu insignia de "Verificado".</p> 
                    <button onClick={() => router.push('/tests')} disabled={profile?.is_verified} className="w-full bg-white text-black py-2 rounded-lg font-bold hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"> 
                      {profile?.is_verified ? "Ya estás verificado" : "Comenzar Evaluación"} 
                    </button> 
                </div> 

                {/* Visibility Card */}
                <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-800"> 
                     <h3 className="font-bold text-white mb-4 flex items-center gap-2"><CheckCircle2 size={18} /> Visibilidad</h3> 
                     {profile?.is_verified ? ( 
                        <div className="text-center py-4"> 
                            <div className="inline-flex bg-green-500/10 p-3 rounded-full mb-3 border border-green-500/20"><CheckCircle2 className="text-green-500" size={32} /></div> 
                            <p className="font-medium text-green-400">Visible</p> 
                            <p className="text-xs text-green-500/80 mt-1">Tu perfil es público.</p> 
                        </div> 
                     ) : ( 
                        <div className="text-center py-4"> 
                             <div className="inline-flex bg-amber-500/10 p-3 rounded-full mb-3 border border-amber-500/20"><AlertCircle className="text-amber-500" size={32} /></div> 
                            <p className="font-medium text-amber-400">Oculto</p> 
                            <p className="text-xs text-amber-500/80 mt-1">Aprueba el test para ser visto.</p> 
                        </div> 
                     )} 
                </div>
              </div>
          </div>
           
           {/* Right Column: Job Feed */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold flex items-center gap-2">
              <Briefcase className="text-purple-500" size={20} />
              Empleos para ti
            </h3>
            
            <div className="space-y-4">
              {relevantJobs.length > 0 ? (
                relevantJobs.map((job) => (
                  <div key={job.id} className="bg-gray-900/50 border border-gray-800 rounded-xl p-4 hover:border-gray-700 transition-colors group cursor-pointer">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-bold group-hover:text-blue-400 transition-colors">{job.title}</h4>
                        <p className="text-sm text-gray-400">{job.company}</p>
                      </div>
                      <span className="bg-gray-800 text-xs px-2 py-1 rounded text-gray-300">{job.type}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-green-400 font-medium">{job.salary}</span>
                      <ChevronRight size={16} className="text-gray-600 group-hover:text-white transition-colors" />
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500 border border-dashed border-gray-800 rounded-xl">
                  <Briefcase size={32} className="mx-auto mb-2 opacity-50" />
                  <p>No hay ofertas disponibles aún.</p>
                </div>
              )}
            </div>
            
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-4 relative overflow-hidden">
              <div className="relative z-10">
                <h4 className="font-bold text-lg mb-1">Boost your profile 🚀</h4>
                <p className="text-sm text-blue-100 mb-3">Get 3x more views by completing your bio.</p>
                <button className="bg-white text-blue-600 text-xs font-bold px-3 py-1.5 rounded-full" onClick={() => setIsEditing(true)}>
                  Edit Profile
                </button>
              </div>
            </div>
          </div>
        </div> 
      </main> 
    </div> 
  ); 
}
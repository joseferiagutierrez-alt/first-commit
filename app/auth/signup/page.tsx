"use client"; 

import { useState } from "react"; 
import { createClient } from "@/utils/supabase/client"; 
import { useRouter } from "next/navigation"; 
import Link from "next/link"; 
import { User, Lock, Mail, ArrowLeft, Loader2, Briefcase, FileText } from "lucide-react"; 

export default function SignUp() { 
  const [fullName, setFullName] = useState(""); 
  const [email, setEmail] = useState(""); 
  const [password, setPassword] = useState(""); 
  
  // Estado para el rol (El usuario elegirá esto) 
  const [techPath, setTechPath] = useState("dev"); 
  const [bio, setBio] = useState(""); 
  
  const [loading, setLoading] = useState(false); 
  const [error, setError] = useState<string | null>(null); 
  const router = useRouter(); 
  const supabase = createClient(); 

  const handleSignUp = async (e: React.FormEvent) => { 
    e.preventDefault(); 
    setLoading(true); 
    setError(null); 

    // 1. Crear usuario en Auth 
    const { data: authData, error: authError } = await supabase.auth.signUp({ 
      email, 
      password, 
      options: { data: { full_name: fullName } }, 
    }); 

    if (authError) { 
      setError(authError.message); 
      setLoading(false); 
      return; 
    } 

    // 2. Insertar perfil con el ROL SELECCIONADO 
    if (authData.user) { 
        const { error: profileError } = await supabase 
            .from('profiles') 
            .insert([ 
                { 
                    id: authData.user.id, 
                    full_name: fullName, 
                    email: email, 
                    tech_path: techPath, // <--- AQUÍ USAMOS LA SELECCIÓN 
                    bio: bio, 
                    is_verified: false 
                } 
            ]); 
        
        if (profileError) { 
            console.error("Error creating profile:", profileError); 
        } 
    } 

    router.push("/dashboard"); 
    router.refresh(); 
  };

  return ( 
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4"> 
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-slate-100"> 
        <Link href="/" className="text-sm text-slate-500 hover:text-blue-600 flex items-center gap-1 mb-6"> 
          <ArrowLeft size={16} /> Volver al inicio 
        </Link> 
        
        <div className="text-center mb-8"> 
          <h1 className="text-2xl font-bold text-slate-900">Crear Perfil</h1> 
          <p className="text-slate-500">Elige tu especialidad y regístrate</p> 
        </div> 

        {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4 border border-red-100">{error}</div>} 

        <form onSubmit={handleSignUp} className="space-y-4"> 
          {/* Nombre */} 
          <div> 
            <label className="text-sm font-medium text-slate-700">Nombre Completo</label> 
            <div className="relative mt-1"> 
              <User className="absolute left-3 top-3 text-slate-400" size={18} /> 
              <input type="text" required value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" placeholder="Tu Nombre" /> 
            </div> 
          </div> 

          {/* Email */} 
          <div> 
            <label className="text-sm font-medium text-slate-700">Email</label> 
            <div className="relative mt-1"> 
              <Mail className="absolute left-3 top-3 text-slate-400" size={18} /> 
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" placeholder="tu@email.com" /> 
            </div> 
          </div> 

          {/* SELECTOR DE ÁREA (Lo importante) */} 
          <div> 
            <label className="text-sm font-medium text-slate-700">¿Cuál es tu área técnica?</label> 
            <div className="relative mt-1"> 
              <Briefcase className="absolute left-3 top-3 text-slate-400" size={18} /> 
              <select 
                value={techPath} 
                onChange={(e) => setTechPath(e.target.value)} 
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg outline-none bg-white focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer" 
              > 
                <option value="dev">Desarrollo de Software</option> 
                <option value="infra">Infraestructura / Redes</option> 
                <option value="cyber">Ciberseguridad</option> 
                <option value="data">Data Science & IA</option> 
                <option value="qa">QA & Testing</option> 
                <option value="design">Diseño UX/UI</option> 
              </select> 
              <div className="absolute right-3 top-3 pointer-events-none text-slate-400">▼</div> 
            </div> 
          </div> 

          {/* Bio */} 
          <div> 
            <label className="text-sm font-medium text-slate-700">Habilidades Clave / Bio</label> 
            <div className="relative mt-1"> 
              <FileText className="absolute left-3 top-3 text-slate-400" size={18} /> 
              <textarea required value={bio} onChange={(e) => setBio(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg outline-none min-h-[80px] focus:ring-2 focus:ring-blue-500" placeholder="Ej: CCNA, AWS, React, Python..." /> 
            </div> 
          </div> 

          {/* Password */} 
          <div> 
            <label className="text-sm font-medium text-slate-700">Contraseña</label> 
            <div className="relative mt-1"> 
              <Lock className="absolute left-3 top-3 text-slate-400" size={18} /> 
              <input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" placeholder="Mínimo 6 caracteres" /> 
            </div> 
          </div> 

          <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-all flex justify-center items-center gap-2 disabled:opacity-70"> 
            {loading ? <Loader2 className="animate-spin" /> : "Crear Cuenta"} 
          </button> 
        </form> 
        
        <p className="mt-6 text-center text-sm text-slate-600"> 
          ¿Ya tienes cuenta? <Link href="/auth/signin" className="text-blue-600 font-medium hover:underline">Inicia Sesión</Link> 
        </p> 
      </div> 
    </div> 
  ); 
}

"use client"; 

import { useState } from "react"; 
import { createClient } from "@/utils/supabase/client"; 
import { useRouter } from "next/navigation"; 
import Link from "next/link"; 
import { Lock, Mail, ArrowLeft, Loader2 } from "lucide-react"; 

export default function SignIn() { 
  const [email, setEmail] = useState(""); 
  const [password, setPassword] = useState(""); 
  const [loading, setLoading] = useState(false); 
  const [error, setError] = useState<string | null>(null); 
  const router = useRouter(); 
  const supabase = createClient(); 

  const handleLogin = async (e: React.FormEvent) => { 
    e.preventDefault(); 
    setLoading(true); 
    setError(null); 

    const { error } = await supabase.auth.signInWithPassword({ 
      email, 
      password, 
    }); 

    if (error) { 
      setError(error.message); 
      setLoading(false); 
    } else { 
      router.push("/dashboard"); 
      router.refresh(); 
    } 
  }; 

  return ( 
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4"> 
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-slate-100"> 
        <Link href="/" className="text-sm text-slate-500 hover:text-blue-600 flex items-center gap-1 mb-6"> 
          <ArrowLeft size={16} /> Volver al inicio 
        </Link> 
        
        <div className="text-center mb-8"> 
          <h1 className="text-2xl font-bold text-slate-900">Bienvenido de nuevo</h1> 
          <p className="text-slate-500">Accede a tu cuenta de FirstCommit</p> 
        </div> 

        {error && ( 
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4 border border-red-100"> 
            {error} 
          </div> 
        )} 

        <form onSubmit={handleLogin} className="space-y-4"> 
          <div> 
            <label className="text-sm font-medium text-slate-700">Email</label> 
            <div className="relative mt-1"> 
              <Mail className="absolute left-3 top-3 text-slate-400" size={18} /> 
              <input 
                type="email" 
                required 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                placeholder="nombre@ejemplo.com" 
              /> 
            </div> 
          </div> 

          <div> 
            <label className="text-sm font-medium text-slate-700">Contraseña</label> 
            <div className="relative mt-1"> 
              <Lock className="absolute left-3 top-3 text-slate-400" size={18} /> 
              <input 
                type="password" 
                required 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                placeholder="••••••••" 
              /> 
            </div> 
          </div> 

          <button 
            type="submit" 
            disabled={loading} 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-all flex justify-center items-center gap-2 disabled:opacity-70" 
          > 
            {loading && <Loader2 className="animate-spin" size={20} />} 
            {loading ? "Entrando..." : "Iniciar Sesión"} 
          </button> 
        </form> 

        <p className="mt-6 text-center text-sm text-slate-600"> 
          ¿No tienes cuenta?{" "} 
          <Link href="/auth/signup" className="text-blue-600 font-medium hover:underline"> 
            Regístrate gratis 
          </Link> 
        </p> 
      </div> 
    </div> 
  ); 
 }
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Code2, Users, CheckCircle2 } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex flex-col">
      {/* Navbar Simple */}
      <nav className="p-6 flex justify-between items-center max-w-7xl mx-auto w-full">
        <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
          FirstCommit
        </div>
        <div className="flex gap-4">
          <Link href="/auth/signin">
            <Button variant="ghost">Entrar</Button>
          </Link>
          <Link href="/talent">
            <Button variant="outline">Ver Talento</Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section - La parte principal */}
      <div className="flex-1 flex flex-col justify-center items-center text-center px-4 py-20">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-700 text-sm font-medium mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
          </span>
          La plataforma para Juniors verificados
        </div>

        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-slate-900 mb-6 max-w-4xl">
          Demuestra lo que sabes, <br />
          <span className="text-blue-600">consigue el empleo.</span>
        </h1>

        <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
          Olvídate de los CVs vacíos. En FirstCommit, validamos tus habilidades técnicas con pruebas reales para que las empresas vean tu verdadero potencial.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
          <Link href="/auth/signup">
            <Button size="lg" className="h-14 px-8 text-lg gap-2 bg-blue-600 hover:bg-blue-700 shadow-xl shadow-blue-200">
              Soy Candidato <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
          <Link href="/talent">
            <Button size="lg" variant="outline" className="h-14 px-8 text-lg gap-2 border-slate-300">
              Soy Empresa / Recruiter <Users className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Features - Iconos informativos */}
      <div className="bg-white py-24 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-12">
          <div className="flex flex-col gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
              <Code2 className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold">Pruebas Técnicas</h3>
            <p className="text-slate-600">Terminal Linux real y retos de código para validar tus conocimientos.</p>
          </div>
          <div className="flex flex-col gap-4">
            <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center text-green-600">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold">Verificación Real</h3>
            <p className="text-slate-600">Gana insignias verificadas que demuestran que sabes hacer el trabajo.</p>
          </div>
          <div className="flex flex-col gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold">Visibilidad Directa</h3>
            <p className="text-slate-600">Tu perfil destaca ante los reclutadores gracias a tus resultados.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
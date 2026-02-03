import Link from "next/link";
import { Button } from "@/components/ui/button";
import { 
  ArrowRight, 
  Terminal, 
  ShieldCheck, 
  Code2, 
  Users, 
  Building2, 
  Cpu, 
  Globe, 
  Server, 
  XCircle, 
  CheckCircle2, 
  Search,
  FileText,
  Briefcase
} from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-blue-500/30">
      
      {/* --- Navbar --- */}
      <nav className="fixed top-0 w-full z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          <div className="flex items-center gap-2 group cursor-pointer">
            <div className="bg-blue-600/10 border border-blue-500/50 p-2 rounded-lg group-hover:bg-blue-600/20 transition-all duration-300">
              <Terminal className="text-blue-500 w-5 h-5 group-hover:scale-110 transition-transform" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-100 font-mono">First<span className="text-blue-500">Commit</span></span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/auth/signin">
              <Button variant="ghost" className="text-slate-400 hover:text-white hover:bg-white/5 font-medium font-mono">
                Login
              </Button>
            </Link>
            <Link href="/talent">
              <Button variant="outline" className="hidden sm:flex border-slate-700 text-slate-300 hover:border-blue-500/50 hover:text-blue-400 hover:bg-blue-500/10 font-mono">
                For Recruiters
              </Button>
            </Link>
            <Link href="/auth/signup">
              <Button className="bg-blue-600 hover:bg-blue-500 text-white font-medium px-6 font-mono border border-blue-400/20 shadow-[0_0_15px_rgba(37,99,235,0.3)] hover:shadow-[0_0_25px_rgba(37,99,235,0.5)] transition-all">
                Get Started_
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* --- Hero Section --- */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-blue-500/20 rounded-full blur-[100px] opacity-30 mix-blend-screen"></div>
          <div className="absolute bottom-0 right-0 w-[800px] h-[600px] bg-purple-500/10 rounded-full blur-[100px] opacity-20 mix-blend-screen"></div>
          {/* Grid Pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-mono tracking-wide uppercase mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse shadow-[0_0_10px_rgba(59,130,246,0.5)]"></span>
            System Online: v2.0.4
          </div>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white mb-8 max-w-5xl mx-auto leading-[1.1]">
            Talent is not read. <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-500 to-purple-500 font-mono">It's compiled.</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-400 mb-12 max-w-3xl mx-auto leading-relaxed font-light">
            FirstCommit is where engineers, data scientists, and hackers <span className="text-slate-200 font-medium border-b border-blue-500/50">verify their skills</span> with real terminal challenges to bypass the noise.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/auth/signup">
              <Button size="lg" className="h-16 px-10 text-lg gap-3 bg-white text-slate-950 hover:bg-blue-50 font-mono font-bold shadow-[0_0_20px_rgba(255,255,255,0.1)] rounded-xl transition-all hover:scale-105 group">
                <Terminal className="w-5 h-5 group-hover:text-blue-600 transition-colors" />
                Initialize Career
              </Button>
            </Link>
            <Link href="/talent">
              <Button size="lg" variant="outline" className="h-16 px-10 text-lg gap-2 border-slate-700 text-slate-300 hover:border-slate-500 hover:text-white bg-slate-900/50 backdrop-blur-sm rounded-xl transition-all font-mono">
                <Search className="w-5 h-5" />
                Search Database
              </Button>
            </Link>
          </div>

          {/* Terminal Preview */}
          <div className="mt-20 mx-auto max-w-4xl bg-slate-900 rounded-lg border border-slate-800 shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
            <div className="flex items-center gap-2 px-4 py-3 bg-slate-950 border-b border-slate-800">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
              </div>
              <div className="text-xs text-slate-500 font-mono ml-2">bash — 80x24</div>
            </div>
            <div className="p-6 text-left font-mono text-sm md:text-base">
              <div className="mb-2 text-slate-400">
                <span className="text-green-400">user@firstcommit:~$</span> ./verify-skills.sh --role=fullstack
              </div>
              <div className="mb-2 text-blue-400">
                [INFO] Initializing environment... <br/>
                [INFO] Loading React challenges... <br/>
                [INFO] Connecting to remote server...
              </div>
              <div className="mb-2 text-slate-300">
                <span className="text-green-500">✓</span> Backend Architecture <span className="text-slate-600">......</span> <span className="text-green-400">PASSED</span> <br/>
                <span className="text-green-500">✓</span> Database Optimization <span className="text-slate-600">.....</span> <span className="text-green-400">PASSED</span> <br/>
                <span className="text-green-500">✓</span> System Design <span className="text-slate-600">.............</span> <span className="text-green-400">PASSED</span>
              </div>
              <div className="mt-4 animate-pulse text-slate-500">
                <span className="text-green-400">user@firstcommit:~$</span> <span className="inline-block w-2 h-4 bg-slate-500 align-middle"></span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- Social Proof (Trust Bar) --- */}
      <section className="py-12 border-y border-slate-900 bg-slate-950/50">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-center text-xs font-mono text-slate-500 uppercase tracking-widest mb-8">
            Trusted by engineering teams at
          </p>
          <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20 opacity-40 hover:opacity-80 transition-all duration-500 grayscale hover:grayscale-0">
            <div className="flex items-center gap-2 font-bold text-xl text-slate-300"><Building2 className="w-6 h-6" /> TechCorp</div>
            <div className="flex items-center gap-2 font-bold text-xl text-slate-300"><Cpu className="w-6 h-6" /> DataSystems</div>
            <div className="flex items-center gap-2 font-bold text-xl text-slate-300"><Globe className="w-6 h-6" /> GlobalNet</div>
            <div className="flex items-center gap-2 font-bold text-xl text-slate-300"><Server className="w-6 h-6" /> CloudScale</div>
          </div>
        </div>
      </section>

      {/* --- Problem vs Solution --- */}
      <section className="py-24 md:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-24 items-center">
            
            {/* Left: The Problem */}
            <div className="relative p-10 rounded-3xl bg-slate-50 border border-slate-100 overflow-hidden group">
              <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-red-100 rounded-full blur-3xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
              <div className="relative z-10">
                <div className="w-12 h-12 bg-red-100 text-red-600 rounded-xl flex items-center justify-center mb-6">
                  <XCircle className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">Contratación Tradicional</h3>
                <p className="text-slate-600 mb-6 leading-relaxed">
                  Cientos de CVs sin verificar, entrevistas técnicas interminables, candidatos que no cumplen lo que prometen y procesos lentos y costosos.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3 text-slate-500">
                    <FileText className="w-5 h-5 text-red-400" /> CVs inflados y poco fiables
                  </li>
                  <li className="flex items-center gap-3 text-slate-500">
                    <Search className="w-5 h-5 text-red-400" /> Filtrado manual y subjetivo
                  </li>
                  <li className="flex items-center gap-3 text-slate-500">
                    <AlertCircleIcon className="w-5 h-5 text-red-400" /> Alta rotación por mala selección
                  </li>
                </ul>
              </div>
            </div>

            {/* Right: The Solution */}
            <div className="relative p-10 rounded-3xl bg-slate-900 text-white shadow-2xl overflow-hidden group transform md:scale-105 transition-transform">
              <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-60 h-60 bg-blue-600 rounded-full blur-3xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
              <div className="absolute top-0 right-0 w-full h-full bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:20px_20px]"></div>
              
              <div className="relative z-10">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-blue-900/50">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold mb-4">La Manera FirstCommit</h3>
                <p className="text-slate-300 mb-6 leading-relaxed">
                  Acceso directo a talento pre-verificado. Nuestros candidatos han superado pruebas técnicas reales en entorno de terminal y código.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3 text-slate-200">
                    <CheckCircle2 className="w-5 h-5 text-green-400" /> <span className="font-medium">Habilidades validadas con código</span>
                  </li>
                  <li className="flex items-center gap-3 text-slate-200">
                    <Terminal className="w-5 h-5 text-blue-400" /> <span className="font-medium">Pruebas en entornos reales</span>
                  </li>
                  <li className="flex items-center gap-3 text-slate-200">
                    <Briefcase className="w-5 h-5 text-purple-400" /> <span className="font-medium">Match instantáneo con talento listo</span>
                  </li>
                </ul>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* --- How It Works --- */}
      <section className="py-24 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Tu camino hacia la próxima gran oportunidad</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Un proceso simple, transparente y basado puramente en el mérito.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connector Line (Desktop) */}
            <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-slate-200 -z-10"></div>

            {/* Step 1 */}
            <div className="flex flex-col items-center text-center group">
              <div className="w-24 h-24 bg-white border border-slate-200 rounded-2xl shadow-sm flex items-center justify-center mb-6 group-hover:border-blue-500 group-hover:shadow-blue-100 transition-all duration-300">
                <Users className="w-10 h-10 text-slate-400 group-hover:text-blue-600 transition-colors" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">1. Regístrate y Elige tu Ruta</h3>
              <p className="text-slate-600 px-4">
                Crea tu perfil y selecciona tu especialidad: Dev, Infraestructura, Data o Ciberseguridad.
              </p>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center text-center group">
              <div className="w-24 h-24 bg-white border border-slate-200 rounded-2xl shadow-sm flex items-center justify-center mb-6 group-hover:border-blue-500 group-hover:shadow-blue-100 transition-all duration-300 relative">
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-600 rounded-full text-white text-xs flex items-center justify-center font-bold">
                  &lt;/&gt;
                </div>
                <Terminal className="w-10 h-10 text-slate-400 group-hover:text-blue-600 transition-colors" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">2. Supera el Desafío</h3>
              <p className="text-slate-600 px-4">
                Completa pruebas técnicas interactivas. Desde terminales Linux reales hasta retos de algoritmos.
              </p>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center text-center group">
              <div className="w-24 h-24 bg-white border border-slate-200 rounded-2xl shadow-sm flex items-center justify-center mb-6 group-hover:border-blue-500 group-hover:shadow-blue-100 transition-all duration-300">
                <ShieldCheck className="w-10 h-10 text-slate-400 group-hover:text-blue-600 transition-colors" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">3. Obtén tu Insignia</h3>
              <p className="text-slate-600 px-4">
                Tu perfil verificado destaca automáticamente ante las empresas. Recibe ofertas basadas en tu talento.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- Footer --- */}
      <footer className="bg-white py-12 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="bg-slate-900 p-1 rounded">
              <Terminal className="text-white w-4 h-4" />
            </div>
            <span className="font-bold text-slate-900">FirstCommit</span>
          </div>
          <p className="text-slate-500 text-sm">
            © 2024 FirstCommit. Construyendo el futuro del recruiting técnico.
          </p>
          <div className="flex gap-6 text-sm font-medium text-slate-600">
            <Link href="#" className="hover:text-blue-600">Términos</Link>
            <Link href="#" className="hover:text-blue-600">Privacidad</Link>
            <Link href="#" className="hover:text-blue-600">Contacto</Link>
          </div>
        </div>
      </footer>

    </main>
  );
}

function AlertCircleIcon({ className }: { className?: string }) {
    return (
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="24" 
        height="24" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className={className}
      >
        <circle cx="12" cy="12" r="10" />
        <line x1="12" x2="12" y1="8" y2="12" />
        <line x1="12" x2="12.01" y1="16" y2="16" />
      </svg>
    )
}

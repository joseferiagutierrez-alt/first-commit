import { Terminal, Code2, Cpu, Globe } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen w-full lg:grid lg:grid-cols-2 bg-slate-50">
      
      {/* --- Left Side: Form Area --- */}
      <div className="flex items-center justify-center p-8 relative">
        {/* Mobile Background decoration */}
        <div className="absolute inset-0 bg-grid-slate-200 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] lg:hidden -z-10"></div>
        
        <div className="w-full max-w-md relative z-10">
            {children}
        </div>
      </div>

      {/* --- Right Side: Tech Visuals (Desktop Only) --- */}
      <div className="hidden lg:flex flex-col justify-center items-center bg-slate-950 relative overflow-hidden p-12 text-slate-400">
        
        {/* Background Code Pattern */}
        <div className="absolute inset-0 opacity-10 font-mono text-xs leading-4 pointer-events-none select-none p-4 overflow-hidden">
            {Array.from({ length: 40 }).map((_, i) => (
                <div key={i} className="whitespace-nowrap">
                    <span className="text-blue-500">const</span> <span className="text-yellow-400">candidate_{i}</span> = <span className="text-purple-400">new</span> <span className="text-green-400">Talent</span>({`{ verified: true, skills: ['TS', 'Rust', 'K8s'] }`});
                </div>
            ))}
            {Array.from({ length: 40 }).map((_, i) => (
                <div key={`cmd-${i}`} className="whitespace-nowrap mt-2">
                    <span className="text-green-500">sysadmin@server:~$</span> deploy --target=production --verified-only --force
                </div>
            ))}
        </div>

        {/* Floating Elements */}
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-500/20 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px]"></div>

        {/* Central Content */}
        <div className="relative z-10 bg-slate-900/50 backdrop-blur-xl border border-slate-800 p-10 rounded-3xl shadow-2xl max-w-lg">
            <div className="flex gap-4 mb-6">
                <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
            </div>
            
            <div className="space-y-6 font-mono text-sm">
                <div className="flex items-start gap-4 animate-in slide-in-from-left-4 duration-700 delay-100">
                    <div className="mt-1 p-2 bg-blue-500/10 rounded-lg text-blue-400 border border-blue-500/20">
                        <Code2 size={20} />
                    </div>
                    <div>
                        <h3 className="text-slate-200 font-bold mb-1">Dev & Engineering</h3>
                        <p className="text-slate-500">git commit -m "Proven skills"</p>
                    </div>
                </div>

                <div className="flex items-start gap-4 animate-in slide-in-from-left-4 duration-700 delay-200">
                    <div className="mt-1 p-2 bg-green-500/10 rounded-lg text-green-400 border border-green-500/20">
                        <Terminal size={20} />
                    </div>
                    <div>
                        <h3 className="text-slate-200 font-bold mb-1">Infrastructure</h3>
                        <p className="text-slate-500">kubectl apply -f verified-talent.yaml</p>
                    </div>
                </div>

                <div className="flex items-start gap-4 animate-in slide-in-from-left-4 duration-700 delay-300">
                    <div className="mt-1 p-2 bg-purple-500/10 rounded-lg text-purple-400 border border-purple-500/20">
                        <Cpu size={20} />
                    </div>
                    <div>
                        <h3 className="text-slate-200 font-bold mb-1">Data & AI</h3>
                        <p className="text-slate-500">model.predict(talent_success_rate) // 99.9%</p>
                    </div>
                </div>
            </div>

            <div className="mt-10 pt-8 border-t border-slate-800 text-center">
                <p className="text-slate-400 text-xs uppercase tracking-widest mb-2">Plataforma verificada por</p>
                <div className="flex justify-center gap-6 opacity-50 grayscale">
                   <Globe size={20} />
                   <Code2 size={20} />
                   <Terminal size={20} />
                </div>
            </div>
        </div>

      </div>
    </div>
  )
}

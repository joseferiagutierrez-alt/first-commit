"use client";

import { useState } from "react";
import { 
  Code2, 
  Server, 
  Database, 
  Palette, 
  ShieldCheck, 
  Bug, 
  ArrowRight,
  Terminal,
  Cpu,
  Layers
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

type TechPath = 'dev' | 'infra' | 'data' | 'design' | 'cyber' | 'qa';

interface PathOption {
  id: TechPath;
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
  borderColor: string;
  bgGradient: string;
}

const paths: PathOption[] = [
  {
    id: 'dev',
    title: 'Development',
    description: 'Frontend, Backend, Fullstack. El código es tu verdad.',
    icon: Code2,
    color: "text-blue-500",
    borderColor: "group-hover:border-blue-500",
    bgGradient: "group-hover:from-blue-500/5",
  },
  {
    id: 'infra',
    title: 'Infrastructure',
    description: 'Cloud, DevOps, SysAdmin. Mantén las luces encendidas.',
    icon: Server,
    color: "text-green-500",
    borderColor: "group-hover:border-green-500",
    bgGradient: "group-hover:from-green-500/5",
  },
  {
    id: 'data',
    title: 'Data & AI',
    description: 'Data Science, Analytics, ML. Los datos no mienten.',
    icon: Database,
    color: "text-purple-500",
    borderColor: "group-hover:border-purple-500",
    bgGradient: "group-hover:from-purple-500/5",
  },
  {
    id: 'design',
    title: 'Design/Product',
    description: 'UI/UX, Product Design. Donde la forma sigue a la función.',
    icon: Palette,
    color: "text-pink-500",
    borderColor: "group-hover:border-pink-500",
    bgGradient: "group-hover:from-pink-500/5",
  },
  {
    id: 'cyber',
    title: 'Cybersecurity',
    description: 'Red Team, Blue Team. Protege el sistema.',
    icon: ShieldCheck,
    color: "text-red-500",
    borderColor: "group-hover:border-red-500",
    bgGradient: "group-hover:from-red-500/5",
  },
  {
    id: 'qa',
    title: 'QA/Testing',
    description: 'Automation, SDET. La calidad no es negociable.',
    icon: Bug,
    color: "text-amber-500",
    borderColor: "group-hover:border-amber-500",
    bgGradient: "group-hover:from-amber-500/5",
  },
];

export default function OnboardingPage() {
  const [selectedPath, setSelectedPath] = useState<TechPath | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleSelectPath = async (pathId: TechPath) => {
    setSelectedPath(pathId);
    setLoading(true);

    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
        // Update profile directly
        await supabase
            .from('profiles')
            .update({ tech_path: pathId })
            .eq('id', user.id);
        
        router.push('/dashboard');
        router.refresh();
    } else {
        // Fallback if session issue
        setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header Minimalista */}
      <header className="px-6 py-6 flex justify-between items-center max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-2 font-bold text-slate-900">
            <div className="bg-slate-900 text-white p-1.5 rounded-md">
                <Terminal size={18} />
            </div>
            FirstCommit
        </div>
        <div className="text-sm text-slate-500 font-mono">Setup_Wizard v1.0</div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-6 max-w-7xl mx-auto w-full">
        
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-mono mb-2">
                <Cpu size={14} />
                <span>SELECT_PLAYER_CLASS</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">Elige tu Camino Técnico</h1>
            <p className="text-lg text-slate-600">
                Tu perfil, pruebas y ofertas de trabajo se adaptarán a la especialidad que selecciones.
            </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
            {paths.map((path) => {
                const Icon = path.icon;
                const isSelected = selectedPath === path.id;
                
                return (
                    <button
                        key={path.id}
                        onClick={() => handleSelectPath(path.id)}
                        disabled={loading}
                        className={cn(
                            "group relative flex flex-col p-8 rounded-2xl border-2 text-left transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-white overflow-hidden",
                            path.borderColor,
                            isSelected ? `border-${path.color.split('-')[1]}-500 ring-2 ring-offset-2 ring-${path.color.split('-')[1]}-500` : "border-slate-100"
                        )}
                    >
                        {/* Background Gradient on Hover */}
                        <div className={cn(
                            "absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-300",
                            path.bgGradient,
                            "group-hover:opacity-100"
                        )} />

                        {/* Tech Icon Background Decoration */}
                        <Icon className={cn(
                            "absolute -right-6 -bottom-6 w-32 h-32 opacity-5 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-12",
                            path.color
                        )} />

                        <div className="relative z-10">
                            <div className={cn(
                                "w-14 h-14 rounded-xl flex items-center justify-center mb-6 transition-colors duration-300 bg-slate-50 group-hover:bg-white shadow-sm",
                                path.color
                            )}>
                                <Icon size={28} />
                            </div>
                            
                            <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-slate-900">
                                {path.title}
                            </h3>
                            <p className="text-slate-500 text-sm leading-relaxed mb-6 group-hover:text-slate-600">
                                {path.description}
                            </p>

                            <div className={cn(
                                "inline-flex items-center gap-2 text-sm font-bold opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0",
                                path.color
                            )}>
                                Seleccionar <ArrowRight size={16} />
                            </div>
                        </div>
                    </button>
                );
            })}
        </div>
      </main>
    </div>
  );
}

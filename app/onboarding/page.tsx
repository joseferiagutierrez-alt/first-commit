"use client";

import { useState } from "react";
import { 
  Code2, 
  Server, 
  Database, 
  Palette, 
  ShieldCheck, 
  Bug, 
  CheckCircle2, 
  ArrowRight,
  ArrowLeft,
  Github,
  Globe,
  Terminal,
  LayoutTemplate
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";

type TechPath = 'dev' | 'infra' | 'data' | 'design' | 'cyber' | 'qa';

interface PathOption {
  id: TechPath;
  title: string;
  description: string;
  icon: React.ElementType;
}

const paths: PathOption[] = [
  {
    id: 'dev',
    title: 'Development',
    description: 'Frontend, Backend, Fullstack. Show your code.',
    icon: Code2,
  },
  {
    id: 'infra',
    title: 'Infrastructure',
    description: 'Cloud, DevOps, SysAdmin. Show your labs.',
    icon: Server,
  },
  {
    id: 'data',
    title: 'Data & AI',
    description: 'Data Science, Analytics, ML. Show your insights.',
    icon: Database,
  },
  {
    id: 'design',
    title: 'Design/Product',
    description: 'UI/UX, Product Design. Show your portfolio.',
    icon: Palette,
  },
  {
    id: 'cyber',
    title: 'Cybersecurity',
    description: 'Pentesting, SecOps. Show your flags.',
    icon: ShieldCheck,
  },
  {
    id: 'qa',
    title: 'QA/Testing',
    description: 'Automation, Manual Testing. Show your quality.',
    icon: Bug,
  },
];

export default function OnboardingPage() {
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedPath, setSelectedPath] = useState<TechPath | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  
  // Step 2 Form State
  const [formData, setFormData] = useState({
    github_url: '',
    portfolio_url: '',
    tools_used: '', // Comma separated for UI
    platform_handles: '', // Comma separated for UI or specific format
    homelab_description: '',
  });

  const handleSave = async () => {
    if (!selectedPath) return;
    setIsSaving(true);
    
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        alert("You must be logged in to save your profile.");
        return;
      }

      // Prepare data based on schema.sql
      // Note: We are mapping form fields to the schema fields
      // tools_used is text[], so we split the string
      // platform_handles is jsonb, so we try to parse or create a simple object
      
      const toolsArray = formData.tools_used 
        ? formData.tools_used.split(',').map(t => t.trim()).filter(t => t.length > 0)
        : [];

      // For platform handles, parse "Key: Value" pairs
      // e.g. "HTB: user, THM: user" -> { "HTB": "user", "THM": "user" }
      const platformHandlesJson: Record<string, string> = {};
      if (formData.platform_handles) {
        const handles = formData.platform_handles.split(',');
        handles.forEach(h => {
          const [platform, handle] = h.split(':').map(s => s.trim());
          if (platform && handle) {
            platformHandlesJson[platform] = handle;
          } else if (platform) {
            // Fallback for single values or malformed input
            platformHandlesJson['raw'] = (platformHandlesJson['raw'] ? platformHandlesJson['raw'] + ', ' : '') + platform;
          }
        });
      }

      const updates = {
        id: user.id,
        tech_path: selectedPath,
        github_url: selectedPath === 'dev' ? formData.github_url : null,
        portfolio_url: ['design', 'data'].includes(selectedPath) ? formData.portfolio_url : null,
        tools_used: toolsArray.length > 0 ? toolsArray : null,
        platform_handles: Object.keys(platformHandlesJson).length > 0 ? platformHandlesJson : null,
        // Mapping homelab_description to bio for now as it's the closest text field in profiles
        // Or if we strictly follow schema, we might need to insert into portfolio_projects
        // But prompt said "insert into profiles". We'll use bio for simplicity.
        bio: selectedPath === 'infra' ? formData.homelab_description : null,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from('profiles')
        .upsert(updates);

      if (error) {
        throw error;
      }

      alert('Profile saved successfully!');
      // Navigate to dashboard
      router.push('/dashboard');
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Error saving profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleContinue = () => {
    if (step === 1 && selectedPath) {
      setStep(2);
    } else {
      handleSave();
    }
  };

  const handleBack = () => {
    setStep(1);
  };

  const renderStep2Content = () => {
    switch (selectedPath) {
      case 'dev':
        return (
          <div className="space-y-6">
            <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-800">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                GitHub Profile URL <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Github className="absolute left-3 top-3 text-gray-500" size={20} />
                <input 
                  type="url"
                  placeholder="https://github.com/username"
                  className="w-full bg-black border border-gray-700 rounded-lg py-3 pl-10 pr-4 text-white placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                  value={formData.github_url}
                  onChange={(e) => setFormData({...formData, github_url: e.target.value})}
                  required
                />
              </div>
              
              <label className="block text-sm font-medium text-gray-300 mt-6 mb-2">
                Languages (Multiselect)
              </label>
              <div className="relative">
                <Code2 className="absolute left-3 top-3 text-gray-500" size={20} />
                <input 
                  type="text"
                  placeholder="JavaScript, Python, Rust, Go..."
                  className="w-full bg-black border border-gray-700 rounded-lg py-3 pl-10 pr-4 text-white placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                  value={formData.tools_used}
                  onChange={(e) => setFormData({...formData, tools_used: e.target.value})}
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">Separate languages with commas.</p>
            </div>
          </div>
        );

      case 'infra':
        return (
          <div className="space-y-6">
             <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-800">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Certifications
              </label>
              <div className="relative">
                <ShieldCheck className="absolute left-3 top-3 text-gray-500" size={20} />
                <input 
                  type="text"
                  placeholder="CCNA, AWS Certified Solutions Architect, Azure..."
                  className="w-full bg-black border border-gray-700 rounded-lg py-3 pl-10 pr-4 text-white placeholder-gray-500 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition-all"
                  value={formData.tools_used} // Using tools_used for certs list for now
                  onChange={(e) => setFormData({...formData, tools_used: e.target.value})}
                />
              </div>

              <label className="block text-sm font-medium text-gray-300 mt-6 mb-2">
                Homelab Description
              </label>
              <div className="relative">
                <Server className="absolute left-3 top-3 text-gray-500" size={20} />
                <textarea 
                  placeholder="Tell us what you've built at home. e.g. Proxmox cluster, Pi-hole, Plex server..."
                  className="w-full bg-black border border-gray-700 rounded-lg py-3 pl-10 pr-4 text-white placeholder-gray-500 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition-all h-32"
                  value={formData.homelab_description}
                  onChange={(e) => setFormData({...formData, homelab_description: e.target.value})}
                />
              </div>
            </div>
          </div>
        );

      case 'design':
        return (
          <div className="space-y-6">
            <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-800">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Portfolio URL <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Globe className="absolute left-3 top-3 text-gray-500" size={20} />
                <input 
                  type="url"
                  placeholder="https://behance.net/username or https://dribbble.com/..."
                  className="w-full bg-black border border-gray-700 rounded-lg py-3 pl-10 pr-4 text-white placeholder-gray-500 focus:border-pink-500 focus:ring-1 focus:ring-pink-500 outline-none transition-all"
                  value={formData.portfolio_url}
                  onChange={(e) => setFormData({...formData, portfolio_url: e.target.value})}
                  required
                />
              </div>

              <label className="block text-sm font-medium text-gray-300 mt-6 mb-2">
                Design Tools
              </label>
              <div className="relative">
                <Palette className="absolute left-3 top-3 text-gray-500" size={20} />
                <input 
                  type="text"
                  placeholder="Figma, Sketch, Adobe XD, Framer..."
                  className="w-full bg-black border border-gray-700 rounded-lg py-3 pl-10 pr-4 text-white placeholder-gray-500 focus:border-pink-500 focus:ring-1 focus:ring-pink-500 outline-none transition-all"
                  value={formData.tools_used}
                  onChange={(e) => setFormData({...formData, tools_used: e.target.value})}
                />
              </div>
            </div>
          </div>
        );

      case 'data':
        return (
          <div className="space-y-6">
            <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-800">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Kaggle / Portfolio URL
              </label>
              <div className="relative">
                <Globe className="absolute left-3 top-3 text-gray-500" size={20} />
                <input 
                  type="url"
                  placeholder="https://kaggle.com/username"
                  className="w-full bg-black border border-gray-700 rounded-lg py-3 pl-10 pr-4 text-white placeholder-gray-500 focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none transition-all"
                  value={formData.portfolio_url}
                  onChange={(e) => setFormData({...formData, portfolio_url: e.target.value})}
                />
              </div>

              <label className="block text-sm font-medium text-gray-300 mt-6 mb-2">
                Data Tools (Multiselect)
              </label>
              <div className="relative">
                <Database className="absolute left-3 top-3 text-gray-500" size={20} />
                <input 
                  type="text"
                  placeholder="SQL, PowerBI, Tableau, Python, R..."
                  className="w-full bg-black border border-gray-700 rounded-lg py-3 pl-10 pr-4 text-white placeholder-gray-500 focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none transition-all"
                  value={formData.tools_used}
                  onChange={(e) => setFormData({...formData, tools_used: e.target.value})}
                />
              </div>
            </div>
          </div>
        );

      case 'cyber':
        return (
          <div className="space-y-6">
            <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-800">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Platform Handles
              </label>
              <div className="relative">
                <Terminal className="absolute left-3 top-3 text-gray-500" size={20} />
                <input 
                  type="text"
                  placeholder="HackTheBox: user, TryHackMe: user..."
                  className="w-full bg-black border border-gray-700 rounded-lg py-3 pl-10 pr-4 text-white placeholder-gray-500 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none transition-all"
                  value={formData.platform_handles}
                  onChange={(e) => setFormData({...formData, platform_handles: e.target.value})}
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">Format: Platform: Username (e.g., HTB: user1, THM: user2)</p>

              <label className="block text-sm font-medium text-gray-300 mt-6 mb-2">
                Specialty
              </label>
              <div className="relative">
                <ShieldCheck className="absolute left-3 top-3 text-gray-500" size={20} />
                <input 
                  type="text"
                  placeholder="Red Team, Blue Team, Auditing..."
                  className="w-full bg-black border border-gray-700 rounded-lg py-3 pl-10 pr-4 text-white placeholder-gray-500 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none transition-all"
                  value={formData.tools_used} // Mapping specialty to tools_used/skills array
                  onChange={(e) => setFormData({...formData, tools_used: e.target.value})}
                />
              </div>
            </div>
          </div>
        );

      case 'qa':
        return (
          <div className="space-y-6">
            <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-800">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Testing Tools
              </label>
              <div className="relative">
                <Bug className="absolute left-3 top-3 text-gray-500" size={20} />
                <input 
                  type="text"
                  placeholder="Selenium, Cypress, Jest, Playwright..."
                  className="w-full bg-black border border-gray-700 rounded-lg py-3 pl-10 pr-4 text-white placeholder-gray-500 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 outline-none transition-all"
                  value={formData.tools_used}
                  onChange={(e) => setFormData({...formData, tools_used: e.target.value})}
                />
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-6 flex flex-col items-center justify-center">
      <div className="max-w-5xl w-full space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            {step === 1 ? "Choose Your Path" : `Setup your ${paths.find(p => p.id === selectedPath)?.title} Profile`}
          </h1>
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto">
            {step === 1 
              ? "Select your specialty to customize your validation experience." 
              : "Tell us a bit more about your tools and experience."}
          </p>
        </div>

        {/* Step 1: Path Selection */}
        {step === 1 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mt-8">
            {paths.map((path) => {
              const isSelected = selectedPath === path.id;
              const Icon = path.icon;
              
              return (
                <button
                  key={path.id}
                  onClick={() => setSelectedPath(path.id)}
                  className={`
                    relative group p-6 rounded-xl border-2 text-left transition-all duration-300
                    hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-black
                    ${isSelected 
                      ? 'border-blue-500 bg-blue-500/10 shadow-[0_0_20px_rgba(59,130,246,0.3)]' 
                      : 'border-gray-800 bg-gray-900/50 hover:border-gray-600 hover:bg-gray-800/50'
                    }
                  `}
                >
                  <div className={`
                    p-3 rounded-lg w-fit mb-4 transition-colors
                    ${isSelected ? 'bg-blue-500 text-white' : 'bg-gray-800 text-gray-400 group-hover:text-white group-hover:bg-gray-700'}
                  `}>
                    <Icon size={28} />
                  </div>
                  
                  <h3 className={`text-xl font-semibold mb-2 ${isSelected ? 'text-white' : 'text-gray-200'}`}>
                    {path.title}
                  </h3>
                  
                  <p className="text-sm text-gray-400 leading-relaxed">
                    {path.description}
                  </p>

                  {isSelected && (
                    <div className="absolute top-4 right-4 text-blue-500">
                      <CheckCircle2 size={24} />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* Step 2: Dynamic Form */}
        {step === 2 && (
          <div className="max-w-2xl mx-auto w-full mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {renderStep2Content()}
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-center pt-8 gap-4">
          {step === 2 && (
             <button
             onClick={handleBack}
             disabled={isSaving}
             className="flex items-center gap-2 px-8 py-3 rounded-full font-semibold text-lg bg-gray-900 text-white hover:bg-gray-800 border border-gray-700 transition-all duration-300"
           >
             <ArrowLeft size={20} />
             Back
           </button>
          )}

          <button
            onClick={handleContinue}
            disabled={(!selectedPath) || isSaving}
            className={`
              flex items-center gap-2 px-8 py-3 rounded-full font-semibold text-lg transition-all duration-300
              ${selectedPath 
                ? 'bg-white text-black hover:bg-gray-200 translate-y-0 opacity-100 cursor-pointer' 
                : 'bg-gray-800 text-gray-500 translate-y-2 opacity-50 cursor-not-allowed'
              }
            `}
          >
            {isSaving ? 'Saving...' : (step === 1 ? 'Continue' : 'Finish Profile')}
            {!isSaving && <ArrowRight size={20} />}
          </button>
        </div>
      </div>
    </div>
  );
}

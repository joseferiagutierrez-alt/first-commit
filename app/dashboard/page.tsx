"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
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
  Bell,
  Eye
} from "lucide-react";
import Link from "next/link";

// Types matching database
type TechPath = 'dev' | 'infra' | 'data' | 'design' | 'cyber' | 'qa';

interface Profile {
  id: string;
  full_name: string;
  tech_path: TechPath;
  xp_level: string;
  github_url: string | null;
  linkedin_url: string | null;
  portfolio_url: string | null;
  bio: string | null;
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
  const [profile, setProfile] = useState<Profile | null>(null);
  const [profileViews, setProfileViews] = useState<{company_name: string, viewed_at: string}[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        if (data && !error) {
          setProfile(data as Profile);
        }

        // Fetch profile views
        const { data: views } = await supabase
          .from('profile_views')
          .select('company_name, viewed_at')
          .eq('candidate_id', user.id)
          .order('viewed_at', { ascending: false })
          .limit(5);
          
        if (views) {
          setProfileViews(views);
        }
      }
      setLoading(false);
    };

    fetchProfile();
  }, []);

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

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="h-8 w-8 bg-gradient-to-tr from-blue-500 to-purple-500 rounded-lg flex items-center justify-center font-bold">
              FC
            </div>
            <h1 className="text-xl font-semibold">Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/talent" className="hidden md:block text-sm text-gray-400 hover:text-white transition-colors">
              For Companies
            </Link>
            <span className="text-gray-400 text-sm hidden sm:block">Welcome back, {profile.full_name || 'Candidate'}</span>
            <div className="relative">
              <div className="h-8 w-8 bg-gray-700 rounded-full flex items-center justify-center text-sm font-medium">
                {(profile.full_name?.[0] || 'U').toUpperCase()}
              </div>
              {profile.is_verified && (
                <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5">
                  <CheckCircle2 size={12} className="text-blue-500 fill-blue-500/20" />
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold mb-2 flex items-center gap-3">
              Hello, {profile.full_name?.split(' ')[0] || 'There'}! 👋
              {profile.is_verified && (
                <span className="bg-blue-500/10 text-blue-400 border border-blue-500/50 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                  <CheckCircle2 size={12} />
                  SKILL VERIFIED
                </span>
              )}
            </h2>
            <p className="text-gray-400">Let's get you job-ready.</p>
          </div>
          <div className="flex items-center gap-3">
            {!profile.is_verified && (
              <Link href="/tests">
                <button className="bg-white text-black px-6 py-2 rounded-full font-bold hover:bg-gray-200 transition-colors">
                  Take Diagnostic Test
                </button>
              </Link>
            )}
            {getPathBadge(profile.tech_path)}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Roadmap & Status */}
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

            {/* Job Feed */}
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold flex items-center gap-2">
                  <Briefcase className="text-purple-500" size={20} />
                  Recommended Jobs
                </h3>
                <Link href="/jobs" className="text-sm text-blue-400 hover:underline">View all</Link>
              </div>
              
              <div className="space-y-4">
                {relevantJobs.length > 0 ? (
                  relevantJobs.map(job => (
                    <div key={job.id} className="bg-black/40 border border-gray-800 rounded-lg p-4 hover:border-gray-700 transition-colors flex items-center justify-between group">
                      <div>
                        <h4 className="font-semibold text-lg group-hover:text-blue-400 transition-colors">{job.title}</h4>
                        <p className="text-gray-400 text-sm">{job.company} • {job.type}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-green-400">{job.salary}</p>
                        <span className="text-xs text-gray-500">Just now</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-4">No specific jobs found for your path yet.</p>
                )}
              </div>
            </div>

          </div>

          {/* Right Column: Profile Status */}
          <div className="space-y-8">
            
            {/* Recent Activity / Notifications */}
            {profileViews.length > 0 && (
              <div className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 border border-purple-500/20 rounded-xl p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-3 opacity-10">
                  <Bell size={80} />
                </div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-white">
                  <Bell className="text-purple-400" size={18} />
                  Recent Activity
                </h3>
                <div className="space-y-4 relative z-10">
                  {profileViews.map((view, i) => (
                    <div key={i} className="flex items-start gap-3 bg-black/40 p-3 rounded-lg border border-white/5">
                      <div className="mt-1 bg-purple-500/20 p-1.5 rounded-full text-purple-300">
                        <Eye size={14} />
                      </div>
                      <div>
                        <p className="text-sm text-gray-200">
                          ¡Genial! <span className="font-bold text-white">{view.company_name}</span> ha consultado tu perfil verificado.
                        </p>
                        <span className="text-xs text-gray-500 mt-1 block">
                          {new Date(view.viewed_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
              <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <TrendingUp className="text-green-500" size={20} />
                Profile Status
              </h3>
              
              <div className="mb-2 flex justify-between items-end">
                <span className="text-gray-400 text-sm">Ready for Companies</span>
                <span className="text-2xl font-bold">{progress}%</span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-3 mb-6">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all duration-1000"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm text-gray-300">
                  <CheckCircle2 size={16} className="text-green-500" />
                  <span>Account Created</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-300">
                  <CheckCircle2 size={16} className="text-green-500" />
                  <span>Tech Path Selected</span>
                </div>
                <div className={`flex items-center gap-3 text-sm ${profile.bio ? 'text-gray-300' : 'text-gray-500'}`}>
                  <CheckCircle2 size={16} className={profile.bio ? "text-green-500" : "text-gray-700"} />
                  <span>Bio / Description</span>
                </div>
                <div className={`flex items-center gap-3 text-sm ${profile.linkedin_url ? 'text-gray-300' : 'text-gray-500'}`}>
                  <CheckCircle2 size={16} className={profile.linkedin_url ? "text-green-500" : "text-gray-700"} />
                  <span>LinkedIn Connected</span>
                </div>
              </div>
              
              <button className="w-full mt-6 py-2 rounded-lg border border-gray-700 hover:bg-gray-800 transition-colors text-sm">
                Complete Profile
              </button>
            </div>

            {/* Quick Actions or Tip */}
            <div className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 border border-blue-500/20 rounded-xl p-6">
              <h4 className="font-semibold text-blue-400 mb-2">Pro Tip</h4>
              <p className="text-sm text-gray-400">
                Recruiters are 3x more likely to contact candidates with a verified portfolio project.
              </p>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

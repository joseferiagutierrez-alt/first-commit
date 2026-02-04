"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { 
  Search, 
  Filter, 
  CheckCircle2, 
  Mail, 
  Terminal, 
  Code2, 
  Database, 
  Palette, 
  ShieldCheck, 
  Bug, 
  Briefcase,
  ArrowRight,
  Bot,
  Sparkles,
  X,
  Loader2,
  BrainCircuit
} from "lucide-react";
import Link from "next/link";

type TechPath = 'dev' | 'infra' | 'data' | 'design' | 'cyber' | 'qa';

interface Profile {
  id: string;
  full_name: string;
  tech_path: TechPath;
  is_verified: boolean;
  bio: string | null;
  avatar_url: string | null;
  test_score?: string; 
}

const MOCK_CANDIDATES: Partial<Profile>[] = [
  { 
    id: 'mock-1', 
    full_name: 'Alex Rivera', 
    tech_path: 'infra', 
    is_verified: true, 
    bio: 'Linux enthusiast & Home Lab builder.', 
    test_score: 'Terminal Test: 100%' 
  },
  { 
    id: 'mock-2', 
    full_name: 'Sarah Chen', 
    tech_path: 'dev', 
    is_verified: true, 
    bio: 'Fullstack Dev | React & Node.js', 
    test_score: 'Logic Quiz: 5/5' 
  },
  { 
    id: 'mock-3', 
    full_name: 'Marcus Johnson', 
    tech_path: 'cyber', 
    is_verified: true, 
    bio: 'CTF Player & Pentester', 
    test_score: 'Terminal Test: 100%' 
  },
  { 
    id: 'mock-4', 
    full_name: 'Elena Popova', 
    tech_path: 'data', 
    is_verified: true, 
    bio: 'Data Analyst | SQL & Python', 
    test_score: 'Logic Quiz: 4/5' 
  },
];

export default function TalentPage() {
  const [candidates, setCandidates] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterPath, setFilterPath] = useState<TechPath | 'all'>('all');
  const [filterVerified, setFilterVerified] = useState(false);

  // AI Generator State
  const [showAiModal, setShowAiModal] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiStep, setAiStep] = useState(0); // 0: Input, 1: Generating, 2: Result
  const [generatedTest, setGeneratedTest] = useState<any>(null);
  const [activeAssessment, setActiveAssessment] = useState<any>(null);
  
  // AI Form State
  const [targetStack, setTargetStack] = useState("Full Stack Development (React/Node)");
  const [targetDifficulty, setTargetDifficulty] = useState("Senior (Architectural)");

  useEffect(() => {
    const initData = async () => {
      const supabase = createClient();
      
      // Fetch Candidates
      let { data: profilesData } = await supabase
        .from('profiles')
        .select('id, full_name, tech_path, bio, avatar_url');

      const profiles = profilesData?.map(profile => ({
        ...profile,
        is_verified: false
      })) || [];

      const realProfiles = profiles as Profile[];
      
      if (realProfiles.length < 4) {
        setCandidates([...realProfiles, ...(MOCK_CANDIDATES as Profile[])]);
      } else {
        setCandidates(realProfiles);
      }
      
      setLoading(false);

      // Fetch Active Assessment
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: assessments } = await supabase
          .from('company_assessments')
          .select('*')
          .eq('company_id', user.id)
          .eq('is_active', true)
          .order('created_at', { ascending: false })
          .limit(1);
        
        if (assessments && assessments.length > 0) {
          setActiveAssessment(assessments[0]);
        }
      }
    };

    initData();
  }, []);

  const getPathIcon = (path: TechPath) => {
    switch (path) {
      case 'infra': return <Terminal size={16} />;
      case 'dev': return <Code2 size={16} />;
      case 'data': return <Database size={16} />;
      case 'design': return <Palette size={16} />;
      case 'cyber': return <ShieldCheck size={16} />;
      case 'qa': return <Bug size={16} />;
      default: return <Briefcase size={16} />;
    }
  };

  const getPathColor = (path: TechPath) => {
    const colors = {
      dev: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
      infra: 'text-orange-400 bg-orange-500/10 border-orange-500/20',
      data: 'text-green-400 bg-green-500/10 border-green-500/20',
      design: 'text-pink-400 bg-pink-500/10 border-pink-500/20',
      cyber: 'text-red-400 bg-red-500/10 border-red-500/20',
      qa: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
    };
    return colors[path] || colors.dev;
  };

  const handleContact = async (candidateId: string, candidateName: string) => {
    try {
      const supabase = createClient();
      await supabase.from('profile_views').insert({
        candidate_id: candidateId,
        company_name: "Tech Recruiter",
        viewed_at: new Date().toISOString()
      });
    } catch (err) {
      console.error("Error tracking contact:", err);
    }
  };

  const handleGenerateAiTest = () => {
    setAiLoading(true);
    setAiStep(1);
    
    // Simulate AI Generation based on input
    setTimeout(() => {
        let title = "Custom Assessment";
        let questions = ["General coding question 1", "General coding question 2"];
        
        if (targetStack.includes("React")) {
            title = `Advanced React & System Design (${targetDifficulty.split(' ')[0]})`;
            questions = [
                "Explain the reconciliation process in React Fiber.",
                "Design a scalable notification system architecture.",
                "How would you handle race conditions in a distributed DB?"
            ];
        } else if (targetStack.includes("DevOps")) {
            title = `Cloud Infrastructure & CI/CD (${targetDifficulty.split(' ')[0]})`;
            questions = [
                "How do you secure a Kubernetes cluster?",
                "Write a Terraform module for an AWS VPC.",
                "Explain the difference between Blue/Green and Canary deployments."
            ];
        } else if (targetStack.includes("Cyber")) {
            title = `Penetration Testing & Security Auditing (${targetDifficulty.split(' ')[0]})`;
            questions = [
                "Describe how you would exploit a SQL Injection vulnerability.",
                "How do you mitigate XSS attacks in a modern web app?",
                "Explain the concept of Zero Trust Architecture."
            ];
        }

        setGeneratedTest({
            title,
            difficulty: targetDifficulty.split(' ')[0],
            questions,
            type: "Mixed (Quiz + Architecture)",
            tech_stack: targetStack
        });
        setAiLoading(false);
        setAiStep(2);
    }, 2500);
  };

  const handleDeployAssessment = async () => {
    if (!generatedTest) return;

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        alert("You must be logged in to deploy assessments.");
        return;
    }

    try {
        // Deactivate previous active assessments
        await supabase
            .from('company_assessments')
            .update({ is_active: false })
            .eq('company_id', user.id);

        // Insert new assessment
        const { data, error } = await supabase
            .from('company_assessments')
            .insert({
                company_id: user.id,
                title: generatedTest.title,
                tech_stack: generatedTest.tech_stack || "General",
                difficulty: generatedTest.difficulty,
                questions: generatedTest.questions,
                is_active: true
            })
            .select()
            .single();

        if (error) throw error;

        setActiveAssessment(data);
        setShowAiModal(false);
        alert("Assessment deployed successfully! It is now visible to candidates.");
    } catch (err: any) {
        console.error("Error deploying assessment:", err);
        alert("Failed to deploy assessment: " + err.message);
    }
  };

  const handleDeactivateAssessment = async () => {
     if (!activeAssessment) return;
     
     const supabase = createClient();
     try {
         await supabase
            .from('company_assessments')
            .update({ is_active: false })
            .eq('id', activeAssessment.id);
            
         setActiveAssessment(null);
     } catch (err) {
         console.error("Error deactivating:", err);
     }
  };

  const filteredCandidates = candidates.filter(c => {
    if (filterPath !== 'all' && c.tech_path !== filterPath) return false;
    if (filterVerified && !c.is_verified) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-6 font-sans selection:bg-blue-500/30">
      {/* Background Pattern */}
      <div className="fixed inset-0 -z-10 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-800 pb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Link href="/dashboard" className="p-2 hover:bg-slate-800 rounded-lg transition-colors group">
                <div className="h-10 w-10 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-lg flex items-center justify-center font-bold text-white shadow-lg group-hover:shadow-blue-500/20 transition-all">
                  FC
                </div>
              </Link>
              <h1 className="text-3xl font-bold tracking-tight text-white">Talent Database</h1>
            </div>
            <p className="text-slate-400 font-mono text-sm">
              <span className="text-green-500">✔</span> System ready. Accessing verified candidate pool...
            </p>
          </div>
          
          <div className="flex flex-wrap gap-3">
             <div className="relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors" size={16} />
                <input 
                  type="text" 
                  placeholder="query_by_name..." 
                  className="bg-slate-900 border border-slate-700 rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 w-full sm:w-64 font-mono text-sm transition-all placeholder:text-slate-600"
                />
             </div>
             <button className="flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg font-bold text-sm transition-all shadow-[0_0_15px_rgba(37,99,235,0.3)] hover:shadow-[0_0_25px_rgba(37,99,235,0.5)]">
               <Briefcase size={16} />
               Post_Job()
             </button>
          </div>
        </header>

        {/* Tools Section */}
        <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
             {/* AI Test Generator Card */}
             <div 
                onClick={() => setShowAiModal(true)}
                className="bg-gradient-to-br from-indigo-900/20 to-purple-900/20 border border-indigo-500/30 rounded-xl p-6 cursor-pointer hover:border-indigo-500/50 transition-all group relative overflow-hidden"
             >
                <div className="absolute top-0 right-0 p-3 opacity-20 group-hover:opacity-40 transition-opacity">
                    <BrainCircuit size={64} />
                </div>
                <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-indigo-500/20 text-indigo-400">
                        <Bot size={24} />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-indigo-100 flex items-center gap-2">
                            AI Assessment Generator
                            <span className="text-[10px] bg-indigo-500 text-white px-1.5 py-0.5 rounded-full">BETA</span>
                        </h3>
                        <p className="text-sm text-indigo-300/70 mt-1">
                            Create custom technical assessments tailored to your specific stack using our AI engine.
                        </p>
                    </div>
                </div>
             </div>
        </div>

        {/* Active Assessment Banner */}
        {activeAssessment && (
          <div className="mb-8 p-4 bg-indigo-500/10 border border-indigo-500/30 rounded-xl flex items-center justify-between animate-in fade-in slide-in-from-top-4">
             <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-400">
                   <ShieldCheck size={20} />
                </div>
                <div>
                   <h3 className="text-indigo-100 font-bold text-sm">Active Assessment: {activeAssessment.title}</h3>
                   <p className="text-indigo-400/70 text-xs">Target: {activeAssessment.difficulty} • Status: Live</p>
                </div>
             </div>
             <button 
               onClick={handleDeactivateAssessment}
               className="p-2 hover:bg-indigo-500/20 rounded-lg text-indigo-400 transition-colors"
               title="Deactivate Assessment"
             >
                <X size={16} />
             </button>
          </div>
        )}

        {/* Filters */}
        <div className="mb-8 flex flex-wrap items-center gap-4 p-4 bg-slate-900/50 border border-slate-800 rounded-xl backdrop-blur-sm">
          <div className="flex items-center gap-2 text-slate-400 mr-2 font-mono text-sm">
            <Filter size={16} className="text-blue-500" />
            <span>WHERE</span>
          </div>
          
          <div className="relative">
            <select 
              value={filterPath}
              onChange={(e) => setFilterPath(e.target.value as TechPath | 'all')}
              className="appearance-none bg-slate-950 border border-slate-700 text-slate-200 text-sm rounded-lg px-4 py-2 pr-8 focus:outline-none focus:border-blue-500 font-mono cursor-pointer hover:border-slate-600 transition-colors"
            >
              <option value="all">tech_path = *</option>
              <option value="dev">tech_path = 'dev'</option>
              <option value="infra">tech_path = 'infra'</option>
              <option value="cyber">tech_path = 'cyber'</option>
              <option value="data">tech_path = 'data'</option>
              <option value="design">tech_path = 'design'</option>
              <option value="qa">tech_path = 'qa'</option>
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
              <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[4px] border-t-slate-500"></div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-slate-400 font-mono text-sm mx-2">AND</div>

          <button 
            onClick={() => setFilterVerified(!filterVerified)}
            className={`
              flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-mono border transition-all
              ${filterVerified 
                ? 'bg-green-500/10 border-green-500/50 text-green-400 shadow-[0_0_10px_rgba(34,197,94,0.2)]' 
                : 'bg-slate-950 border-slate-700 text-slate-400 hover:border-slate-600'}
            `}
          >
            <div className={`w-3 h-3 rounded-full border ${filterVerified ? 'bg-green-500 border-green-500' : 'border-slate-500'}`}></div>
            is_verified = true
          </button>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="text-center py-20 text-slate-500 font-mono animate-pulse">Scanning database...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCandidates.map((candidate) => (
              <div key={candidate.id} className="bg-slate-900/40 border border-slate-800 rounded-xl p-6 hover:border-blue-500/30 hover:shadow-[0_0_20px_rgba(37,99,235,0.1)] transition-all group relative flex flex-col h-full backdrop-blur-sm overflow-hidden">
                
                {/* Tech Background Decor */}
                <div className="absolute -right-4 -top-4 w-24 h-24 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-full blur-2xl group-hover:from-blue-500/10 group-hover:to-purple-500/10 transition-all"></div>

                {/* Header: Avatar & Verified Badge */}
                <div className="flex justify-between items-start mb-5 relative z-10">
                  <div className="h-14 w-14 bg-slate-800 rounded-xl flex items-center justify-center text-xl font-bold border border-slate-700 text-slate-300 shadow-inner">
                    {candidate.full_name?.[0]?.toUpperCase() || 'U'}
                  </div>
                  {candidate.is_verified && (
                    <div className="flex flex-col items-end">
                        <span className="bg-green-500/10 text-green-400 border border-green-500/20 text-[10px] font-bold px-2 py-1 rounded flex items-center gap-1 shadow-[0_0_10px_rgba(34,197,94,0.2)] animate-pulse">
                        <CheckCircle2 size={10} />
                        VERIFIED
                        </span>
                        <span className="text-[9px] text-slate-500 font-mono mt-1">ID: {candidate.id.substring(0,6)}</span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="mb-5 flex-grow relative z-10">
                  <h3 className="text-lg font-bold text-slate-100 mb-2 group-hover:text-blue-400 transition-colors">
                    {candidate.full_name}
                  </h3>
                  
                  <div className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-md text-xs font-mono border mb-4 ${getPathColor(candidate.tech_path || 'dev')}`}>
                    {getPathIcon(candidate.tech_path || 'dev')}
                    <span className="uppercase tracking-wider">{candidate.tech_path}</span>
                  </div>
                  
                  <div className="p-3 bg-slate-950/50 rounded-lg border border-slate-800/50">
                    <p className="text-xs text-slate-500 font-mono mb-1">// BIO</p>
                    <p className="text-sm text-slate-400 line-clamp-2 italic">
                      "{candidate.bio || "No bio available."}"
                    </p>
                  </div>
                </div>

                {/* Skill Test Result */}
                <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 mb-5 relative z-10 group-hover:border-slate-700 transition-colors">
                  <p className="text-[10px] text-slate-500 uppercase font-mono tracking-widest mb-2 flex items-center gap-2">
                    <Terminal size={10} />
                    Latest Assessment
                  </p>
                  <div className="flex items-center justify-between text-sm font-mono">
                    <span className="text-slate-300">
                      {candidate.test_score || (candidate.is_verified ? "Passed: Core Skills" : "Pending...")}
                    </span>
                    {candidate.is_verified && <CheckCircle2 size={14} className="text-green-500" />}
                  </div>
                </div>

                {/* Action */}
                <a 
                  href={`mailto:recruiter@example.com?subject=Interview Request: ${candidate.full_name}`}
                  onClick={() => handleContact(candidate.id, candidate.full_name)}
                  className="w-full mt-auto flex items-center justify-center gap-2 py-2.5 bg-slate-800 text-slate-200 border border-slate-700 rounded-lg font-mono text-xs font-bold hover:bg-blue-600 hover:text-white hover:border-blue-500 transition-all shadow-lg relative z-10 group/btn"
                >
                  <Mail size={14} />
                  <span>init_connection()</span>
                  <ArrowRight size={12} className="opacity-0 -ml-2 group-hover/btn:opacity-100 group-hover/btn:ml-0 transition-all" />
                </a>

              </div>
            ))}
          </div>
        )}

        {!loading && filteredCandidates.length === 0 && (
          <div className="text-center py-20 border border-dashed border-slate-800 rounded-xl bg-slate-900/20">
             <div className="bg-slate-800/50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search size={24} className="text-slate-500" />
             </div>
             <p className="text-lg text-slate-400 font-mono mb-2">Query returned 0 results.</p>
             <p className="text-sm text-slate-600 mb-6">Try adjusting your filter parameters.</p>
             <button 
               onClick={() => {setFilterPath('all'); setFilterVerified(false);}}
               className="text-blue-400 hover:text-blue-300 hover:underline font-mono text-sm"
             >
               reset_filters()
             </button>
          </div>
        )}

      </div>

      {/* AI Modal */}
      {showAiModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-slate-900 border border-indigo-500/30 w-full max-w-lg rounded-xl shadow-2xl overflow-hidden relative animate-in fade-in zoom-in-95 duration-300">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
                
                <button 
                    onClick={() => { setShowAiModal(false); setAiStep(0); setGeneratedTest(null); }}
                    className="absolute top-4 right-4 text-slate-400 hover:text-white"
                >
                    <X size={20} />
                </button>

                <div className="p-8">
                    <div className="flex flex-col items-center mb-6">
                        <div className="w-16 h-16 bg-indigo-500/10 rounded-full flex items-center justify-center text-indigo-400 mb-4 ring-1 ring-indigo-500/30">
                            <Bot size={32} />
                        </div>
                        <h2 className="text-2xl font-bold text-white text-center">AI Test Generator</h2>
                        <p className="text-slate-400 text-center text-sm mt-1">
                            Generate tailored assessments for your candidates.
                        </p>
                    </div>

                    {aiStep === 0 && (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-mono text-slate-400 mb-2">TARGET_STACK</label>
                                <select 
                                    value={targetStack}
                                    onChange={(e) => setTargetStack(e.target.value)}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-slate-200 focus:border-indigo-500 outline-none transition-colors"
                                >
                                    <option>Full Stack Development (React/Node)</option>
                                    <option>DevOps & Infrastructure</option>
                                    <option>Cybersecurity & Pentesting</option>
                                    <option>Data Science & ML</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-mono text-slate-400 mb-2">DIFFICULTY_LEVEL</label>
                                <select 
                                    value={targetDifficulty}
                                    onChange={(e) => setTargetDifficulty(e.target.value)}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-slate-200 focus:border-indigo-500 outline-none transition-colors"
                                >
                                    <option>Junior (Fundamental)</option>
                                    <option>Mid-Level (Practical)</option>
                                    <option>Senior (Architectural)</option>
                                </select>
                            </div>
                            <button 
                                onClick={handleGenerateAiTest}
                                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 mt-4 transition-all"
                            >
                                <Sparkles size={18} />
                                Generate Assessment
                            </button>
                        </div>
                    )}

                    {aiStep === 1 && (
                        <div className="flex flex-col items-center justify-center py-8">
                            <Loader2 size={48} className="text-indigo-500 animate-spin mb-4" />
                            <p className="text-indigo-400 font-mono animate-pulse">Analyzing tech stack requirements...</p>
                            <p className="text-slate-500 text-xs mt-2">Constructing questions based on industry standards</p>
                        </div>
                    )}

                    {aiStep === 2 && generatedTest && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-lg p-4 mb-6">
                                <h3 className="font-bold text-white mb-2">{generatedTest.title}</h3>
                                <div className="flex gap-2 mb-4">
                                    <span className="text-xs bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded">{generatedTest.difficulty}</span>
                                    <span className="text-xs bg-slate-700 text-slate-300 px-2 py-0.5 rounded">{generatedTest.type}</span>
                                </div>
                                <ul className="space-y-2">
                                    {generatedTest.questions.map((q: string, i: number) => (
                                        <li key={i} className="text-sm text-slate-300 flex items-start gap-2">
                                            <span className="text-indigo-500 font-mono">{i+1}.</span>
                                            {q}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <button 
                                onClick={handleDeployAssessment}
                                className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-all"
                            >
                                <CheckCircle2 size={18} />
                                Deploy to Candidates
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
      )}

    </div>
  );
}

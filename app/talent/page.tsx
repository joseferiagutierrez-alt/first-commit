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
  Briefcase 
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
  // Mock field for display if not in DB
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

  useEffect(() => {
    const fetchCandidates = async () => {
      const supabase = createClient();
      
      // Fetch profiles
      // In a real app, we would join with test_results to get actual scores.
      // For this POC, we'll fetch profiles and if empty use mock data.
      let { data: profiles, error } = await supabase
        .from('profiles')
        .select('id, full_name, tech_path, is_verified, bio, avatar_url');

      if (error) {
        console.error("Error fetching profiles:", error);
      }

      // If no profiles found (or only current user), let's mix in mock data for the "Company Experience"
      // to ensure the recruiter sees a populated board.
      const realProfiles = (profiles || []) as Profile[];
      
      // If we have very few profiles, let's add the mock ones to showcase the feature
      if (realProfiles.length < 4) {
        setCandidates([...realProfiles, ...(MOCK_CANDIDATES as Profile[])]);
      } else {
        setCandidates(realProfiles);
      }
      
      setLoading(false);
    };

    fetchCandidates();
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
      // Track the view/contact so it appears on the candidate's dashboard
      await supabase.from('profile_views').insert({
        candidate_id: candidateId,
        company_name: "Tech Recruiter", // Simulated company name
        viewed_at: new Date().toISOString()
      });
    } catch (err) {
      console.error("Error tracking contact:", err);
      // Fail silently so mailto still works
    }
  };

  const filteredCandidates = candidates.filter(c => {
    if (filterPath !== 'all' && c.tech_path !== filterPath) return false;
    if (filterVerified && !c.is_verified) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Link href="/dashboard" className="p-2 hover:bg-gray-800 rounded-full transition-colors">
                <div className="h-8 w-8 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-lg flex items-center justify-center font-bold text-white">
                  FC
                </div>
              </Link>
              <h1 className="text-3xl font-bold">Talent Search</h1>
            </div>
            <p className="text-gray-400">
              Find verified junior talent ready for your company.
            </p>
          </div>
          
          <div className="flex flex-wrap gap-3">
             <div className="relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Search by name..." 
                  className="bg-gray-900 border border-gray-700 rounded-full py-2 pl-10 pr-4 focus:outline-none focus:border-blue-500 w-full sm:w-64"
                />
             </div>
             <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-full font-medium transition-colors">
               Post a Job
             </button>
          </div>
        </header>

        {/* Filters */}
        <div className="mb-8 flex flex-wrap items-center gap-4 p-4 bg-gray-900/30 border border-gray-800 rounded-xl">
          <div className="flex items-center gap-2 text-gray-400 mr-2">
            <Filter size={18} />
            <span className="text-sm font-medium">Filters:</span>
          </div>
          
          <select 
            value={filterPath}
            onChange={(e) => setFilterPath(e.target.value as TechPath | 'all')}
            className="bg-gray-800 border border-gray-700 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
          >
            <option value="all">All Specialties</option>
            <option value="dev">Developers</option>
            <option value="infra">Infrastructure</option>
            <option value="cyber">Cybersecurity</option>
            <option value="data">Data Science</option>
            <option value="design">Design</option>
            <option value="qa">QA / Testing</option>
          </select>

          <button 
            onClick={() => setFilterVerified(!filterVerified)}
            className={`
              flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium border transition-colors
              ${filterVerified 
                ? 'bg-blue-500/20 border-blue-500/50 text-blue-400' 
                : 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700'}
            `}
          >
            <CheckCircle2 size={16} />
            Verified Only
          </button>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="text-center py-20 text-gray-500">Loading talent pool...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCandidates.map((candidate) => (
              <div key={candidate.id} className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 hover:border-gray-600 transition-all group relative flex flex-col h-full">
                
                {/* Header: Avatar & Verified Badge */}
                <div className="flex justify-between items-start mb-4">
                  <div className="h-12 w-12 bg-gray-800 rounded-full flex items-center justify-center text-lg font-bold border border-gray-700">
                    {candidate.full_name?.[0]?.toUpperCase() || 'U'}
                  </div>
                  {candidate.is_verified && (
                    <span className="bg-blue-500 text-white text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1 shadow-[0_0_10px_rgba(59,130,246,0.5)]">
                      <CheckCircle2 size={10} />
                      VERIFIED EXPERT
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="mb-4 flex-grow">
                  <h3 className="text-lg font-bold text-white mb-1 group-hover:text-blue-400 transition-colors">
                    {candidate.full_name}
                  </h3>
                  <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-medium border mb-3 ${getPathColor(candidate.tech_path || 'dev')}`}>
                    {getPathIcon(candidate.tech_path || 'dev')}
                    <span className="uppercase">{candidate.tech_path}</span>
                  </div>
                  <p className="text-sm text-gray-400 line-clamp-2">
                    {candidate.bio || "No bio available."}
                  </p>
                </div>

                {/* Skill Test Result */}
                <div className="bg-black/40 border border-gray-800 rounded-lg p-3 mb-4">
                  <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Skill Assessment</p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-300">
                      {candidate.test_score || (candidate.is_verified ? "Passed Assessment" : "Not yet taken")}
                    </span>
                    {candidate.is_verified && <CheckCircle2 size={14} className="text-green-500" />}
                  </div>
                </div>

                {/* Action */}
                <a 
                  href={`mailto:recruiter@example.com?subject=Interview Request: ${candidate.full_name}`}
                  onClick={() => handleContact(candidate.id, candidate.full_name)}
                  className="w-full mt-auto flex items-center justify-center gap-2 py-2 bg-white text-black rounded-lg font-bold hover:bg-gray-200 hover:scale-[1.02] active:scale-95 transition-all text-sm shadow-lg hover:shadow-xl"
                >
                  <Mail size={16} />
                  Contact Talent
                </a>

              </div>
            ))}
          </div>
        )}

        {!loading && filteredCandidates.length === 0 && (
          <div className="text-center py-20">
             <p className="text-xl text-gray-500">No candidates found matching your filters.</p>
             <button 
               onClick={() => {setFilterPath('all'); setFilterVerified(false);}}
               className="mt-4 text-blue-400 hover:underline"
             >
               Clear filters
             </button>
          </div>
        )}

      </div>
    </div>
  );
}

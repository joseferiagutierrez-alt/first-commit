"use client";

import { useEffect, useState, useRef } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  Terminal as TerminalIcon, 
  Cpu, 
  Shield, 
  Code2, 
  CheckCircle2, 
  AlertCircle,
  Play,
  Maximize2,
  Minus,
  X,
  FileCode,
  Bug
} from "lucide-react";
import { cn } from "@/lib/utils";

type TechPath = 'dev' | 'infra' | 'data' | 'design' | 'cyber' | 'qa';

interface Question {
  id: number;
  text: string;
  options: string[];
  correct: number;
}

const QUIZ_QUESTIONS: Record<string, Question[]> = {
  dev: [
    { id: 1, text: "What is the complexity of binary search?", options: ["O(n)", "O(log n)", "O(n^2)", "O(1)"], correct: 1 },
    { id: 2, text: "Which HTTP method is idempotent?", options: ["POST", "PUT", "PATCH", "CONNECT"], correct: 1 },
    { id: 3, text: "What does DOM stand for?", options: ["Document Object Model", "Data Object Model", "Digital Object Mode", "Document Orientation Model"], correct: 0 },
    { id: 4, text: "In React, what hook manages side effects?", options: ["useState", "useContext", "useEffect", "useReducer"], correct: 2 },
    { id: 5, text: "What is a Closure?", options: ["A function with preserved data", "A database connection", "A closing tag", "A CSS property"], correct: 0 },
  ],
  data: [
    { id: 1, text: "Which library is standard for DataFrames?", options: ["NumPy", "Pandas", "Matplotlib", "Scikit-learn"], correct: 1 },
    { id: 2, text: "What is Overfitting?", options: ["Model is too simple", "Model learns noise", "Model is perfect", "Model is under-trained"], correct: 1 },
    { id: 3, text: "SQL command to remove duplicates?", options: ["UNIQUE", "DISTINCT", "DIFFERENT", "REMOVE"], correct: 1 },
    { id: 4, text: "Which is a supervised learning algorithm?", options: ["K-Means", "Linear Regression", "Apriori", "PCA"], correct: 1 },
    { id: 5, text: "What does ETL stand for?", options: ["Extract Transform Load", "Execute Test Load", "Extract Test Load", "Execute Transform Load"], correct: 0 },
  ],
  qa: [
    { id: 1, text: "What is Black Box Testing?", options: ["Testing internal logic", "Testing without internal knowledge", "Testing security", "Testing performance"], correct: 1 },
    { id: 2, text: "Tool for API Testing?", options: ["Selenium", "Postman", "Appium", "JIRA"], correct: 1 },
    { id: 3, text: "What is Regression Testing?", options: ["Testing new features", "Testing bug fixes don't break existing", "Testing performance", "Testing UI"], correct: 1 },
    { id: 4, text: "Which is a valid HTTP status for Not Found?", options: ["200", "500", "404", "403"], correct: 2 },
    { id: 5, text: "What is a Test Case?", options: ["A bug report", "A set of conditions to verify", "A test plan", "A test strategy"], correct: 1 },
  ],
  design: [
    { id: 1, text: "What is the Golden Ratio?", options: ["1:1.618", "1:1.5", "1:2", "1:1.414"], correct: 0 },
    { id: 2, text: "Which tool is best for vector graphics?", options: ["Photoshop", "Illustrator", "Premiere", "Lightroom"], correct: 1 },
    { id: 3, text: "What does RGB stand for?", options: ["Red Green Blue", "Red Gold Black", "Real Graphic Base", "Red Gray Blue"], correct: 0 },
    { id: 4, text: "What is Kerning?", options: ["Line spacing", "Letter spacing between pairs", "Font size", "Paragraph spacing"], correct: 1 },
    { id: 5, text: "Primary color model for print?", options: ["RGB", "CMYK", "HEX", "HSL"], correct: 1 },
  ],
  // Fallback for others if needed
  default: [
    { id: 1, text: "What is Git?", options: ["A database", "Version Control System", "IDE", "OS"], correct: 1 },
    { id: 2, text: "What port is HTTP?", options: ["80", "443", "22", "8080"], correct: 0 },
    { id: 3, text: "What does API stand for?", options: ["Application Programming Interface", "Apple Pie Ingredients", "Advanced Protocol Interface", "App Program Interact"], correct: 0 },
    { id: 4, text: "Which is NOT a programming language?", options: ["Java", "Python", "HTML", "C++"], correct: 2 },
    { id: 5, text: "What is Docker?", options: ["A container platform", "A database", "A code editor", "A game"], correct: 0 },
  ]
};

export default function TestPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [techPath, setTechPath] = useState<TechPath | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  
  // Terminal State
  const [history, setHistory] = useState<string[]>(["Welcome to FirstCommit Terminal v1.0", "Type 'help' for instructions."]);
  const [input, setInput] = useState("");
  const [terminalStep, setTerminalStep] = useState(0); // 0: ls, 1: mkdir, 2: ps
  const terminalRef = useRef<HTMLDivElement>(null);

  // Quiz State
  const [answers, setAnswers] = useState<number[]>(new Array(5).fill(-1));
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  useEffect(() => {
    const init = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/onboarding');
        return;
      }
      setUserId(user.id);
      
      const { data } = await supabase.from('profiles').select('tech_path').eq('id', user.id).single();
      if (data) {
        setTechPath(data.tech_path);
      }
      setLoading(false);
    };
    init();
  }, [router]);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history]);

  const saveResult = async (passed: boolean, score: number) => {
    if (!userId || !techPath) return;
    const supabase = createClient();
    
    // 1. Save Test Result
    await supabase.from('test_results').insert({
      user_id: userId,
      test_type: ['infra', 'cyber'].includes(techPath) ? 'terminal' : 'quiz',
      score: score,
      passed: passed,
      details: { answers: answers, terminal_history: history.slice(-10) }
    });

    // 2. Update Profile Verification if passed
    if (passed) {
      await supabase.from('profiles').update({ is_verified: true }).eq('id', userId);
    }

    router.push('/dashboard');
  };

  // Terminal Logic
  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = input.trim();
    const newHistory = [...history, `$ ${cmd}`];
    
    if (cmd === 'clear') {
      setHistory([]);
      setInput("");
      return;
    }

    let response = "";
    let nextStep = terminalStep;

    // Challenge Logic
    if (terminalStep === 0) {
      if (cmd === 'ls -la' || cmd === 'ls -a' || cmd === 'll') {
        response = "drwxr-xr-x  .config\n-rw-r--r--  .bashrc\ndrwxr-xr-x  workspace\n\n[SUCCESS] Hidden files listed.";
        nextStep = 1;
        newHistory.push(response);
        newHistory.push("Next Challenge: Create a folder named 'proyectos'.");
      } else {
        response = "Try listing ALL files (including hidden ones).";
        newHistory.push(response);
      }
    } else if (terminalStep === 1) {
      if (cmd === 'mkdir proyectos' || cmd === 'mkdir "proyectos"' || cmd === "mkdir 'proyectos'") {
        response = "[SUCCESS] Directory 'proyectos' created.\nNext Challenge: Check running processes.";
        nextStep = 2;
        newHistory.push(response);
      } else {
        response = "Command to create directory is incorrect. Try 'mkdir <name>'.";
        newHistory.push(response);
      }
    } else if (terminalStep === 2) {
      if (cmd.includes('ps') || cmd.includes('top') || cmd.includes('htop')) {
        response = "PID TTY          TIME CMD\n123 pts/0    00:00:00 bash\n\n[SUCCESS] Processes listed. Test Completed!";
        nextStep = 3;
        newHistory.push(response);
        setTimeout(() => saveResult(true, 100), 1500);
      } else {
        response = "Try 'ps' with flags or similar commands.";
        newHistory.push(response);
      }
    } else {
      newHistory.push("Test already completed.");
    }

    setHistory(newHistory);
    setTerminalStep(nextStep);
    setInput("");
  };

  // Quiz Logic
  const handleQuizSubmit = () => {
    if (answers.includes(-1)) {
      alert("Please answer all questions.");
      return;
    }
    
    const questions = QUIZ_QUESTIONS[techPath as string] || QUIZ_QUESTIONS.default;
    let score = 0;
    answers.forEach((ans, idx) => {
      if (ans === questions[idx].correct) score++;
    });

    const passed = score >= 4; // 80% passing (4 out of 5)
    const finalScore = (score / 5) * 100;
    
    setQuizSubmitted(true);
    setTimeout(() => saveResult(passed, finalScore), 2000);
  };

  const getTheme = () => {
    switch(techPath) {
        case 'infra': return { icon: TerminalIcon, color: 'text-green-500', bg: 'bg-green-500', border: 'border-green-500/30', gradient: 'from-green-500/10' };
        case 'data': return { icon: Cpu, color: 'text-purple-500', bg: 'bg-purple-500', border: 'border-purple-500/30', gradient: 'from-purple-500/10' };
        case 'cyber': return { icon: Shield, color: 'text-red-500', bg: 'bg-red-500', border: 'border-red-500/30', gradient: 'from-red-500/10' };
        case 'qa': return { icon: Bug, color: 'text-orange-500', bg: 'bg-orange-500', border: 'border-orange-500/30', gradient: 'from-orange-500/10' };
        case 'design': return { icon: FileCode, color: 'text-pink-500', bg: 'bg-pink-500', border: 'border-pink-500/30', gradient: 'from-pink-500/10' };
        default: return { icon: Code2, color: 'text-blue-500', bg: 'bg-blue-500', border: 'border-blue-500/30', gradient: 'from-blue-500/10' };
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center gap-4">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-500 font-mono text-sm animate-pulse">Initializing Test Environment...</p>
    </div>
  );

  const theme = getTheme();
  const PathIcon = theme.icon;
  const isTerminal = ['infra', 'cyber'].includes(techPath || '');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-6 font-mono selection:bg-slate-700 selection:text-white">
      <div className="max-w-5xl mx-auto">
        <header className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => router.back()} 
              className="p-3 bg-slate-900 border border-slate-800 rounded-lg hover:border-slate-600 hover:text-white transition-all group"
            >
              <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            </button>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <div className={cn("p-1.5 rounded-md bg-slate-900 border border-slate-800", theme.color)}>
                  <PathIcon size={18} />
                </div>
                <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
                  SKILL_VERIFICATION<span className="text-slate-600">.exe</span>
                </h1>
              </div>
              <p className="text-xs md:text-sm text-slate-500 pl-11">
                Protocol: {isTerminal ? "TERMINAL_SIMULATION" : "KNOWLEDGE_ASSESSMENT_V2"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs md:text-sm bg-slate-900/50 px-4 py-2 rounded-full border border-slate-800">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-emerald-500">SYSTEM_ONLINE</span>
            </div>
            <span className="text-slate-700">|</span>
            <span className="text-slate-400">UID: {userId?.slice(0, 8)}...</span>
          </div>
        </header>

        {isTerminal ? (
          <div className="bg-slate-900 rounded-xl border border-slate-800 shadow-2xl overflow-hidden backdrop-blur-sm ring-1 ring-white/5 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Terminal Window Header */}
            <div className="bg-slate-950 px-4 py-3 flex items-center justify-between border-b border-slate-800">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/80 hover:bg-red-500 transition-colors"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/80 hover:bg-yellow-500 transition-colors"></div>
                <div className="w-3 h-3 rounded-full bg-green-500/80 hover:bg-green-500 transition-colors"></div>
              </div>
              <div className="text-xs text-slate-500 font-mono flex items-center gap-2">
                <TerminalIcon size={12} />
                user@firstcommit:~/{techPath}-test
              </div>
              <div className="flex gap-3 text-slate-600">
                 <Minus size={14} />
                 <Maximize2 size={14} />
                 <X size={14} />
              </div>
            </div>

            {/* Terminal Content */}
            <div 
              ref={terminalRef}
              className="p-6 h-[500px] overflow-y-auto font-mono text-sm md:text-base space-y-2 cursor-text"
              onClick={() => document.getElementById('terminal-input')?.focus()}
            >
              {history.map((line, i) => (
                <div key={i} className={cn(
                  "whitespace-pre-wrap",
                  line.startsWith("$") ? "text-slate-300 font-bold" : "text-slate-400",
                  line.includes("[SUCCESS]") && "text-emerald-400",
                  line.includes("Error") && "text-red-400"
                )}>
                    {line}
                </div>
              ))}
              <form onSubmit={handleCommand} className="flex gap-2 items-center mt-2">
                <span className={cn("font-bold", theme.color)}>$</span>
                <input
                  id="terminal-input"
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="bg-transparent outline-none flex-1 text-slate-100 placeholder-slate-700"
                  autoFocus
                  autoComplete="off"
                  spellCheck="false"
                  placeholder="Wait for command..."
                />
              </form>
              <div className="h-4"></div>
            </div>

            {/* Terminal Footer / Status Bar */}
            <div className="bg-slate-950 border-t border-slate-800 p-2 px-4 flex justify-between items-center text-xs font-mono">
                <div className="flex items-center gap-2">
                    <span className="bg-blue-600 text-white px-1.5 py-0.5 rounded-sm">NORMAL</span>
                    <span className="text-slate-500">master*</span>
                </div>
                <div className="flex items-center gap-4 text-slate-400">
                    <span className={cn(terminalStep === 0 ? "text-yellow-400 font-bold animate-pulse" : "text-emerald-500")}>
                        1. LIST_FILES
                    </span>
                    <span className="text-slate-700">→</span>
                    <span className={cn(terminalStep === 1 ? "text-yellow-400 font-bold animate-pulse" : terminalStep > 1 ? "text-emerald-500" : "")}>
                        2. MKDIR
                    </span>
                    <span className="text-slate-700">→</span>
                    <span className={cn(terminalStep === 2 ? "text-yellow-400 font-bold animate-pulse" : terminalStep > 2 ? "text-emerald-500" : "")}>
                        3. PROCESSES
                    </span>
                </div>
                <div className="text-slate-600">
                    utf-8
                </div>
            </div>
          </div>
        ) : (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
             {/* Progress Header */}
             <div className="flex items-center justify-between mb-8 px-2">
                <div className="text-sm text-slate-500">PROGRESS</div>
                <div className="flex gap-1">
                    {[0, 1, 2, 3, 4].map((i) => (
                        <div key={i} className={cn(
                            "h-1.5 w-8 rounded-full transition-all duration-500",
                            answers[i] !== -1 ? theme.bg : "bg-slate-800"
                        )} />
                    ))}
                </div>
                <div className="text-sm text-slate-500">{answers.filter(a => a !== -1).length}/5</div>
             </div>

            {(QUIZ_QUESTIONS[techPath as string] || QUIZ_QUESTIONS.default).map((q, idx) => (
              <div 
                key={q.id} 
                className={cn(
                    "bg-slate-900/40 p-6 md:p-8 rounded-xl border border-dashed transition-all duration-300 relative group",
                    theme.border,
                    "hover:bg-slate-900/80 hover:shadow-xl hover:border-solid hover:scale-[1.01]"
                )}
              >
                {/* Decoration: Line Number */}
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-transparent via-slate-800 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                
                <div className="flex gap-4">
                    <div className="hidden md:flex flex-col text-right text-slate-700 select-none text-sm font-mono pt-1">
                        <span>{idx * 10 + 1}</span>
                        <span>{idx * 10 + 2}</span>
                    </div>

                    <div className="flex-1">
                        <h3 className="text-lg md:text-xl font-medium mb-6 text-slate-200 flex items-start gap-2">
                            <span className={theme.color}>// 0{idx + 1}.</span> 
                            {q.text}
                        </h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {q.options.map((opt, optIdx) => (
                            <button
                            key={optIdx}
                            onClick={() => {
                                const newAnswers = [...answers];
                                newAnswers[idx] = optIdx;
                                setAnswers(newAnswers);
                            }}
                            className={cn(
                                "p-4 rounded-lg text-left border transition-all relative overflow-hidden group/btn",
                                answers[idx] === optIdx 
                                ? cn("bg-slate-800 text-white shadow-lg", theme.border)
                                : "bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-900 hover:border-slate-700"
                            )}
                            >
                            {answers[idx] === optIdx && (
                                <div className={cn("absolute left-0 top-0 bottom-0 w-1", theme.bg)}></div>
                            )}
                            <div className="flex items-center gap-3">
                                <div className={cn(
                                    "w-5 h-5 rounded border flex items-center justify-center text-[10px]",
                                    answers[idx] === optIdx 
                                        ? cn(theme.bg, "border-transparent text-white") 
                                        : "border-slate-700 text-slate-600"
                                )}>
                                    {String.fromCharCode(65 + optIdx)}
                                </div>
                                <span className="font-mono text-sm">{opt}</span>
                            </div>
                            </button>
                        ))}
                        </div>
                    </div>
                </div>
              </div>
            ))}
            
            <div className="pt-8 flex justify-end">
                <button
                onClick={handleQuizSubmit}
                disabled={quizSubmitted || answers.includes(-1)}
                className={cn(
                    "px-8 py-4 rounded-xl font-bold text-lg transition-all flex items-center gap-3 shadow-lg",
                    answers.includes(-1) 
                        ? "bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700"
                        : cn(theme.bg, "text-white hover:opacity-90 hover:scale-105 hover:shadow-xl")
                )}
                >
                {quizSubmitted ? (
                    <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>COMPILING_RESULTS...</span>
                    </>
                ) : (
                    <>
                        <Play size={20} fill="currentColor" />
                        <span>RUN_TESTS()</span>
                    </>
                )}
                </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

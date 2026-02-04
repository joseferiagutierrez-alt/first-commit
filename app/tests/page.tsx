"use client";

import { submitTestResult } from "@/app/actions/submit-test";
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
  Bug,
  ArrowRight
} from "lucide-react";
import { cn } from "@/lib/utils";

type TechPath = 'dev' | 'infra' | 'data' | 'design' | 'cyber' | 'qa';

interface Question {
  id: number;
  text: string;
  options: string[];
  correct: number;
}

interface TerminalScenario {
  id: string;
  steps: {
    instruction: string;
    validCommands: string[];
    successMessage: string;
    hint: string;
  }[];
}

// Extended Question Bank for Randomization
const QUIZ_BANK: Record<string, Question[]> = {
  dev: [
    { id: 1, text: "What is the complexity of binary search?", options: ["O(n)", "O(log n)", "O(n^2)", "O(1)"], correct: 1 },
    { id: 2, text: "Which HTTP method is idempotent?", options: ["POST", "PUT", "PATCH", "CONNECT"], correct: 1 },
    { id: 3, text: "What does DOM stand for?", options: ["Document Object Model", "Data Object Model", "Digital Object Mode", "Document Orientation Model"], correct: 0 },
    { id: 4, text: "In React, what hook manages side effects?", options: ["useState", "useContext", "useEffect", "useReducer"], correct: 2 },
    { id: 5, text: "What is a Closure?", options: ["A function with preserved data", "A database connection", "A closing tag", "A CSS property"], correct: 0 },
    { id: 6, text: "What is the virtual DOM?", options: ["A direct copy of the DOM", "A lightweight copy of the DOM", "A database", "A browser plugin"], correct: 1 },
    { id: 7, text: "Which keyword declares a constant in JS?", options: ["var", "let", "const", "static"], correct: 2 },
    { id: 8, text: "What is 'Hoisting'?", options: ["Lifting weights", "Moving declarations to top", "Deleting variables", "Hiding variables"], correct: 1 },
    { id: 9, text: "What is a Promise?", options: ["A guarantee", "An object representing async completion", "A function", "A loop"], correct: 1 },
    { id: 10, text: "What is JSX?", options: ["Java Syntax Extension", "JavaScript XML", "JSON XML", "Java Standard XML"], correct: 1 },
  ],
  data: [
    { id: 1, text: "Which library is standard for DataFrames?", options: ["NumPy", "Pandas", "Matplotlib", "Scikit-learn"], correct: 1 },
    { id: 2, text: "What is Overfitting?", options: ["Model is too simple", "Model learns noise", "Model is perfect", "Model is under-trained"], correct: 1 },
    { id: 3, text: "SQL command to remove duplicates?", options: ["UNIQUE", "DISTINCT", "DIFFERENT", "REMOVE"], correct: 1 },
    { id: 4, text: "Which is a supervised learning algorithm?", options: ["K-Means", "Linear Regression", "Apriori", "PCA"], correct: 1 },
    { id: 5, text: "What does ETL stand for?", options: ["Extract Transform Load", "Execute Test Load", "Extract Test Load", "Execute Transform Load"], correct: 0 },
    { id: 6, text: "What is a Null hypothesis?", options: ["The hypothesis to be tested", "A hypothesis with no data", "A wrong hypothesis", "A hypothesis about nulls"], correct: 0 },
    { id: 7, text: "What is Normalization?", options: ["Scaling data to 0-1", "Removing data", "Adding noise", "Sorting data"], correct: 0 },
    { id: 8, text: "Which plot is best for distribution?", options: ["Scatter", "Histogram", "Line", "Pie"], correct: 1 },
    { id: 9, text: "What is 'JOIN' in SQL?", options: ["Combining rows from tables", "Deleting tables", "Creating tables", "Sorting tables"], correct: 0 },
    { id: 10, text: "What is a Tensor?", options: ["A number", "A multi-dimensional array", "A function", "A neural network"], correct: 1 },
  ],
  qa: [
    { id: 1, text: "What is Black Box Testing?", options: ["Testing internal logic", "Testing without internal knowledge", "Testing security", "Testing performance"], correct: 1 },
    { id: 2, text: "Tool for API Testing?", options: ["Selenium", "Postman", "Appium", "JIRA"], correct: 1 },
    { id: 3, text: "What is Regression Testing?", options: ["Testing new features", "Testing bug fixes don't break existing", "Testing performance", "Testing UI"], correct: 1 },
    { id: 4, text: "Which is a valid HTTP status for Not Found?", options: ["200", "500", "404", "403"], correct: 2 },
    { id: 5, text: "What is a Test Case?", options: ["A bug report", "A set of conditions to verify", "A test plan", "A test strategy"], correct: 1 },
    { id: 6, text: "What is Smoke Testing?", options: ["Testing firewalls", "Preliminary testing to reveal simple failures", "Testing performance", "Testing smoke detectors"], correct: 1 },
    { id: 7, text: "What is Selenium used for?", options: ["Unit testing", "Web browser automation", "API testing", "Mobile testing"], correct: 1 },
    { id: 8, text: "What is a Bug Life Cycle?", options: ["Stages a bug goes through", "A biology term", "Software development cycle", "Testing cycle"], correct: 0 },
    { id: 9, text: "Difference between Severity and Priority?", options: ["Same thing", "Impact vs Urgency", "Size vs Weight", "Color vs Shape"], correct: 1 },
    { id: 10, text: "What is UAT?", options: ["User Acceptance Testing", "Unit Automated Testing", "User Automated Testing", "Unified Acceptance Testing"], correct: 0 },
  ],
  design: [
    { id: 1, text: "What is the Golden Ratio?", options: ["1:1.618", "1:1.5", "1:2", "1:1.414"], correct: 0 },
    { id: 2, text: "Which tool is best for vector graphics?", options: ["Photoshop", "Illustrator", "Premiere", "Lightroom"], correct: 1 },
    { id: 3, text: "What does RGB stand for?", options: ["Red Green Blue", "Red Gold Black", "Real Graphic Base", "Red Gray Blue"], correct: 0 },
    { id: 4, text: "What is Kerning?", options: ["Line spacing", "Letter spacing between pairs", "Font size", "Paragraph spacing"], correct: 1 },
    { id: 5, text: "Primary color model for print?", options: ["RGB", "CMYK", "HEX", "HSL"], correct: 1 },
    { id: 6, text: "What is White Space?", options: ["Empty area in design", "White color", "A mistake", "Background"], correct: 0 },
    { id: 7, text: "What is a Wireframe?", options: ["A skeletal framework", "A final design", "A code structure", "A 3D model"], correct: 0 },
    { id: 8, text: "What is Contrast?", options: ["Difference in visual properties", "Similarity", "Brightness", "Size"], correct: 0 },
    { id: 9, text: "What file format supports transparency?", options: ["JPG", "PNG", "BMP", "TXT"], correct: 1 },
    { id: 10, text: "What is Typography?", options: ["Study of maps", "Art of arranging type", "Type of photography", "Typing speed"], correct: 1 },
  ],
  default: [
    { id: 1, text: "What is Git?", options: ["A database", "Version Control System", "IDE", "OS"], correct: 1 },
    { id: 2, text: "What port is HTTP?", options: ["80", "443", "22", "8080"], correct: 0 },
    { id: 3, text: "What does API stand for?", options: ["Application Programming Interface", "Apple Pie Ingredients", "Advanced Protocol Interface", "App Program Interact"], correct: 0 },
    { id: 4, text: "Which is NOT a programming language?", options: ["Java", "Python", "HTML", "C++"], correct: 2 },
    { id: 5, text: "What is Docker?", options: ["A container platform", "A database", "A code editor", "A game"], correct: 0 },
  ]
};

const TERMINAL_SCENARIOS: TerminalScenario[] = [
  {
    id: "basics",
    steps: [
      {
        instruction: "List all files (including hidden ones).",
        validCommands: ["ls -la", "ls -a", "ll"],
        successMessage: "drwxr-xr-x  .config\n-rw-r--r--  .bashrc\ndrwxr-xr-x  workspace",
        hint: "Try 'ls' with flags like -a"
      },
      {
        instruction: "Create a directory named 'proyectos'.",
        validCommands: ["mkdir proyectos", "mkdir \"proyectos\"", "mkdir 'proyectos'"],
        successMessage: "[SUCCESS] Directory 'proyectos' created.",
        hint: "Use 'mkdir <name>'"
      },
      {
        instruction: "Check running processes.",
        validCommands: ["ps", "ps aux", "top", "htop"],
        successMessage: "PID TTY          TIME CMD\n123 pts/0    00:00:00 bash",
        hint: "Try 'ps' or 'top'"
      }
    ]
  },
  {
    id: "file_ops",
    steps: [
      {
        instruction: "Print current working directory.",
        validCommands: ["pwd"],
        successMessage: "/home/user/workspace",
        hint: "Command starts with 'p'"
      },
      {
        instruction: "Create an empty file named 'log.txt'.",
        validCommands: ["touch log.txt", "touch ./log.txt"],
        successMessage: "[SUCCESS] File 'log.txt' created.",
        hint: "Use 'touch'"
      },
      {
        instruction: "Remove the file 'log.txt'.",
        validCommands: ["rm log.txt", "rm ./log.txt"],
        successMessage: "[SUCCESS] File 'log.txt' removed.",
        hint: "Use 'rm'"
      }
    ]
  }
];

export default function TestPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [techPath, setTechPath] = useState<TechPath | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  
  // Terminal State
  const [history, setHistory] = useState<string[]>(["Welcome to FirstCommit Terminal v2.0", "Type 'help' for instructions."]);
  const [input, setInput] = useState("");
  const [terminalStep, setTerminalStep] = useState(0); 
  const [activeScenario, setActiveScenario] = useState<TerminalScenario>(TERMINAL_SCENARIOS[0]);
  const terminalRef = useRef<HTMLDivElement>(null);

  // Quiz State
  const [activeQuestions, setActiveQuestions] = useState<Question[]>([]);
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
        const path = data.tech_path;
        setTechPath(path);
        
        // Randomize Quiz Questions
        const bank = QUIZ_BANK[path as string] || QUIZ_BANK.default;
        // Shuffle and take 5
        const shuffled = [...bank].sort(() => 0.5 - Math.random());
        setActiveQuestions(shuffled.slice(0, 5));

        // Randomize Terminal Scenario if applicable
        if (['infra', 'cyber'].includes(path)) {
           const randomScenario = TERMINAL_SCENARIOS[Math.floor(Math.random() * TERMINAL_SCENARIOS.length)];
           setActiveScenario(randomScenario);
           setHistory(prev => [...prev, `SCENARIO: ${randomScenario.id.toUpperCase()}`, `Task 1: ${randomScenario.steps[0].instruction}`]);
        }
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

  // Quiz Logic
  const handleQuizSubmit = async () => {
    if (answers.includes(-1)) {
      alert("Please answer all questions.");
      return;
    }
    
    setQuizSubmitted(true);
    
    const result = await submitTestResult({
        answers: answers,
        questionIds: activeQuestions.map(q => q.id),
        path: techPath as string
    });

    if (result.success) {
        setTimeout(() => router.push('/dashboard'), 2000);
    } else {
        alert("Submission failed: " + result.message);
        setQuizSubmitted(false);
    }
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

    const currentStepData = activeScenario.steps[terminalStep];
    
    if (!currentStepData) {
        newHistory.push("Test already completed.");
        setHistory(newHistory);
        setInput("");
        return;
    }

    // Check if command matches any valid commands for current step
    const isValid = currentStepData.validCommands.some(valid => 
        cmd === valid || (valid.endsWith('*') && cmd.startsWith(valid.slice(0, -1)))
    );

    if (isValid) {
        newHistory.push(currentStepData.successMessage);
        
        const nextStepIdx = terminalStep + 1;
        if (nextStepIdx < activeScenario.steps.length) {
            newHistory.push(`\n[NEXT TASK]: ${activeScenario.steps[nextStepIdx].instruction}`);
            setTerminalStep(nextStepIdx);
        } else {
            newHistory.push("\n[SYSTEM] All tasks completed successfully. Verifying...");
            
            // Server-side verification
            setTimeout(async () => {
                const result = await submitTestResult({
                    answers: [],
                    questionIds: [],
                    path: techPath as string,
                    terminalHistory: [...history, "Success"] // Mark as success for simple check
                });
                if (result.success) router.push('/dashboard');
            }, 1500);
            
            setTerminalStep(nextStepIdx); // Mark as done
        }
    } else {
        newHistory.push(`Command not recognized or incorrect for this task.`);
        newHistory.push(`Hint: ${currentStepData.hint}`);
    }

    setHistory(newHistory);
    setInput("");
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
        <p className="text-slate-500 font-mono text-sm animate-pulse">Initializing Dynamic Test Environment...</p>
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
                Protocol: {isTerminal ? "TERMINAL_SIMULATION_RANDOMIZED" : "KNOWLEDGE_ASSESSMENT_V2_DYNAMIC"}
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
                  line.includes("Error") && "text-red-400",
                  line.includes("SCENARIO:") && "text-blue-400 font-bold border-b border-blue-900 pb-2 mb-2"
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
                    {activeScenario.steps.map((step, idx) => (
                        <span key={idx} className={cn(
                             idx === terminalStep ? "text-yellow-400 font-bold animate-pulse" : 
                             idx < terminalStep ? "text-emerald-500" : ""
                        )}>
                            {idx + 1}. {step.instruction.split(' ')[0].toUpperCase()}
                            {idx < activeScenario.steps.length - 1 && <span className="text-slate-700 ml-4">→</span>}
                        </span>
                    ))}
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

            {activeQuestions.map((q, idx) => (
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
                    "px-8 py-3 rounded-lg font-bold flex items-center gap-2 transition-all shadow-lg",
                    quizSubmitted || answers.includes(-1)
                    ? "bg-slate-800 text-slate-500 cursor-not-allowed"
                    : cn(theme.bg, "text-white hover:opacity-90 hover:scale-105")
                )}
                >
                {quizSubmitted ? (
                    <>Processing...</>
                ) : (
                    <>
                    Submit_Assessment() <ArrowRight size={18} />
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

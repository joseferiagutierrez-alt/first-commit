"use client";

import { useEffect, useState, useRef } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

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

  if (loading) return <div className="min-h-screen bg-black text-white flex items-center justify-center">Loading...</div>;

  const isTerminal = ['infra', 'cyber'].includes(techPath || '');

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8 flex items-center gap-4">
          <button onClick={() => router.back()} className="p-2 hover:bg-gray-800 rounded-full">
            <ArrowLeft />
          </button>
          <h1 className="text-3xl font-bold">
            {isTerminal ? "Terminal Simulation Test" : "Technical Knowledge Quiz"}
          </h1>
        </header>

        {isTerminal ? (
          <div className="bg-gray-900 border border-gray-700 rounded-xl overflow-hidden shadow-2xl">
            <div className="bg-gray-800 px-4 py-2 flex gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <div 
              ref={terminalRef}
              className="p-4 h-[500px] overflow-y-auto font-mono text-green-400 text-lg space-y-2"
              onClick={() => document.getElementById('terminal-input')?.focus()}
            >
              {history.map((line, i) => (
                <div key={i} className="whitespace-pre-wrap">{line}</div>
              ))}
              <form onSubmit={handleCommand} className="flex gap-2">
                <span>$</span>
                <input
                  id="terminal-input"
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="bg-transparent outline-none flex-1 text-white"
                  autoFocus
                  autoComplete="off"
                />
              </form>
            </div>
            <div className="p-4 bg-gray-800 text-sm text-gray-400">
               Current Task: {
                 terminalStep === 0 ? "List all files (including hidden)" :
                 terminalStep === 1 ? "Create folder 'proyectos'" :
                 terminalStep === 2 ? "Check running processes" : "Test Completed"
               }
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {(QUIZ_QUESTIONS[techPath as string] || QUIZ_QUESTIONS.default).map((q, idx) => (
              <div key={q.id} className="bg-gray-900/50 p-6 rounded-xl border border-gray-800">
                <h3 className="text-xl font-semibold mb-4">{idx + 1}. {q.text}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {q.options.map((opt, optIdx) => (
                    <button
                      key={optIdx}
                      onClick={() => {
                        const newAnswers = [...answers];
                        newAnswers[idx] = optIdx;
                        setAnswers(newAnswers);
                      }}
                      className={`
                        p-4 rounded-lg text-left border transition-all
                        ${answers[idx] === optIdx 
                          ? 'bg-blue-600 border-blue-500 text-white' 
                          : 'bg-black border-gray-700 hover:bg-gray-800'}
                      `}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            ))}
            
            <button
              onClick={handleQuizSubmit}
              disabled={quizSubmitted}
              className="w-full py-4 bg-blue-600 hover:bg-blue-700 rounded-xl font-bold text-lg transition-colors disabled:opacity-50"
            >
              {quizSubmitted ? "Submitting..." : "Submit Answers"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

"use server";

import { createClient } from "@/utils/supabase/server";

const QUIZ_ANSWERS: Record<string, Record<number, number>> = {
  dev: { 1: 1, 2: 1, 3: 0, 4: 2, 5: 0, 6: 1, 7: 2, 8: 1, 9: 1, 10: 1 },
  data: { 1: 1, 2: 1, 3: 1, 4: 1, 5: 0, 6: 0, 7: 0, 8: 1, 9: 0, 10: 1 },
  qa: { 1: 1, 2: 1, 3: 1, 4: 2, 5: 1, 6: 1, 7: 1, 8: 0, 9: 1, 10: 0 },
  design: { 1: 0, 2: 1, 3: 0, 4: 1, 5: 1, 6: 0, 7: 0, 8: 0, 9: 1, 10: 1 },
  default: { 1: 1, 2: 0, 3: 0, 4: 2, 5: 0 }
};

export async function submitTestResult(formData: {
  answers: number[];
  questionIds: number[];
  path: string;
  terminalHistory?: string[];
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, message: "Unauthorized" };
  }

  const { answers, questionIds, path, terminalHistory } = formData;
  let passed = false;
  let score = 0;

  if (['infra', 'cyber'].includes(path)) {
    // Terminal verification (simplified for MVP: check length/completion)
    // In a real app, we would verify the actual state changes or command outputs strictly
    // Here we check if history contains the success message
    const historyStr = terminalHistory?.join(' ') || "";
    if (historyStr.includes("success") || historyStr.includes("Success")) {
        passed = true;
        score = 100;
    }
  } else {
    // Quiz verification
    const key = QUIZ_ANSWERS[path] || QUIZ_ANSWERS.default;
    let correctCount = 0;
    
    questionIds.forEach((qId, index) => {
        if (answers[index] === key[qId]) {
            correctCount++;
        }
    });

    score = (correctCount / questionIds.length) * 100;
    passed = score >= 80;
  }

  // Save to DB
  const { error } = await supabase.from('test_results').insert({
    user_id: user.id,
    test_type: ['infra', 'cyber'].includes(path) ? 'terminal' : 'quiz',
    score: score,
    passed: passed,
    details: { 
        answers, 
        questions: questionIds,
        terminal_history: terminalHistory?.slice(-10) 
    }
  });

  if (error) {
    console.error("Error saving result:", error);
    return { success: false, message: "Database Error" };
  }

  if (passed) {
    await supabase.from('profiles').update({ is_verified: true }).eq('id', user.id);
  }

  return { success: true, passed, score };
}

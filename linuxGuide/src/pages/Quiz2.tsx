import React, { useEffect, useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

interface QuizQuestion {
  id: number;
  question: string;
  description?: string;
  answers: Record<string, string | null>;
  correct_answers: Record<string, "true" | "false">;
  multiple_correct_answers: "true" | "false";
}

const Quiz2: React.FC = () => {
  const { user } = useAuth();
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [score, setScore] = useState<number | null>(null);
  const [showCorrect, setShowCorrect] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState(5 * 60);
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [updateExperienceLevel, setUpdateExperienceLevel] =
    useState<boolean>(true);

  useEffect(() => {
    loadQuestions();
  }, []);

  useEffect(() => {
    if (quizSubmitted || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    if (timeLeft === 0 && !quizSubmitted) {
      submitQuiz();
    }
    return () => clearInterval(timer);
  }, [quizSubmitted, timeLeft]);

  const calculateExperienceLevel = (
    score: number,
    total: number,
  ): "beginner" | "novice" | "advanced" => {
    const percent = (score / total) * 100;
    if (percent >= 80) return "advanced";
    if (percent >= 50) return "novice";
    return "beginner";
  };

  const loadQuestions = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/linux_quiz_questions.json");
      const data: QuizQuestion[] = await res.json();
      const filtered = data.filter((q) =>
        Object.values(q.answers).some((a) => a !== null),
      );
      const shuffled = filtered.sort(() => 0.5 - Math.random()).slice(0, 10);
      setQuestions(shuffled);
      setScore(null);
      setUserAnswers({});
      setShowCorrect(false);
      setTimeLeft(5 * 60);
      setQuizSubmitted(false);
    } catch (error) {
      console.error("Error loading questions:", error);
      alert("Failed to load questions. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswerChange = (questionId: number, optionKey: string) => {
    if (quizSubmitted) return;
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: optionKey,
    }));
  };

  const submitQuiz = async () => {
    setQuizSubmitted(true);
    setShowCorrect(true);

    let correct = 0;
    questions.forEach((q) => {
      const userAnswer = userAnswers[q.id];
      const correctKey = Object.entries(q.correct_answers).find(
        ([_, val]) => val === "true",
      )?.[0];
      const answerKey = correctKey?.replace("_correct", "");
      if (userAnswer === answerKey) correct += 1;
    });

    setScore(correct);

    const experience_level = calculateExperienceLevel(
      correct,
      questions.length,
    );
    toast.success(
      `🎉 Quiz submitted! You scored ${correct}/${questions.length} — you're ${experience_level}.`,
    );
    if (updateExperienceLevel && user?.id) {
      try {
        await api.post("/quiz2", {
          userId: user.id,
          experience_level,
        });
      } catch (err) {
        console.error("Failed to update experience level:", err);
      }
    } else {
      return alert("login first");
    }
  };

  const formatTime = (s: number) => {
    const min = Math.floor(s / 60);
    const sec = s % 60;
    return `${min}:${sec.toString().padStart(2, "0")}`;
  };

  const getPerformanceMessage = (percentage: number) => {
    if (percentage >= 80) return "Excellent! You're an Linux expert!";
    if (percentage >= 50)
      return "Good job! You have intermediate Linux knowledge.";
    return "Keep practicing! Your Linux skills are developing.";
  };

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6 space-y-8">
      {/* Header with Timer */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">
          Linux Experience Quiz
        </h1>
        <div className="flex items-center gap-4">
          {!quizSubmitted && (
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={updateExperienceLevel}
                onChange={() =>
                  setUpdateExperienceLevel(!updateExperienceLevel)
                }
                className="h-4 w-4 text-blue-600 rounded"
              />
              <span className="text-sm text-gray-600">
                Update my experience level
              </span>
            </label>
          )}
          <span
            className={`text-lg font-mono px-4 py-2 rounded-lg transition-colors ${
              timeLeft <= 30
                ? "bg-red-100 text-red-700 animate-pulse"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            ⏳ {formatTime(timeLeft)}
          </span>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          {/* Questions List */}
          <div className="space-y-6">
            {questions.map((q, index) => (
              <div
                key={q.id}
                className="border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow"
              >
                <p className="font-semibold text-lg mb-4 text-gray-800">
                  {index + 1}. {q.question}
                </p>

                <div className="space-y-3">
                  {Object.entries(q.answers)
                    .filter(([_, val]) => val !== null)
                    .map(([key, val]) => {
                      const isCorrect =
                        q.correct_answers[key + "_correct"] === "true";
                      const isUserAnswer = userAnswers[q.id] === key;
                      const isIncorrect =
                        showCorrect && isUserAnswer && !isCorrect;

                      return (
                        <label
                          key={key}
                          className={`flex items-start p-3 rounded-lg border-2 cursor-pointer transition-all ${
                            showCorrect && isCorrect
                              ? "border-emerald-500 bg-emerald-50"
                              : isIncorrect
                                ? "border-red-300 bg-red-50"
                                : isUserAnswer
                                  ? "border-blue-500 bg-blue-50"
                                  : "border-gray-200 hover:border-blue-300"
                          }`}
                        >
                          <input
                            type="radio"
                            name={`q-${q.id}`}
                            value={key}
                            disabled={quizSubmitted || timeLeft <= 0}
                            checked={isUserAnswer}
                            onChange={() => handleAnswerChange(q.id, key)}
                            className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 mr-3"
                          />
                          <div className="flex-1">
                            <span className="block">{val}</span>
                            {showCorrect && isCorrect && (
                              <span className="block mt-1 text-sm text-green-600 font-medium">
                                ✓ Correct answer
                              </span>
                            )}
                            {isIncorrect && (
                              <span className="block mt-1 text-sm text-red-600 font-medium">
                                ✗ Your answer
                              </span>
                            )}
                          </div>
                        </label>
                      );
                    })}
                </div>
              </div>
            ))}
          </div>

          {/* Submit Button */}
          {!quizSubmitted && (
            <button
              onClick={submitQuiz}
              disabled={timeLeft <= 0}
              className={`w-full px-8 py-3 text-lg font-semibold rounded-xl transition-colors ${
                timeLeft <= 0
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg"
              }`}
            >
              Submit Quiz
            </button>
          )}

          {/* Results Section */}
          {quizSubmitted && score !== null && (
            <div className="p-6 border border-emerald-200 rounded-xl bg-emerald-50/80 backdrop-blur-sm">
              <h2 className="text-2xl font-bold mb-3 text-emerald-800 flex items-center gap-2">
                <span className="text-3xl">🎉</span> Quiz Results
              </h2>
              <p className="text-lg text-gray-700 mb-2">
                You scored <strong className="text-emerald-700">{score}</strong>{" "}
                out of <strong>{questions.length}</strong> (
                {Math.round((score / questions.length) * 100)}%)
              </p>
              <p className="text-lg font-medium text-gray-800">
                {getPerformanceMessage((score / questions.length) * 100)}
              </p>
              {updateExperienceLevel && user?.id && (
                <p className="mt-3 text-sm text-gray-600">
                  Your experience level has been updated to:{" "}
                  <span className="font-semibold">
                    {calculateExperienceLevel(score, questions.length)}
                  </span>
                </p>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={loadQuestions}
              className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium rounded-xl hover:shadow-lg transition-all"
            >
              ↻ Take New Quiz
            </button>
            {quizSubmitted && (
              <button
                onClick={() => {
                  setShowCorrect(false);
                  setQuizSubmitted(false);
                  setTimeLeft(5 * 60);
                }}
                className="w-full px-6 py-3 bg-gray-200 text-gray-800 font-medium rounded-xl hover:bg-gray-300 transition-all"
              >
                Review Answers
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Quiz2;

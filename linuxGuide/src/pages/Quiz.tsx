import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext"; // Assuming you have an auth context

const Quiz: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [answers, setAnswers] = useState({
    sudo: "",
    terminal: "",
    kernel: "",
  });

  const handleChange = (e: any) => {
    setAnswers({ ...answers, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!user?.id) return alert("login first");

    try {
      const response = await api.post("/quiz/quiz", {
        userId: user.id,
        answers,
      });
      alert(
        `Your experience level is set to ${response.data.experience_level}`,
      );
      navigate("/for-you");
    } catch (err) {
      console.error("Quiz submission failed:", err);
      alert("Failed to submit quiz. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow flex justify-center p-8">
        <div className="w-full max-w-4xl">
          <h1 className="text-2xl font-bold mb-4">Linux Experience Quiz</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-1">
                Do you know what "sudo" does?
              </label>
              <select
                name="sudo"
                value={answers.sudo}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              >
                <option value="">Select</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>
            <div>
              <label className="block mb-1">
                Can you navigate the terminal effectively?
              </label>
              <select
                name="terminal"
                value={answers.terminal}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              >
                <option value="">Select</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>
            <div>
              <label className="block mb-1">
                Have you compiled a Linux kernel before?
              </label>
              <select
                name="kernel"
                value={answers.kernel}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              >
                <option value="">Select</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Submit Quiz
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default Quiz;

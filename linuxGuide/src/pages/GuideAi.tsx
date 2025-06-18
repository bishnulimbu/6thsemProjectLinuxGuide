import React, { useState } from "react";

// Main App component
const App: React.FC = () => {
  // State for the user's question input
  const [question, setQuestion] = useState<string>("");
  // State for the API key input
  // const [apiKey, setApiKey] = useState<string>("");
  // State for the AI's response
  const [answer, setAnswer] = useState<string>("");
  // State to manage loading status
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // State to store any error messages
  const [error, setError] = useState<string>("");
  const apiKey = "AIzaSyBnVy30G82BW1eYauFpCrlc-srhKp-3zWg";

  /**
   * Handles the submission of the question to the Gemini API.
   */
  const handleSubmit = async () => {
    // Clear previous errors and answers
    setError("");
    setAnswer("");
    setIsLoading(true); // Set loading state to true

    if (!question.trim()) {
      setError("Please enter a question.");
      setIsLoading(false);
      return;
    }

    try {
      // Prepare the chat history for the Gemini API request
      let chatHistory = [];
      chatHistory.push({ role: "user", parts: [{ text: question }] });

      // Define the payload for the API request
      const payload = {
        contents: chatHistory,
      };

      // Construct the API URL, using the provided apiKey
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

      // Make the fetch call to the Gemini API
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      // Check if the response was successful
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error?.message || `HTTP error! status: ${response.status}`,
        );
      }

      // Parse the JSON response
      const result = await response.json();

      // Extract the text from the response
      if (
        result.candidates &&
        result.candidates.length > 0 &&
        result.candidates[0].content &&
        result.candidates[0].content.parts &&
        result.candidates[0].content.parts.length > 0
      ) {
        setAnswer(result.candidates[0].content.parts[0].text);
      } else {
        setError("No valid response from the AI.");
      }
    } catch (err) {
      console.error("Error fetching AI response:", err);
      // Display a user-friendly error message
      setError(
        `Failed to get AI response: ${err instanceof Error ? err.message : String(err)}`,
      );
    } finally {
      setIsLoading(false); // Reset loading state
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-800 to-indigo-900 text-white flex items-center justify-center p-4 font-sans">
      <div className="bg-gray-800 bg-opacity-70 backdrop-blur-sm p-8 rounded-2xl shadow-2xl w-full max-w-lg space-y-6 border border-gray-700">
        <h1 className="text-4xl font-extrabold text-center text-purple-300 drop-shadow-lg">
          Ask the AI
        </h1>

        {/* Question Input */}
        <div>
          <label
            htmlFor="question"
            className="block text-gray-300 text-sm font-medium mb-2"
          >
            Your Question:
          </label>
          <textarea
            id="question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="E.g., What is the capital of France?"
            rows={4}
            className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200 ease-in-out resize-y"
          ></textarea>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className={`w-full p-3 rounded-lg font-bold text-lg transition duration-300 ease-in-out transform hover:scale-105
            ${
              isLoading
                ? "bg-purple-600 cursor-not-allowed opacity-70"
                : "bg-purple-700 hover:bg-purple-800 shadow-lg shadow-purple-900/50"
            }`}
        >
          {isLoading ? "Asking AI..." : "Ask AI"}
        </button>

        {/* Error Message Display */}
        {error && (
          <div className="bg-red-800 bg-opacity-70 p-3 rounded-lg text-red-200 text-sm text-center border border-red-700 shadow-md">
            Error: {error}
          </div>
        )}

        {/* AI Answer Display */}
        {answer && (
          <div className="bg-gray-700 bg-opacity-70 p-5 rounded-lg border border-gray-600 shadow-inner mt-6">
            <h2 className="text-xl font-semibold text-purple-300 mb-3">
              AI's Answer:
            </h2>
            <p className="text-gray-200 whitespace-pre-wrap">{answer}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;

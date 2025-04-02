import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getGuideById } from "../services/api"; // Updated import path
import { Guide } from "../interfaces/interface";
import katex from "katex";
import "katex/dist/katex.min.css";
import CommentSection from "../components/ui/CommentSection";

// Interface for User (to fetch username)
interface User {
  id: number;
  username: string;
}

const GuideDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [guide, setGuide] = useState<Guide | null>(null);
  const [author, setAuthor] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGuideById = async () => {
      if (!id) {
        setError("Guide ID is missing");
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const fetchData = await getGuideById(parseInt(id));
        setGuide(fetchData);

        // Fetch the author's username (mocked for now; replace with actual API call)
        // In a real app, you'd call an API like `getUserById(fetchData.userId)`
        const mockUser: User = {
          id: fetchData.userId,
          username: `User${fetchData.userId}`,
        };
        setAuthor(mockUser.username);
      } catch (err: any) {
        setError(err.message || "Failed to fetch guide."); // Fixed typo: messaege -> message
        toast.error(err.message || "Failed to fetch guide by id", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchGuideById();
  }, [id]);

  // Parsing and rendering LaTeX-like document
  const renderDescription = (description: string) => {
    const lines = description.split("\n"); // Fixed: "/n" -> "\n"
    let skipUntilEndVerbatim = false;

    return lines.map((line, index) => {
      // Skip lines inside verbatim blocks until \end{verbatim} is found
      if (skipUntilEndVerbatim) {
        if (line.startsWith("\\end{verbatim}")) {
          skipUntilEndVerbatim = false;
        }
        return null;
      }

      // Handle \section{...}
      if (line.startsWith("\\section{")) {
        const sectionTitle = line.match(/\\section\{(.+?)\}/)?.[1];
        return (
          <h2
            key={index}
            className="text-2xl font-bold text-gray-800 mt-6 mb-4"
          >
            {sectionTitle}
          </h2>
        );
      }

      // Handle \subsection{...}
      if (line.startsWith("\\subsection{")) {
        const subsectionTitle = line.match(/\\subsection\{(.+?)\}/)?.[1];
        return (
          <h3
            key={index}
            className="text-xl font-semibold text-gray-700 mt-4 mb-2" // Fixed: font=semibold -> font-semibold
          >
            {subsectionTitle}
          </h3>
        );
      }

      // Handle \texttt{...}
      if (line.includes("\\texttt{")) {
        const parts = line.split(/\\texttt\{(.+?)\}/g);
        return (
          <p key={index} className="text-gray-600 mb-2">
            {parts.map((part, i) =>
              i % 2 === 0 ? (
                part
              ) : (
                <code key={i} className="font-mono bg-gray-100 px-1 rounded">
                  {part}
                </code>
              ),
            )}
          </p>
        );
      }

      // Handle \begin{verbatim}...\end{verbatim}
      if (line.startsWith("\\begin{verbatim}")) {
        const codeLines: string[] = [];
        let nextIndex = index + 1;
        while (
          nextIndex < lines.length &&
          !lines[nextIndex].startsWith("\\end{verbatim}")
        ) {
          codeLines.push(lines[nextIndex]);
          nextIndex++;
        }
        skipUntilEndVerbatim = true; // Skip lines until \end{verbatim}
        return (
          <pre
            key={index}
            className="bg-gray-100 p-4 rounded-md font-mono text-sm text-gray-800 my-2 overflow-x-auto"
          >
            {codeLines.join("\n")}
          </pre>
        );
      }

      // Handle LaTeX equations with KaTeX
      if (line.startsWith("\\[")) {
        const equation = line.match(/\\\[(.+?)\\\]/)?.[1];
        if (equation) {
          const html = katex.renderToString(equation, {
            throwOnError: false,
            displayMode: true,
          });
          return (
            <div
              key={index}
              className="text-center my-4"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          );
        }
      }

      // Skip \end{verbatim} lines
      if (line.startsWith("\\end{verbatim}")) {
        return null;
      }

      // Render regular paragraphs
      if (line.trim()) {
        return (
          <p key={index} className="text-gray-600 mb-2">
            {line}
          </p>
        );
      }

      return null;
    });
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
        <p className="text-center text-gray-600">Loading guide...</p>
      </div>
    );
  }

  if (error || !guide) {
    return (
      <div className="max-w-4xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
        <p className="text-center text-red-600">{error || "Guide not found"}</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <button
        onClick={() => navigate("/guides")}
        className="mb-4 text-blue-600 hover:underline"
        aria-label="Back to Guides"
      >
        ← Back to Guides
      </button>
      <h1 className="text-3xl font-bold text-gray-800 mb-4">{guide.title}</h1>
      <div className="flex justify-between items-center mb-6">
        <div className="text-sm text-gray-500 space-y-1">
          <p>Created: {new Date(guide.createdAt).toLocaleDateString()}</p>
          <p>Author: {author || `User ${guide.userId}`}</p>
        </div>
        <span
          className={`text-sm px-2 py-1 rounded-full ${
            guide.status === "published"
              ? "bg-green-100 text-green-800"
              : "bg-yellow-100 text-yellow-800"
          }`}
        >
          {guide.status.charAt(0).toUpperCase() + guide.status.slice(1)}
        </span>
      </div>
      <div className="prose max-w-none">
        {renderDescription(guide.description)}
      </div>
      {/* Comment Section */}
      <CommentSection guideId={guide.id} />
    </div>
  );
};

export default GuideDetail;

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getGuideById } from "../services/api";
import { Guide } from "../interfaces/interface";
import ReactMarkdown from "react-markdown"; // New import
import CommentSection from "../components/ui/CommentSection";

const GuideDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [guide, setGuide] = useState<Guide | null>(null);
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
      } catch (err: any) {
        setError(err.message || "Failed to fetch guide.");
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
    <div className="max-w-4xl mx-auto mt-8 p-8 bg-white rounded-xl shadow-lg">
      {/* Back Button */}
      <button
        onClick={() => navigate("/guides")}
        className="flex items-center gap-1 text-blue-600 hover:text-blue-800 transition-colors mb-6"
        aria-label="Back to Guides"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
            clipRule="evenodd"
          />
        </svg>
        Back to Guides
      </button>

      {/* Guide Header */}
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{guide.title}</h1>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-gray-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              <span>{guide.User.username}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span>
                {new Date(guide.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
          </div>

          <span
            className={`text-sm font-medium px-3 py-1 rounded-full ${
              guide.status === "published"
                ? "bg-green-50 text-green-700 border border-green-200"
                : "bg-yellow-50 text-yellow-700 border border-yellow-200"
            }`}
          >
            {guide.status.charAt(0).toUpperCase() + guide.status.slice(1)}
          </span>
        </div>
      </header>

      {/* Guide Content */}
      <div className="prose max-w-none prose-lg mb-10">
        <ReactMarkdown>{guide.description}</ReactMarkdown>
      </div>

      {/* Comments Section */}
      <div className="border-t border-gray-200 pt-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Comments</h2>
        <CommentSection guideId={guide.id} />
      </div>
    </div>
  );
};

export default GuideDetail;

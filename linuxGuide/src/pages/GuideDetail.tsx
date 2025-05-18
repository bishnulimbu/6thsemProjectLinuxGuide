import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getGuideById } from "../services/api";
import { Guide } from "../interfaces/interface";
import ReactMarkdown from "react-markdown"; // New import
import CommentSection from "../components/ui/CommentSection";

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

        const mockUser: User = {
          id: fetchData.userId,
          username: `User${fetchData.userId}`,
        };
        setAuthor(mockUser.username);
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
          <p>Author: {guide.User.username}</p>
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
        <ReactMarkdown>{guide.description}</ReactMarkdown>
      </div>
      <CommentSection guideId={guide.id} />
    </div>
  );
};

export default GuideDetail;

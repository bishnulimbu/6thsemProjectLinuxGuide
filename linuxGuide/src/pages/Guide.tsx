import { Guide } from "../interfaces/interface";
import { useAuth } from "../context/AuthContext";
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getGuides } from "../services/api";
import { toast } from "react-toastify";

const Guides: React.FC = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [guides, setGuides] = useState<Guide[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch guides on mount
  useEffect(() => {
    const fetchGuides = async () => {
      setLoading(true);
      setError(null);
      try {
        const guidesData = await getGuides();
        // Filter guides: show all to admins, only published to others
        const filteredGuides = isAdmin
          ? guidesData
          : guidesData.filter((guide: Guide) => guide.status === "published");
        setGuides(filteredGuides);
      } catch (err: any) {
        setError(err.message || "Failed to fetch guides");
        toast.error(err.message || "Failed to fetch guides", {
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

    fetchGuides();
  }, [isAdmin]);

  return (
    <div className="max-w-6xl mx-auto mt-10 p-8 bg-white rounded-xl shadow-lg">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Guides</h2>
          <p className="text-gray-600 mt-1">Explore community-created guides</p>
        </div>
        {isAdmin && (
          <button
            onClick={() => navigate("/create-guide")}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md whitespace-nowrap"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
            Create Guide
          </button>
        )}
      </div>

      {/* Content Section */}
      {loading ? (
        <div className="flex justify-center items-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 p-4 rounded-lg text-center">
          <p className="text-red-600 font-medium">{error}</p>
        </div>
      ) : guides.length === 0 ? (
        <div className="bg-gray-50 p-8 rounded-lg text-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 mx-auto text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="text-gray-600 mt-4 text-lg">No guides available yet.</p>
          {isAdmin && (
            <button
              onClick={() => navigate("/create-guide")}
              className="mt-4 inline-block text-blue-600 hover:text-blue-800 font-medium"
            >
              Create the first guide
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {guides.map((guide) => (
            <Link
              to={`/guides/${guide.id}`}
              key={guide.id}
              className="group block p-6 bg-white border border-gray-200 rounded-xl hover:border-blue-200 hover:shadow-md transition-all duration-200"
            >
              <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-blue-600 transition-colors">
                {guide.title}
              </h3>
              <p className="text-gray-600 line-clamp-3 mb-4">
                {guide.description}
              </p>
              <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                <p className="text-sm text-gray-500">
                  {new Date(guide.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
                <span
                  className={`text-xs font-medium px-3 py-1 rounded-full ${
                    guide.status === "published"
                      ? "bg-green-50 text-green-700 group-hover:bg-green-100"
                      : "bg-yellow-50 text-yellow-700 group-hover:bg-yellow-100"
                  }`}
                >
                  {guide.status.charAt(0).toUpperCase() + guide.status.slice(1)}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Guides;

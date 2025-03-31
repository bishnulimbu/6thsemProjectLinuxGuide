import { Guide } from "../interfaces/interface";
import { useAuth } from "../context/AuthContext";
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getGuides } from "../services/api";
import { toast } from "react-toastify";

const Guides: React.FC = () => {
  const { isAdmin, isAuthenticated } = useAuth();
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
    <div className="max-w-6xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Guides</h2>
        {isAdmin && (
          <button
            onClick={() => navigate("/create-guide")}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
          >
            Create Guide
          </button>
        )}
      </div>

      {loading ? (
        <p className="text-center text-gray-600">Loading guides...</p>
      ) : error ? (
        <p className="text-center text-red-600">{error}</p>
      ) : guides.length === 0 ? (
        <p className="text-center text-gray-600">No guides available.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {guides.map((guide) => (
            <Link
              to={`/guides/${guide.id}`}
              key={guide.id}
              className="block p-6 bg-gray-50 rounded-lg shadow-sm hover:shadow-md transition"
            >
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {guide.title}
              </h3>
              <p className="text-gray-600 line-clamp-3">{guide.description}</p>
              <div className="mt-2 flex justify-between items-center">
                <p className="text-sm text-gray-500">
                  Created: {new Date(guide.createdAt).toLocaleDateString()}
                </p>
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
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Guides;

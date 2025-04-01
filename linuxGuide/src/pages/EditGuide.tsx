import React, { useState, useEffect } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import { getGuideById, updateGuide } from "../services/api"; // Assuming updateGuide is added to api.tsx
import { Guide } from "../interfaces/interface";

const EditGuide: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Get guide ID from URL
  const { isAdmin, isLoading } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "draft" as "draft" | "published",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Redirect if not an admin
  useEffect(() => {
    if (!isLoading && !isAdmin) {
      toast.error("You are not authorized to access this page.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
      navigate("/");
    }
  }, [isAdmin, isLoading, navigate]);

  // Fetch guide data
  useEffect(() => {
    const fetchGuide = async () => {
      if (!id || !isAdmin) return;
      setLoading(true);
      setError(null);
      try {
        const guide: Guide = await getGuideById(parseInt(id));
        setFormData({
          title: guide.title,
          description: guide.description,
          status: guide.status,
        });
      } catch (err: any) {
        setError("Failed to fetch guide. Please try again.");
        toast.error("Failed to fetch guide", {
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
    fetchGuide();
  }, [id, isAdmin]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { title, description, status } = formData;

    if (!title || !description) {
      setError("Title and description are required.");
      setLoading(false);
      return;
    }

    try {
      await updateGuide(parseInt(id!), { title, description, status });
      toast.success("Guide updated successfully!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
      navigate("/admin");
    } catch (err: any) {
      const errorMessage = err.message || "Failed to update guide.";
      setError(errorMessage);
      toast.error(errorMessage, {
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

  if (isLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-gray-600 text-lg">Loading...</p>
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-lg bg-white rounded-xl shadow-lg p-6 sm:p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Edit Guide
        </h2>
        {error && (
          <p className="text-red-600 mb-4 text-center" role="alert">
            {error}
          </p>
        )}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="flex flex-col">
            <label
              htmlFor="title"
              className="text-sm font-medium text-gray-700 mb-1.5"
            >
              Title
            </label>
            <input
              id="title"
              name="title"
              type="text"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="Enter guide title"
              className="p-3 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
              disabled={loading}
            />
          </div>
          <div className="flex flex-col">
            <label
              htmlFor="description"
              className="text-sm font-medium text-gray-700 mb-1.5"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              placeholder="Enter guide description"
              rows={5}
              className="p-3 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 resize-y"
              disabled={loading}
            />
          </div>
          <div className="flex flex-col">
            <label
              htmlFor="status"
              className="text-sm font-medium text-gray-700 mb-1.5"
            >
              Status
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="p-3 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
              disabled={loading}
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2.5 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 ${
              loading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Updating..." : "Update Guide"}
          </button>
        </form>
        <p className="text-sm text-gray-600 mt-4 text-center">
          Back to{" "}
          <Link
            to="/admin"
            className="text-blue-600 hover:underline font-medium"
          >
            Admin Dashboard
          </Link>
        </p>
      </div>
    </div>
  );
};

export default EditGuide;

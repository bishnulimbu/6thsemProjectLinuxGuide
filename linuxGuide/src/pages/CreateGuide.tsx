import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import { createGuide } from "../services/api"; // Assuming createGuide is added to api.tsx
import MDEditor from "@uiw/react-md-editor";

const CreateGuide: React.FC = () => {
  const { isAdmin, isLoading } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    level: "beginner",
    status: "draft" as "draft" | "published",
  });
  const [loading, setLoading] = useState(false);
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
      await createGuide({ title, description, status });
      toast.success("Guide created successfully!", {
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
      const errorMessage = err.message || "Failed to create guide.";
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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-gray-600 text-lg">Loading...</p>
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen  flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-200 p-6">
      <div className="w-full max-w-full bg-white rounded-2xl shadow-xl p-8 sm:p-10 transform transition-all hover:shadow-2xl">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-8 text-center tracking-tight">
          Create New Guide
        </h2>
        {error && (
          <p
            className="text-red-500 bg-red-50 border border-red-200 rounded-lg px-4 py-2 mb-6 text-center font-medium"
            role="alert"
          >
            {error}
          </p>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col">
            <label
              htmlFor="title"
              className="text-sm font-semibold text-gray-800 mb-2"
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
              className="p-4 bg-gray-100 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 ease-in-out"
              disabled={loading}
            />
          </div>
          <div className="flex flex-col">
            <label
              htmlFor="description"
              className="text-sm font-semibold text-gray-800 mb-2"
            >
              Description (Markdown)
            </label>

            {/* Markdown Editor */}
            <div
              data-color-mode="light"
              className="bg-white rounded-xl border border-gray-300 p-2 mb-4"
            >
              <MDEditor
                value={formData.description}
                onChange={(val) =>
                  setFormData((prev) => ({ ...prev, description: val || "" }))
                }
                height={300}
                preview="edit"
              />
            </div>
          </div>
          <div className="flex flex-col">
            <label
              htmlFor="level"
              className="text-sm font-semibold text-gray-800 mb-2"
            >
              Level
            </label>
            <select
              id="level"
              name="level"
              value={formData.level}
              onChange={handleChange}
              className="p-4 bg-gray-100 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 ease-in-out"
              required
              disabled={loading}
            >
              <option value="beginner">Beginner</option>
              <option value="novice">Novice</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
          <div className="flex flex-col">
            <label
              htmlFor="status"
              className="text-sm font-semibold text-gray-800 mb-2"
            >
              Status
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="p-4 bg-gray-100 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 ease-in-out"
              disabled={loading}
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-xl text-white font-semibold text-lg focus:outline-none focus:ring-4 focus:ring-indigo-300 transition-all duration-300 ease-in-out ${
              loading
                ? "bg-indigo-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800"
            }`}
          >
            {loading ? "Creating..." : "Create Guide"}
          </button>
        </form>
        <p className="text-sm text-gray-500 mt-6 text-center">
          Back to{" "}
          <Link
            to="/admin"
            className="text-indigo-600 hover:text-indigo-800 font-semibold transition-colors duration-200"
          >
            Admin Dashboard
          </Link>
        </p>
      </div>
    </div>
  );
};

export default CreateGuide;

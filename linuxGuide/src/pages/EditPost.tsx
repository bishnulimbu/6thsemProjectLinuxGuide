import React, { useState, useEffect } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import { getPostById, updatePost } from "../services/api"; // Fixed import path
import { Post, Tag } from "../interfaces/interface";

const EditPost: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Get post ID from URL
  const { isAdmin, isLoading } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    Tags: [] as Tag[], // Use Tags to match the Post interface
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

  // Fetch post data
  useEffect(() => {
    const fetchPost = async () => {
      if (!id || !isAdmin) return;
      setLoading(true);
      setError(null);
      try {
        const post: Post = await getPostById(parseInt(id));
        setFormData({
          title: post.title,
          content: post.content,
          Tags: post.Tags || [], // Use Tags to match the Post interface
        });
      } catch (err: any) {
        setError("Failed to fetch post. Please try again.");
        toast.error("Failed to fetch post", {
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
    fetchPost();
  }, [id, isAdmin]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Convert comma-separated string to array of tag names
    const tagNames = e.target.value
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag);

    // Convert tag names to Tag objects (assuming the backend expects Tag objects with name property)
    // Note: Since we're editing, we might not have the tag IDs, so we'll send only the names
    // The backend will need to handle creating or finding tags based on names
    const newTags: Tag[] = tagNames.map((name, index) => ({
      id: formData.Tags[index]?.id || 0, // Preserve existing tag IDs if available, otherwise use 0 (backend will handle)
      name,
    }));
    setFormData((prev) => ({ ...prev, Tags: newTags }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { title, content, Tags } = formData;

    if (!title || !content) {
      setError("Title and content are required.");
      setLoading(false);
      return;
    }

    try {
      // Convert Tags to the format expected by the backend (array of tag names)
      // The backend will handle finding or creating tags and associating them with the post
      const tagNames = Tags.map((tag) => tag.name);
      await updatePost(parseInt(id!), { title, content, tags: tagNames });
      toast.success("Post updated successfully!", {
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
      const errorMessage = err.message || "Failed to update post.";
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
          Edit Post
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
              placeholder="Enter post title"
              className="p-3 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
              disabled={loading}
            />
          </div>
          <div className="flex flex-col">
            <label
              htmlFor="content"
              className="text-sm font-medium text-gray-700 mb-1.5"
            >
              Content
            </label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              required
              placeholder="Enter post content"
              rows={5}
              className="p-3 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 resize-y"
              disabled={loading}
            />
          </div>
          <div className="flex flex-col">
            <label
              htmlFor="tags"
              className="text-sm font-medium text-gray-700 mb-1.5"
            >
              Tags (comma-separated)
            </label>
            <input
              id="tags"
              name="tags"
              type="text"
              value={formData.Tags.map((tag) => tag.name).join(", ")} // Display tag names
              onChange={handleTagsChange}
              placeholder="Enter tags (e.g., linux, tutorial)"
              className="p-3 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
              disabled={loading}
            />
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
            {loading ? "Updating..." : "Update Post"}
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

export default EditPost;

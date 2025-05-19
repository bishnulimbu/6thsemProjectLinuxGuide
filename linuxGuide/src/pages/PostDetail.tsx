import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { getPostById } from "../services/api";
import { Post } from "../interfaces/interface";
import CommentSection from "../components/ui/CommentSection";

const PostDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Get the post ID from the URL
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch the post when the component mounts
  useEffect(() => {
    const fetchPost = async () => {
      if (!id) {
        setError("Invalid post ID.");
        setLoading(false);
        return;
      }

      try {
        const postData = await getPostById(parseInt(id));
        setPost(postData);
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.error || err.message || "Failed to fetch post.";
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

    fetchPost();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <p className="text-gray-700 text-lg">Loading...</p>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md text-center">
          <p className="text-red-600 mb-4">{error || "Post not found."}</p>
          <Link
            to="/posts"
            className="inline-block bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Back to Posts
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Post Header */}
        <div className="bg-gradient-to-r from-blue-50 to-gray-50 p-6 sm:p-8 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                {post.title}
              </h1>
              <div className="flex flex-wrap items-center text-gray-600 mt-2 gap-x-4 gap-y-2">
                <div className="flex items-center">
                  <svg
                    className="w-4 h-4 mr-1.5 text-gray-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                  </svg>
                  <span className="text-gray-700">
                    {post.User?.username || "Unknown"}
                  </span>
                </div>
                <div className="flex items-center">
                  <svg
                    className="w-4 h-4 mr-1.5 text-gray-400"
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
                  <span className="text-gray-700">
                    {new Date(post.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
              </div>
            </div>
            {post.Tags && post.Tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {post.Tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium"
                  >
                    {tag.name}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Post Content */}
        <div className="p-6 sm:p-8">
          <div className="prose max-w-none text-gray-700 mb-8">
            {post.content}
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 border-t border-gray-200">
            <Link
              to="/posts"
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white text-blue-600 px-5 py-2.5 rounded-lg border border-blue-600 hover:bg-blue-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Back to Posts
            </Link>

            {/* Social Sharing */}
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600">Share:</span>
              <button className="text-gray-500 hover:text-blue-500 transition-colors">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                </svg>
              </button>
              <button className="text-gray-500 hover:text-blue-400 transition-colors">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Comment Section */}
        <div className="border-t border-gray-200 p-6 sm:p-8 bg-gray-50">
          <CommentSection postId={post.id} />
        </div>
      </div>
    </div>
  );
};

export default PostDetail;

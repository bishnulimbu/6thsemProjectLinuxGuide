import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { getPostById } from "../services/api";
import { Post } from "../interfaces/interface";

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
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <p className="text-gray-600 text-lg">Loading...</p>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
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
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-4xl p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">{post.title}</h1>
        <div className="flex flex-wrap items-center text-gray-600 mb-4">
          <p>
            By{" "}
            <span className="font-semibold">
              {post.User?.username || "Unknown"}
            </span>
          </p>
          <span className="mx-2">•</span>
          <p>{new Date(post.createdAt).toLocaleDateString()}</p>
        </div>
        {post.Tags && post.Tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {post.Tags.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
              >
                {tag.name}
              </span>
            ))}
          </div>
        )}
        <div className="prose max-w-none text-gray-700 mb-8">
          <p>{post.content}</p>
        </div>
        <Link
          to="/posts"
          className="inline-block bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Back to Posts
        </Link>
      </div>
    </div>
  );
};

export default PostDetail;

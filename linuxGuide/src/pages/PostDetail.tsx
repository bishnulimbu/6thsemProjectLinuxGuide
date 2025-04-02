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
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6 sm:p-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
          {post.title}
        </h1>
        <div className="flex flex-wrap items-center text-gray-600 mb-4 gap-2">
          <p className="text-gray-700">
            By{" "}
            <span className="font-semibold">
              {post.User?.username || "Unknown"}
            </span>
          </p>
          <span className="text-gray-400">•</span>
          <p className="text-gray-700">
            {new Date(post.createdAt).toLocaleDateString()}
          </p>
        </div>
        {post.Tags && post.Tags.length > 0 && (
          <div className="flex flex-wrap gap-3 mb-6">
            {post.Tags.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
              >
                {tag.name}
              </span>
            ))}
          </div>
        )}
        <div className="prose max-w-none text-gray-800 mb-8">
          <p>{post.content}</p>
        </div>
        <div className="flex justify-center sm:justify-start">
          <Link
            to="/posts"
            className="w-full sm:w-auto text-center bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Back to Posts
          </Link>
        </div>
        {/* Comment Section */}
        <div className="mt-12">
          <CommentSection postId={post.id} />{" "}
          {/* Fixed: Pass postId, not guideId */}
        </div>
      </div>
    </div>
  );
};

export default PostDetail;

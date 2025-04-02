import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import {
  getCommentsForPost,
  getCommentsForGuide,
  createComment,
  deleteComment,
} from "../../services/api"; // API functions for comments
import { Comment } from "../../interfaces/interface";

interface CommentSectionProps {
  guideId?: number; // Optional guideId for Guide page
  postId?: number; // Optional postId for Post page
}

const CommentSection: React.FC<CommentSectionProps> = ({ guideId, postId }) => {
  const { token, user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false); // Added for comment submission
  const [deleting, setDeleting] = useState<number | null>(null); // Added for comment deletion
  const [error, setError] = useState<string | null>(null);

  // Fetch comments when the component mounts or when token changes
  useEffect(() => {
    const fetchComments = async () => {
      setLoading(true);
      setError(null);

      // Validate that exactly one of guideId or postId is provided
      if (guideId && postId) {
        setError("Invalid configuration: Both guideId and postId provided");
        setLoading(false);
        return;
      }
      if (!guideId && !postId) {
        setError("Invalid configuration: Neither guideId nor postId provided");
        setLoading(false);
        return;
      }

      try {
        let fetchedComments: Comment[] = [];
        if (guideId) {
          fetchedComments = await getCommentsForGuide(guideId);
        } else if (postId) {
          fetchedComments = await getCommentsForPost(postId);
        }
        setComments(fetchedComments);
      } catch (err: any) {
        setError("Failed to fetch comments");
        toast.error("Failed to fetch comments", {
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

    fetchComments();
  }, [guideId, postId, token]); // Added token to dependencies

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      toast.error("Please log in to add a comment", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
      return;
    }

    if (!newComment.trim()) {
      setError("Comment cannot be empty");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const commentData = {
        content: newComment,
        guideId: guideId || null,
        postId: postId || null,
      };
      const createdComment = await createComment(commentData);
      setComments([...comments, createdComment]);
      setNewComment("");
      toast.success("Comment added successfully", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
    } catch (err: any) {
      setError("Failed to add comment");
      toast.error("Failed to add comment", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (commentId: number) => {
    if (!token) {
      toast.error("Please log in to delete a comment", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
      return;
    }

    setDeleting(commentId);

    try {
      await deleteComment(commentId);
      setComments(comments.filter((comment) => comment.id !== commentId));
      toast.success("Comment deleted successfully", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
    } catch (err: any) {
      toast.error("Failed to delete comment", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
    } finally {
      setDeleting(null);
    }
  };

  const isSuperAdmin = user?.role === "super_admin";

  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Comments</h3>

      {/* Display Comments */}
      {loading ? (
        <p className="text-gray-600">Loading comments...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : comments.length === 0 ? (
        <p className="text-gray-600">
          No comments yet. Be the first to comment!
        </p>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div
              key={comment.id}
              className="p-4 bg-gray-50 rounded-lg shadow-sm"
            >
              <div className="flex justify-between items-center mb-2">
                <p className="text-sm font-medium text-gray-700">
                  {comment.User?.username || "Anonymous"}
                </p>
                <div className="flex items-center space-x-2">
                  <p className="text-sm text-gray-500">
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </p>
                  {(comment.userId === user?.id || isSuperAdmin) && (
                    <button
                      onClick={() => handleDelete(comment.id)}
                      className="text-red-600 hover:text-red-800 text-sm disabled:opacity-50"
                      disabled={deleting === comment.id}
                    >
                      {deleting === comment.id ? "Deleting..." : "Delete"}
                    </button>
                  )}
                </div>
              </div>
              <p className="text-gray-800">{comment.content}</p>
            </div>
          ))}
        </div>
      )}

      {/* Add Comment Form */}
      {token && (
        <form onSubmit={handleSubmit} className="mt-6">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            rows={3}
            className="w-full p-3 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 resize-y"
            disabled={submitting}
          />
          {error && (
            <p className="text-red-600 mt-2" role="alert">
              {error}
            </p>
          )}
          <button
            type="submit"
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50"
            disabled={submitting}
          >
            {submitting ? "Posting..." : "Post Comment"}
          </button>
        </form>
      )}
    </div>
  );
};

export default CommentSection;

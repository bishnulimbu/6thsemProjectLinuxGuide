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
    <div className="mt-10">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-semibold text-gray-900">Comments</h3>
        <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm">
          {comments.length} {comments.length === 1 ? "comment" : "comments"}
        </span>
      </div>

      {/* Display Comments */}
      {loading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 p-4 rounded-lg mb-6">
          <p className="text-red-600 font-medium">{error}</p>
        </div>
      ) : comments.length === 0 ? (
        <div className="bg-gray-50 p-6 rounded-lg text-center mb-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-10 w-10 mx-auto text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
          <p className="text-gray-600 mt-3">
            No comments yet. Be the first to comment!
          </p>
        </div>
      ) : (
        <div className="space-y-5 mb-8">
          {comments.map((comment) => (
            <div
              key={comment.id}
              className="p-5 bg-white rounded-xl shadow-sm border border-gray-100 hover:border-blue-100 transition-colors duration-200"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-100 text-blue-800 w-8 h-8 rounded-full flex items-center justify-center font-medium text-sm">
                    {comment.User?.username?.charAt(0).toUpperCase() || "A"}
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">
                      {comment.User?.username || "Anonymous"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(comment.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
                {(comment.userId === user?.id || isSuperAdmin) && (
                  <button
                    onClick={() => handleDelete(comment.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors duration-200 p-1"
                    disabled={deleting === comment.id}
                    aria-label="Delete comment"
                  >
                    {deleting === comment.id ? (
                      <svg
                        className="h-4 w-4 animate-spin"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                    ) : (
                      <svg
                        className="h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    )}
                  </button>
                )}
              </div>
              <p className="text-gray-700 pl-11">{comment.content}</p>
            </div>
          ))}
        </div>
      )}

      {/* Add Comment Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-5 rounded-xl shadow-sm border border-gray-100"
      >
        <label
          htmlFor="comment"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Add your comment
        </label>
        <textarea
          id="comment"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Share your thoughts..."
          rows={4}
          className="w-full px-4 py-3 bg-gray-50 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
          disabled={submitting}
        />
        {error && (
          <p className="text-red-600 text-sm mt-2" role="alert">
            {error}
          </p>
        )}
        <div className="flex justify-end mt-4">
          <button
            type="submit"
            className="inline-flex items-center px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50"
            disabled={submitting || !newComment.trim()}
          >
            {submitting ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Posting...
              </>
            ) : (
              "Post Comment"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CommentSection;

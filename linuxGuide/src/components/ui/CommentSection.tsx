import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";

import {
  getCommentsForGuide,
  getCommentsForPost,
  createCommentForPost,
  createCommentForGuide,
  deleteComment,
} from "../../api/axios";
import { toast } from "react-toastify";

interface Comment {
  id: number;
  content: string;
  userId?: number;
  guideI?: number;
  postId?: number;
  createdAt: string;
  User: { username: string };
}

interface CommentSectionProps {
  guideId?: number;
  postId?: number;
}
const CommentSection: React.FC<CommentSectionProps> = ({ guideId, postId }) => {
  const [comments, setComments] = useState<Comment[]>([]); //defining a array object
  const [newComment, setNewComment] = useState("");
  const { userId, token } = useAuth();

  useEffect(() => {
    const fetchComments = async () => {
      try {
        let data;
        if (guideId) {
          data = await getCommentsForGuide(guideId);
        } else if (postId) {
          data = await getCommentsForPost(postId);
        }
        setComments(data);
      } catch (err: any) {
        toast.error(err.response?.data?.error || "Failed to fetch Comments");
      }
    };
    fetchComments();
  }, [guideId, postId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      toast.error("Please log in to post a comment");
      return;
    }
    try {
      let comment;
      if (guideId) {
        comment = await createCommentForGuide(guideId, newComment);
      } else if (postId) {
        comment = await createCommentForPost(postId, newComment);
      }
      setComments([...comments, comment]);
      setNewComment("");
      toast.success("Comment posted!");
    } catch (err: any) {
      toast.error(err.reponse?.data?.error || "Falied to post comment");
    }
  };

  const handleDelete = async (commentId: number) => {
    try {
      await deleteComment(commentId);
      setComments(comments.filter((comment) => comment.id !== commentId));
      toast.success("comment deleted!");
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to delete comment");
    }
  };

  return (
    <div className="comment-section">
      <h3>Comments</h3>
      {comments.length === 0 ? (
        <p>No comments yet.</p>
      ) : (
        <ul>
          {comments.map((comment) => (
            <li key={comment.id}>
              <p>{comment.content}</p>
              <p>
                By {comment.User.username} on{" "}
                {new Date(comment.createdAt).toLocaleDateString()}
              </p>
              {userId && (userId === comment.userId || userId === 1) && (
                <button onClick={() => handleDelete(comment.id)}>Delete</button>
              )}
            </li>
          ))}
        </ul>
      )}
      {token && (
        <form onSubmit={handleSubmit}>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            required
          />
          <button type="submit">Post Comment</button>
        </form>
      )}
    </div>
  );
};

export default CommentSection;

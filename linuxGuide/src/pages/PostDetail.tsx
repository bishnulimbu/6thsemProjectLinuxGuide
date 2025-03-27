// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import ReactMarkdown from "react-markdown";
// import {
//   getPostById,
//   getComments,
//   createComment,
//   deleteComment,
// } from "../services/api";
// import { toast } from "react-toastify";
// import { useAuth } from "../context/AuthContext";
//
// interface Post {
//   id: number;
//   title: string;
//   content: string;
//   tags: string;
//   status: "draft" | "published" | "archived";
//   userId: number;
//   createdAt: string;
//   updatedAt: string;
//   User: { username: string };
// }
//
// interface Comment {
//   id: number;
//   content: string;
//   userId: number;
//   guideId: number | null;
//   postId: number | null;
//   createdAt: string;
//   User: { username: string };
// }
//
// const PostDetail: React.FC = () => {
//   const { id } = useParams<{ id: string }>();
//   const { userId, role } = useAuth();
//   const navigate = useNavigate();
//   const [post, setPost] = useState<Post | null>(null);
//   const [comments, setComments] = useState<Comment[]>([]);
//   const [newComment, setNewComment] = useState("");
//   const [loading, setLoading] = useState(true);
//
//   useEffect(() => {
//     const fetchPostAndComments = async () => {
//       try {
//         const [postData, commentsData] = await Promise.all([
//           getPostById(Number(id)),
//           getComments(undefined, Number(id)),
//         ]);
//         setPost(postData);
//         setComments(commentsData);
//       } catch (err: any) {
//         toast.error(
//           err.response?.data?.error || "Failed to fetch post or comments",
//         );
//         if (err.response?.status === 404) {
//           navigate("/not-found");
//         }
//       } finally {
//         setLoading(false);
//       }
//     };
//
//     fetchPostAndComments();
//   }, [id, navigate]);
//
//   const handleCommentSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!newComment.trim()) {
//       toast.error("Comment cannot be empty");
//       return;
//     }
//
//     try {
//       const comment = await createComment({
//         content: newComment,
//         postId: Number(id),
//       });
//       setComments([comment, ...comments]);
//       setNewComment("");
//       toast.success("Comment added successfully");
//     } catch (err: any) {
//       toast.error(err.response?.data?.error || "Failed to add comment");
//     }
//   };
//
//   const handleDeleteComment = async (commentId: number) => {
//     try {
//       await deleteComment(commentId);
//       setComments(comments.filter((comment) => comment.id !== commentId));
//       toast.success("Comment deleted successfully");
//     } catch (err: any) {
//       toast.error(err.response?.data?.error || "Failed to delete comment");
//     }
//   };
//
//   if (loading) {
//     return <div>Loading...</div>;
//   }
//
//   if (!post) {
//     return <div>Post not found</div>;
//   }
//
//   return (
//     <div className="mt-5">
//       <h1 className="text-3xl font-bold">{post.title}</h1>
//       <p className="mt-2">
//         By <strong>{post.User.username}</strong> on{" "}
//         {new Date(post.createdAt).toLocaleDateString()} | Tags: {post.tags} |
//         Status: {post.status}
//       </p>
//       <div className="border border-gray-200 p-5 rounded-md mt-2">
//         <ReactMarkdown>{post.content}</ReactMarkdown>
//       </div>
//
//       <div className="mt-10">
//         <h2 className="text-2xl font-semibold">Comments</h2>
//         {userId ? (
//           <form
//             onSubmit={handleCommentSubmit}
//             className="flex flex-col gap-2 mb-5"
//           >
//             <textarea
//               value={newComment}
//               onChange={(e) => setNewComment(e.target.value)}
//               placeholder="Add a comment..."
//               className="p-2 border border-gray-200 rounded-md min-h-[100px]"
//               required
//             />
//             <button
//               type="submit"
//               className="p-2 bg-blue-500 text-white border-none rounded-md cursor-pointer hover:bg-blue-600"
//             >
//               Post Comment
//             </button>
//           </form>
//         ) : (
//           <p>Please log in to add a comment.</p>
//         )}
//
//         {comments.length === 0 ? (
//           <p>No comments yet.</p>
//         ) : (
//           <ul className="list-none p-0">
//             {comments.map((comment) => (
//               <li
//                 key={comment.id}
//                 className="border border-gray-200 p-2 mb-2 rounded-md"
//               >
//                 <p>{comment.content}</p>
//                 <p>
//                   By <strong>{comment.User.username}</strong> on{" "}
//                   {new Date(comment.createdAt).toLocaleDateString()}
//                 </p>
//                 {(comment.userId === userId || role === "super_admin") && (
//                   <button
//                     onClick={() => handleDeleteComment(comment.id)}
//                     className="bg-red-500 text-white border-none py-1 px-2 rounded-md cursor-pointer hover:bg-red-600"
//                   >
//                     Delete
//                   </button>
//                 )}
//               </li>
//             ))}
//           </ul>
//         )}
//       </div>
//     </div>
//   );
// };
//
// export default PostDetail;

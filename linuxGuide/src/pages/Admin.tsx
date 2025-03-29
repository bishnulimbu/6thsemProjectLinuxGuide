import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import { User, Guide, Post, Comment } from "../interfaces/interface";
import {
  getUsers,
  deleteUser,
  getGuides,
  deleteGuide,
  getPosts,
  deleteComment,
  getCommentsForGuide,
  getCommentsForPost,
} from "../services/api";
import { HiH1 } from "react-icons/hi2";

const Admin: React.FC = () => {
  const { isSuperAdmin } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [guides, setGuides] = useState<Guide[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isSuperAdmin) {
      toast.error("Access denied. Super admin only.", {
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
  }, [isSuperAdmin, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      if (!isSuperAdmin) return;
      setLoading(true);
      try {
        const usersData = await getUsers();
        setUsers(usersData);

        const guidesData = await getGuides();
        setGuides(guidesData);

        const postsData = await getPosts();
        setPosts(postsData);

        const allComments: Comment[] = [];
        for (const guide of guidesData) {
          const guideComments = await getCommentsForGuide(guide.id);
          allComments.push(...guideComments);
        }
        for (const post of postsData) {
          const postComments = await getCommentsForPost(post.id);
          allComments.push(...postComments);
        }
        setComments(allComments);
      } catch (err: any) {
        toast.error(err.message || "Falied to fetch data", {
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
    fetchData();
  }, [isSuperAdmin]);

  const handleDeleteUser = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await deleteUser(id);
      setUsers(users.filter((user) => user.id !== id));
      toast.success("User deleted successfully", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
    } catch (err: any) {
      toast.error(err.message || "Failed to delete user", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
    }
  };

  const handleDeleteGuide = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this guide?")) return;
    try {
      await deleteGuide(id);
      setGuides(guides.filter((guide) => guide.id !== id));
      toast.success("Guide deleted successfully.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
    } catch (err: any) {
      toast.error(err.messagee || "Failed to delte guide", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
    }
  };
  // const handleDeletePost = async (id: number) => {
  //   if (!window.confirm("Are you sure you want to delete this guide?")) return;
  //   try {
  //     await api.delete(`posts/${id}`);
  //     setPosts(posts.filter((post) => post.id !== id));
  //   } catch (err: any) {}
  // };

  return <h1>hello</h1>;
};

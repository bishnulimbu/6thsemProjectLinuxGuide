import React from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { Link } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./styles/global.css";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";

const App = () => {
  return (
    <AuthProvider>
      <div className="App">
        <Navbar />
        <AppRoutes />
        <Footer />
        <ToastContainer />
      </div>
    </AuthProvider>
  );
};

export default App;

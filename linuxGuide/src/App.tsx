import { AuthProvider } from "./context/AuthContext";
import Footer from "./components/layout/Footer";
import Navbar from "./components/layout/Navbar";
import AppRoutes from "./routes/AppRoutes";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./styles/tailwind.css";
import { BrowserRouter as Router } from "react-router-dom";

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="max-w-6xl mx-auto p-5 min-h-screen flex flex-col">
          <Navbar />
          <AppRoutes />
          <Footer />
          <ToastContainer />
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;

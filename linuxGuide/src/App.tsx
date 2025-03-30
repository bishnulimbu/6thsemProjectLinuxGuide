import Footer from "./components/layout/Footer";
import Navbar from "./components/layout/Navbar";
import { BrowserRouter as Router } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import AppRoutes from "./routes/AppRoutes";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./styles/tailwind.css";

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="max-w-full mx-auto p-5 min-h-screen flex flex-col">
          <Navbar />
          <AppRoutes />
          <Footer />
          <ToastContainer
            toastClassName="rounded-md shadow-md p-4 bg-white text-gray-800"
            progressClassName="bg-blue-500"
          />
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;

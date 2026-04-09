import Dashboard from "./pages/Dashboard.tsx";
import Login from "./pages/Login.tsx";
import Subscribe from "./pages/Subscribe.tsx";
import Navbar from "./components/Navbar.tsx";
import { Route, Routes, useLocation, Navigate } from "react-router-dom";
import NotFound from "./components/NotFound.tsx";
import { AnimatePresence } from "framer-motion";
import Modal from "./components/Modal.tsx";
import { useState } from "react";
import Footer from "./components/Footer.tsx";
import { useAuthContext } from "./hooks/useAuthContext.tsx";
import Home from "./pages/Home.tsx";

export default function App() {
  const { user } = useAuthContext();
  const location = useLocation();
  const [showModal, setShowModal] = useState<boolean>(false);

  return (
    <div className="App">
      <Navbar />
      <Modal showModal={showModal} />
      <AnimatePresence mode="wait">
        <div className="content">
          <Routes location={location} key={location.key}>
            <Route
              path="/dashboard"
              element={
                user ? (
                  <Dashboard setShowModal={setShowModal} />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
            <Route
              path="/login"
              element={!user ? <Login /> : <Navigate to="/dashboard" />}
            />
            <Route
              path="/subscribe"
              element={!user ? <Subscribe /> : <Navigate to="/dashboard" />}
            />
            <Route path="/" element={<Home setShowModal={setShowModal} />} />
            <Route path="*" element={<NotFound />} />
            
          </Routes>
        </div>
      </AnimatePresence>
      <Footer />
    </div>
  );
}
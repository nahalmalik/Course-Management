// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Courses from "./pages/Courses";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CourseDetail from "./pages/CourseDetail";
import StudentDashboard from "./pages/StudentDashboard";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import { CartProvider } from "./contexts/CartContext"; 

function App() {
  return (
    <CartProvider> 
      <Router>
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/courses/:id" element={<CourseDetail />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/student-dashboard" element={<StudentDashboard />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            {/* Do NOT render CartSidebar here directly */}
          </Routes>
        </main>
        <Footer />
      </Router>
    </CartProvider>
  );
}

export default App;

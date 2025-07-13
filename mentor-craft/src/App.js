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
import Register from "./pages/InstructorDashboard";
import CourseDetail from "./pages/CourseDetail";
import StudentDashboard from "./pages/StudentDashboard";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import { CartProvider } from "./contexts/CartContext"; 
import Receipt from "./pages/Receipt";
import Signup from './pages/Signup';
import BecomeInstructor from './pages/BecomeInstructor';
import ForgotPassword from "./pages/ForgotPassword";
import InstructorCourseDetail from "./pages/InstructorCourseDetail";
import CreateCourse from "./pages/CreateCourse";

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
            <Route path="/instructor-dashboard" element={<Register />} />     
            <Route path="/student-dashboard" element={<StudentDashboard />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/receipt/:orderId" element={<Receipt />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/become-instructor" element={<BecomeInstructor />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/instructor/courses/:id" element={<InstructorCourseDetail />} />
            <Route path="/create-course" element={<CreateCourse />} />
            {/* Add other routes as needed */}
            {/* Do NOT render CartSidebar here directly */}
          </Routes>
        </main>
        <Footer />
      </Router>
    </CartProvider>
  );
}

export default App;

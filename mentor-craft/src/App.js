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
import CourseDetail from "./pages/CourseDetail";
import StudentDashboard from "./pages/StudentDashboard";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import { CartProvider } from "./contexts/CartContext";
import Receipt from "./pages/Receipt";
import Signup from "./pages/Signup";
import BecomeInstructor from "./pages/BecomeInstructor";
import ForgotPassword from "./pages/ForgotPassword";
import InstructorCourseDetail from "./pages/InstructorCourseDetail";
import CreateCourse from "./pages/CreateCourse";
import InstructorMyCourses from "./pages/InstructorMyCourses";
import InstructorDashboard from "./pages/InstructorDashboard";
import InstructorLayout from "./components/InstructorLayout"; 
import InstructorReviews from "./pages/InstructorReviews"; 
import { Navigate } from "react-router-dom"; 

function App() {
  return (
    <CartProvider>
      <Router>
        <Routes>
          {/* ✅ Public pages with Header + Footer */}
          {[
            { path: "/", element: <Home /> },
            { path: "/courses", element: <Courses /> },
            { path: "/courses/:id", element: <CourseDetail /> },
            { path: "/about", element: <About /> },
            { path: "/contact", element: <Contact /> },
            { path: "/login", element: <Login /> },
            { path: "/signup", element: <Signup /> },
            { path: "/become-instructor", element: <BecomeInstructor /> },
            { path: "/forgot-password", element: <ForgotPassword /> },
            { path: "/cart", element: <Cart /> },
            { path: "/checkout", element: <Checkout /> },
            { path: "/receipt/:orderId", element: <Receipt /> },
            { path: "/student-dashboard", element: <StudentDashboard /> },
          ].map(({ path, element }) => (
            <Route
              key={path}
              path={path}
              element={
                <>
                  <Header />
                  {element}
                  <Footer />
                </>
              }
            />
          ))}

          {/* ✅ Instructor Dashboard with layout (no Header/Footer) */}
          <Route path="/instructor" element={<InstructorLayout />}>
            <Route path="dashboard" element={<InstructorDashboard />} />
            <Route path="my-courses" element={<InstructorMyCourses />} />
            <Route path="create-course" element={<CreateCourse />} />
            <Route path="courses/:id" element={<InstructorCourseDetail />} />
            <Route path="reviews" element={<InstructorReviews />} />
            {/* Add more like /reviews, /messages if needed */}
          </Route>

          {/* ✅ Optional: Redirect old /instructor-dashboard to new layout path */}
          <Route
            path="/instructor-dashboard"
            element={<Navigate to="/instructor/dashboard" replace />}
          />
        </Routes>
      </Router>
    </CartProvider>
  );
}

export default App;

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
import StudentLayout from "./components/StudentLayout"; 
import InstructorReviews from "./pages/InstructorReviews"; 
import InstructorEarnings from "./pages/InstructorEarnings";
import InstructorQuizAttempts from "./pages/InstructorQuizAttempts";
import InstructorAssignmentAttempts from "./pages/InstructorAssignmentAttempts";
import InstructorAnnouncements from "./pages/InstructorAnnouncements";
import InstructorPurchaseHistory from "./pages/InstructorPurchaseHistory";
import GenerateCertificate from "./pages/GenerateCertificate";
import InstructorProfile from "./pages/InstructorProfile";
import InstructorSettings from "./pages/InstructorSettings";
import StudentQuizResults from "./pages/StudentQuizResults";
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
            <Route path="earning" element={<InstructorEarnings />} />
            <Route path="quiz-attempts" element={<InstructorQuizAttempts />} />
            <Route path="assignment-attempts" element={<InstructorAssignmentAttempts />} />
            <Route path="announcements" element={<InstructorAnnouncements />} />
            <Route path="purchase-history" element={<InstructorPurchaseHistory />} />
            <Route path="generate-certificate" element={<GenerateCertificate />} />
            <Route path="profile" element={<InstructorProfile />} />
            <Route path="settings" element={<InstructorSettings />} />
            {/* Add more like /reviews, /messages if needed */}
          </Route>
 
          {/* ✅ Optional: Redirect old /instructor-dashboard to new layout path */}
          <Route
            path="/instructor-dashboard"
            element={<Navigate to="/instructor/dashboard" replace />}
          />
       <Route path="/student" element={<StudentLayout />}>
  <Route path="dashboard" element={<StudentDashboard />} />
  <Route path="quiz-results" element={<StudentQuizResults />} />
  <Route path="settings" element={<div>Coming Soon</div>} />
</Route>
          <Route
            path="/student-dashboard"
            element={<Navigate to="/student/dashboard" replace />}
          />

      </Routes>
    </Router>
    </CartProvider>
  );
}

export default App;

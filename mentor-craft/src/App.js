// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { CartProvider } from "./contexts/CartContext";
import AuthProvider from "./contexts/AuthContext";

// Public Pages
import Home from "./pages/Home";
import Courses from "./pages/Courses";
import About from "./pages/About";
import Contact from "./pages/Contact";
import CourseDetail from "./pages/CourseDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Receipt from "./pages/Receipt";
import BecomeInstructor from "./pages/BecomeInstructor";
import ForgotPassword from "./pages/ForgotPassword";

// Auth Pages
import StudentLogin from "./pages/StudentLogin";
import InstructorLogin from "./pages/InstructorLogin";
import StudentSignup from "./pages/StudentSignup";
import InstructorSignup from "./pages/InstructorSignup";

// Instructor Pages
import InstructorLayout from "./components/InstructorLayout";
import InstructorDashboard from "./pages/InstructorDashboard";
import InstructorMyCourses from "./pages/InstructorMyCourses";
import CreateCourse from "./pages/CreateCourse";
import InstructorCourseDetail from "./pages/InstructorCourseDetail";
import InstructorReviews from "./pages/InstructorReviews";
import InstructorEarnings from "./pages/InstructorEarnings";
import InstructorQuizAttempts from "./pages/InstructorQuizAttempts";
import InstructorAssignmentAttempts from "./pages/InstructorAssignmentAttempts";
import InstructorAnnouncements from "./pages/InstructorAnnouncements";
import InstructorPurchaseHistory from "./pages/InstructorPurchaseHistory";
import GenerateCertificate from "./pages/GenerateCertificate";
import InstructorProfile from "./pages/InstructorProfile";
import InstructorSettings from "./pages/InstructorSettings";
import QuizCreatePage from "./pages/QuizCreatePage";
import AssignmentCreatePage from "./pages/AssignmentCreatePage"

// Student Pages
import StudentLayout from "./components/StudentLayout";
import StudentOverview from "./pages/studentDashboard/StudentOverview";
import StudentProfile from "./pages/studentDashboard/StudentProfile";
import StudentCourses from "./pages/studentDashboard/StudentCourses";
import StudentEnrollmentHistory from "./pages/studentDashboard/StudentEnrollmentHistory";
import StudentQuizResults from "./pages/StudentQuizResults";
import StudentSettings from "./pages/studentDashboard/StudentSettings";
import StudentReviewPage from "./pages/studentDashboard/StudentReviewPage";
import StudentAssignmentPage from "./pages/studentDashboard/StudentAssignmentPage";
import StudentQuizPage from "./pages/studentDashboard/StudentQuizPage";
import StudentDiscussions from "./pages/studentDashboard/StudentDiscussions";

// Protected Route
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <CartProvider>
      <Router>
        <AuthProvider>
          <Routes>

            {/* ✅ Public Routes */}
            {[
              { path: "/", element: <Home /> },
              { path: "/courses", element: <Courses /> },
              { path: "/courses/:id", element: <CourseDetail /> },
              { path: "/about", element: <About /> },
              { path: "/contact", element: <Contact /> },
              { path: "/login/student", element: <StudentLogin /> },
              { path: "/signup/student", element: <StudentSignup /> },
              { path: "/login/instructor", element: <InstructorLogin /> },
              { path: "/signup/instructor", element: <InstructorSignup /> },
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

            {/* ✅ Instructor Protected Routes */}
            <Route element={<ProtectedRoute allowedRole="instructor" />}>
              <Route path="/instructor" element={<InstructorLayout />}>
                <Route path="dashboard" element={<InstructorDashboard />} />
                <Route path="mycourses" element={<InstructorMyCourses />} />
                <Route path="create-course" element={<CreateCourse />} />
                <Route path="courses/:id" element={<InstructorCourseDetail />} />
                <Route path="reviews"      element={<InstructorReviews />} />
                <Route path="earning" element={<InstructorEarnings />} />
                <Route path="quiz-attempts" element={<InstructorQuizAttempts />} />
                <Route path="assignment-upload" element={<AssignmentCreatePage />} />
                <Route path="quiz-create" element={<QuizCreatePage/>}/>
                <Route path="assignment-attempts" element={<InstructorAssignmentAttempts />} />
                <Route path="announcements" element={<InstructorAnnouncements />} />
                <Route path="purchase-history" element={<InstructorPurchaseHistory />} />
                <Route path="generate-certificate" element={<GenerateCertificate />} />
                <Route path="profile" element={<InstructorProfile />} />
                <Route path="settings" element={<InstructorSettings />} />
              </Route>
            </Route>

            {/* ✅ Student Protected Routes */}
            <Route element={<ProtectedRoute allowedRole="student" />}>
              <Route path="/student" element={<StudentLayout />}>
              <Route path="overview" element={<StudentOverview />} />
                <Route path="profile" element={<StudentProfile />} />
                <Route path="reviews" element={<StudentReviewPage/>}/>
                <Route path="courses" element={<StudentCourses />} />
                <Route path="enrollment-history" element={<StudentEnrollmentHistory />} />
                <Route path="quiz-results" element={<StudentQuizResults />} />
                <Route path="settings" element={<StudentSettings />} />
                <Route path="assignment-submit" element={<StudentAssignmentPage/>}/>
                <Route path="quizzes" element={<StudentQuizPage/>}/>
                <Route path="discussion" element={<StudentDiscussions/>}/>
              </Route>
            </Route>

            {/* ✅ Shortcuts */}
            <Route path="/instructor-dashboard" element={<Navigate to="/instructor/dashboard" replace />} />
            <Route path="/student-overview" element={<Navigate to="/student/overview" replace />} />

          </Routes>
        </AuthProvider>
      </Router>
    </CartProvider>
  );
}

export default App;

import { Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import Dashboard from "./pages/Dashboard";
import Table from "./components/Table";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Profile from "./pages/Profile";
import Apllication from "./components/applications/ViewModal";
import UserCompany from "./components/user-companies/ViewModal";
import Company from "./components/companies/ViewModal";
import Employee from "./components/employees/ViewModal";
import Applications from "./pages/Applications";
import UserCompanies from "./pages/UserCompanies";
import Companies from "./pages/Companies";
import Employees from "./pages/Employees";
import Questions from "./pages/Questions";
import Question from "./components/questions/ViewModal";
import ProtectedRoute from "./utils/ProtectedRoute";
import Interviews from "./pages/Interviews";
import Interview from "./components/interviews/ViewModal";

import ResumeMatching from "./pages/ResumeMatching";
import ResumeTestDetails from "./components/resume-matching/ViewModal";
import { AppLayout } from "./components/layout/AppLayout";

import Community from "./pages/Community";
import PostDetail from "./pages/PostDetail";
import SavedPosts from "./pages/SavedPosts";
import DraftedPosts from "./pages/DraftedPosts";
import InterviewQuestions from "./pages/InterviewQuestions";

import GmailCallback from "./pages/GmailCallback";


export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Landing />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/gmail/callback" element={<GmailCallback />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-of-service" element={<TermsOfService />} />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <AppLayout>
                <Profile />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <AppLayout>
                <Dashboard />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/applications"
          element={
            <ProtectedRoute>
              <AppLayout>
                <Applications />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/applications/:id"
          element={
            <ProtectedRoute>
              <AppLayout>
                <Apllication />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/user-companies"
          element={
            <ProtectedRoute>
              <AppLayout>
                <UserCompanies />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/user-companies/:id"
          element={
            <ProtectedRoute>
              <AppLayout>
                <UserCompany />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/companies"
          element={
            <ProtectedRoute>
              <AppLayout>
                <Companies />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/companies/:id"
          element={
            <ProtectedRoute>
              <AppLayout>
                <Company />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/employees"
          element={
            <ProtectedRoute>
              <AppLayout>
                <Employees />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/employees/:id"
          element={
            <ProtectedRoute>
              <AppLayout>
                <Employee />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/questions"
          element={
            <ProtectedRoute>
              <AppLayout>
                <Questions />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/questions/:id"
          element={
            <ProtectedRoute>
              <AppLayout>
                <Question />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/interviews"
          element={
            <ProtectedRoute>
              <AppLayout>
                <Interviews />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/interviews/:id"
          element={
            <ProtectedRoute>
              <AppLayout>
                <Interview />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/resume-matching"
          element={
            <ProtectedRoute>
              <AppLayout>
                <ResumeMatching />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/resume-matching/:id"
          element={
            <ProtectedRoute>
              <AppLayout>
                <ResumeTestDetails />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/community"
          element={
            <ProtectedRoute>
              <AppLayout>
                <Community />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/community/posts/:id"
          element={
            <ProtectedRoute>
              <AppLayout>
                <PostDetail />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/community/saved"
          element={
            <ProtectedRoute>
              <AppLayout>
                <SavedPosts />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/community/drafts"
          element={
            <ProtectedRoute>
              <AppLayout>
                <DraftedPosts />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/community/interview-questions"
          element={
            <ProtectedRoute>
              <AppLayout>
                <InterviewQuestions />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/table"
          element={
            <ProtectedRoute>
              <AppLayout>
                <Table />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="*"
          element={
            <div className="h-screen w-full flex flex-col justify-center items-center ">
              <p className="text-7xl font-bold"> 404</p>
              <div className="text-gray-500 flex items-center gap-5">
                Sorry, the page was not found! redirecting to home page...
              </div>
            </div>
          }
        />
      </Routes>
      <ToastContainer position="bottom-center" limit={1} autoClose={2000} />
    </>
  );
}

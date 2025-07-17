import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthProvider from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';

// Import all page components
import Login from './pages/Login';
import Signup from './pages/Signup';
import DashboardLayout from './layouts/DashboardLayout';
import UserManagement from './pages/admin/UserManagement';
import SurveyResponses from './pages/admin/SurveyResponses';
import SatisfactionSurvey from './pages/user/SatisfactionSurvey';
import KnowledgeBaseEditor from './pages/admin/KnowledgeBaseEditor';
import FaqPage from './pages/user/FaqPage'; 
import FaqsEditor from './pages/admin/FaqsEditor';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Default route redirects to the login page */}
          <Route path="/" element={<Navigate to="/login" />} />

          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected User Routes */}
          <Route element={<PrivateRoute />}>
            <Route path="/dashboard" element={<DashboardLayout />} />
            <Route path="/survey" element={<SatisfactionSurvey />} />
            <Route path="/faqs" element={<FaqPage />} />
          </Route>

          {/* Protected Admin Routes */}
          <Route element={<PrivateRoute role="admin" />}>
            <Route path="/admin" element={<UserManagement />} />
            <Route path="/admin/surveys" element={<SurveyResponses />} />
            <Route path="/admin/knowledge" element={<KnowledgeBaseEditor />} /> 
            <Route path="/admin/faqs" element={<FaqsEditor />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

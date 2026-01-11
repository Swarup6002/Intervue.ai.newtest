import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// 1. Import AuthProvider (This is critical!)
import { AuthProvider } from '../lib/AuthContext';

// Import all your pages
import HomePage from './pages/HomePage';
import InterviewPage from './pages/InterviewPage';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import LogoutPage from './pages/LogoutPage';
import SessionsPage from './pages/SessionsPage';
import SessionDetailPage from './pages/SessionDetailPage';
import DevelopersPage from './pages/DevelopersPage'; // <--- 1. ADDED IMPORT

export default function Router() {
  return (
    <BrowserRouter>
      {/* 2. WRAP EVERYTHING INSIDE AUTH PROVIDER */}
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/logout" element={<LogoutPage />} />

          {/* App Routes */}
          <Route path="/interview" element={<InterviewPage />} />
          <Route path="/sessions" element={<SessionsPage />} />
          <Route path="/sessions/:sessionId" element={<SessionDetailPage />} />
          
          {/* 👇 3. ADDED THIS ROUTE SO THE PAGE LOADS */}
          <Route path="/developers" element={<DevelopersPage />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
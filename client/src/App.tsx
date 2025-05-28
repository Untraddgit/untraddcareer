// src/App.tsx

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { SignedIn, SignedOut, RedirectToSignIn, SignIn } from '@clerk/clerk-react';
import Dashboard from './Pages/Dashboard';
import AdminDashboard from './Pages/AdminDashboard';
import ScholarshipTest from './Pages/ScholarshipTest';
import LandingPage from './Pages/Landingpage';
import ProtectedRoute from './components/ProtectedRoute';
import UserTypeRoute from './components/UserTypeRoute';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public route - Landing page for all users */}
        <Route path="/" element={<LandingPage />} />

        {/* Protected routes */}
        <Route path="/dashboard" element={
          <>
            <SignedIn>
              <ProtectedRoute>
                <UserTypeRoute allowedUserTypes={['student']}>
                  <Dashboard />
                </UserTypeRoute>
              </ProtectedRoute>
            </SignedIn>
            <SignedOut>
              <RedirectToSignIn />
            </SignedOut>
          </>
        } />

        <Route path="/admin" element={
          <>
            <SignedIn>
              <ProtectedRoute>
                <UserTypeRoute allowedUserTypes={['admin']}>
                  <AdminDashboard />
                </UserTypeRoute>
              </ProtectedRoute>
            </SignedIn>
            <SignedOut>
              <RedirectToSignIn />
            </SignedOut>
          </>
        } />

        <Route path="/scholarship-test" element={
          <>
            <SignedIn>
              <ProtectedRoute>
                <UserTypeRoute allowedUserTypes={['student']}>
                  <ScholarshipTest />
                </UserTypeRoute>
              </ProtectedRoute>
            </SignedIn>
            <SignedOut>
              <RedirectToSignIn />
            </SignedOut>
          </>
        } />

        <Route path="/sign-in" element={<SignIn routing="path" path="/sign-in" />} />
      </Routes>
    </Router>
  );
}

export default App;
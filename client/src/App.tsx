// src/App.tsx

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react';
import Dashboard from './Pages/Dashboard';
import ScholarshipTest from './Pages/ScholarshipTest';
import LandingPage from './Pages/Landingpage';
import ProtectedRoute from './components/ProtectedRoute';

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
                <Dashboard />
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
                <ScholarshipTest />
              </ProtectedRoute>
            </SignedIn>
            <SignedOut>
              <RedirectToSignIn />
            </SignedOut>
          </>
        } />
      </Routes>
    </Router>
  );
}

export default App;
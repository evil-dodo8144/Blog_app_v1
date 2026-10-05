// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

import HomePage       from './pages/HomePage';
import LoginPage      from './pages/LoginPage';
import RegisterPage   from './pages/RegisterPage';
import PostDetailPage from './pages/PostDetailPage';
import CreatePostPage from './pages/CreatePostPage';
import EditPostPage   from './pages/EditPostPage';
import ProfilePage    from './pages/ProfilePage';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="min-h-screen flex flex-col">
          <Navbar />

          <main className="flex-1">
            <Routes>
              {/* ── Public routes ───────────────────────────────────── */}
              <Route path="/"           element={<HomePage />} />
              <Route path="/login"      element={<LoginPage />} />
              <Route path="/register"   element={<RegisterPage />} />
              <Route path="/posts/:id"  element={<PostDetailPage />} />
              <Route path="/profile/:id" element={<ProfilePage />} />

              {/* ── Protected routes ────────────────────────────────── */}
              <Route path="/create-post" element={
                <ProtectedRoute><CreatePostPage /></ProtectedRoute>
              } />
              <Route path="/edit-post/:id" element={
                <ProtectedRoute><EditPostPage /></ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute><ProfilePage /></ProtectedRoute>
              } />

              {/* ── 404 ─────────────────────────────────────────────── */}
              <Route path="*" element={
                <div className="flex flex-col items-center justify-center h-[60vh] text-center">
                  <p className="text-8xl font-black text-white/10 mb-4">404</p>
                  <p className="text-slate-400 mb-6">Page not found.</p>
                  <a href="/" className="btn-primary">Go home</a>
                </div>
              } />
            </Routes>
          </main>

          <Footer />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

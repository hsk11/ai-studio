import { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { ProtectedRoute } from './components/ProtectedRoute';

const LoginPage = lazy(() => import('./pages/LoginPage').then(module => ({ default: module.LoginPage })));
const SignupPage = lazy(() => import('./pages/SignupPage').then(module => ({ default: module.SignupPage })));
const StudioPage = lazy(() => import('./pages/StudioPage').then(module => ({ default: module.StudioPage })));

const LoadingSpinner = (): JSX.Element => (
  <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
  </div>
);

function App(): JSX.Element {
  return (
    <ThemeProvider>
      <AuthProvider>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route
                path="/studio"
                element={
                  <ProtectedRoute>
                    <StudioPage />
                  </ProtectedRoute>
                }
              />
              <Route path="/" element={<Navigate to="/studio" replace />} />
            </Routes>
          </Suspense>
        </div>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;

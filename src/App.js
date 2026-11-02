import './App.css';
import './styles/common/common.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import WeddingPage from "./pages/weddingPage";
import CoupleDashboard from './pages/coupleDashboard';
import InvitePage from './pages/invitePage';
import Login from './pages/login';
import Signup from './pages/signup';
import RequireAuth from './components/requireAuth';
import { ToastProvider } from './components/toast';

function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Public pages */}
          <Route path="/wedding/:weddingId" element={<WeddingPage />} />
          <Route path="/invite/:inviteCode" element={<InvitePage />} />

          {/* Couple Dashboard */}
          <Route
            path="/dashboard"
            element={
              <RequireAuth>
                <CoupleDashboard />
              </RequireAuth>
            }
          />
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  );
}

export default App;

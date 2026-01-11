import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import WeddingPage from "./pages/weddingPage";
import CoupleDashboard from './pages/coupleDashboard';
import Login from './pages/login';
import Signup from './pages/signup';

function App() {
  return (
    <BrowserRouter>
    {/* <h1>Hello</h1> */}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route path="/wedding/:weddingId" element={<WeddingPage />} />

        {/* Couple Dashboard */}
        <Route path="/dashboard/:weddingId" element={<CoupleDashboard />}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;


import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import JobDetail from './pages/JobDetail';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import Navbar from './components/Navbar'; // ✅ Import Navbar
import './App.css';

export default function App() {
  return (
    <>
      <Navbar/>
      {/* Let each page component manage its own layout and container */}
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/job/:id" element={<JobDetail />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Routes>
      </main>
    </>
  );
}

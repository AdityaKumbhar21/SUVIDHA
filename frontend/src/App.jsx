import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// Context & Layouts
import MainLayout from './components/layout/MainLayout';
import PageTransition from './components/layout/PageTransition';
import { LanguageProvider } from './context/LanguageContext';

// Main Pages
import Welcome from './pages/Welcome';
import Login from './pages/auth/Login';
import Dashboard from './pages/dashboard/Dashboard';

// UPDATED: Identity & Admin Imports [cite: 69, 346]
import AdminDashboard from './pages/admin/AdminDashboard';
import ProfileCreation from './pages/auth/ProfileCreation';

// Add import at the top
import Feedback from './pages/services/Feedback';


// 1. Electricity Department
import Electricity from './pages/services/Electricity';
import BillPayment from './pages/services/electricity/BillPayment';
import BillSummary from './pages/services/electricity/BillSummary';
import CardPayment from './pages/services/electricity/CardPayment';
import PaymentSuccess from './pages/services/electricity/PaymentSuccess';
import OutageComplaint from './pages/services/electricity/OutageComplaint';

// 2. Water Department
import Water from './pages/services/Water';
import WaterComplaint from './pages/services/water/WaterComplaint';

// 3. Gas Department
import Gas from './pages/services/Gas';
import BookCylinder from './pages/services/gas/BookCylinder';
// Import the new page
import GasLeakage from './pages/services/gas/GasLeakage';

// 4. Waste Department
import Waste from './pages/services/Waste';
import TrackVan from './pages/services/waste/TrackVan';

// Wrapper for Animation (needs useLocation hook)
const AnimatedRoutes = () => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        
        {/* GLOBAL LAYOUT (Header + Footer) */}
        <Route path="/" element={<MainLayout />}>
          
          {/* Main Flow */}
          <Route index element={<PageTransition><Welcome /></PageTransition>} />
          <Route path="auth" element={<PageTransition><Login /></PageTransition>} />
          <Route path="service/feedback" element={<PageTransition><Feedback /></PageTransition>} />
          
          {/* UPDATED: Profile Creation Flow for New Users [cite: 15, 85] */}
          <Route path="auth/create-profile" element={<PageTransition><ProfileCreation /></PageTransition>} />
          
          <Route path="dashboard" element={<PageTransition><Dashboard /></PageTransition>} />
          
          {/* UPDATED: Admin/Officer Control Panel [cite: 346, 382] */}
          <Route path="admin" element={<PageTransition><AdminDashboard /></PageTransition>} />
      
          {/* --- SERVICE MODULES --- */}

          {/* Electricity */}
          <Route path="service/electricity" element={<PageTransition><Electricity /></PageTransition>} />
          <Route path="service/electricity/pay" element={<PageTransition><BillPayment /></PageTransition>} />
          <Route path="service/electricity/summary" element={<PageTransition><BillSummary /></PageTransition>} />
          <Route path="service/electricity/card-payment" element={<PageTransition><CardPayment /></PageTransition>} />
          <Route path="service/electricity/success" element={<PageTransition><PaymentSuccess /></PageTransition>} />
          <Route path="service/electricity/outage" element={<PageTransition><OutageComplaint /></PageTransition>} />

          {/* Water */}
          <Route path="service/water" element={<PageTransition><Water /></PageTransition>} />
          <Route path="service/water/pay" element={<div className="p-10 text-xl font-bold">Water Bill Payment Coming Soon...</div>} />
          <Route path="service/water/complaint" element={<PageTransition><WaterComplaint /></PageTransition>} />

          {/* Gas */}
          <Route path="service/gas" element={<PageTransition><Gas /></PageTransition>} />
          <Route path="service/gas/book" element={<PageTransition><BookCylinder /></PageTransition>} />
          <Route path="service/gas/leakage" element={<PageTransition><GasLeakage /></PageTransition>} />

          {/* Waste */}
          <Route path="service/waste" element={<PageTransition><Waste /></PageTransition>} />
          <Route path="service/waste/track" element={<PageTransition><TrackVan /></PageTransition>} />
          

        </Route>
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <AnimatedRoutes />
      </BrowserRouter>
    </LanguageProvider>
  );
}

export default App;
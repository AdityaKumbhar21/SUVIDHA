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

// Identity & Admin
import AdminDashboard from './pages/admin/AdminDashboard';
import ProfileCreation from './pages/auth/ProfileCreation';

// Feedback
import Feedback from './pages/services/Feedback';

// 1. Electricity Department
import Electricity from './pages/services/Electricity';
import BillPayment from './pages/services/electricity/BillPayment';
import BillSummary from './pages/services/electricity/BillSummary';
import CardPayment from './pages/services/electricity/CardPayment';
import PaymentSuccess from './pages/services/electricity/PaymentSuccess';
import OutageComplaint from './pages/services/electricity/OutageComplaint';
import NewConnection from './pages/services/electricity/NewConnection';
import MeterIssue from './pages/services/electricity/MeterIssue';
import LoadChange from './pages/services/electricity/LoadChange';

// 2. Water Department
import Water from './pages/services/Water';
import WaterComplaint from './pages/services/water/WaterComplaint';
import WaterLeakage from './pages/services/water/WaterLeakage';
import WaterQuality from './pages/services/water/WaterQuality';
import WaterBillPayment from './pages/services/water/WaterBillPayment';

// 3. Gas Department
import Gas from './pages/services/Gas';
import BookCylinder from './pages/services/gas/BookCylinder';
import GasLeakage from './pages/services/gas/GasLeakage';
import GasNewConnection from './pages/services/gas/GasNewConnection';
import CylinderIssue from './pages/services/gas/CylinderIssue';

// 4. Waste Department
import Waste from './pages/services/Waste';
import MissedPickup from './pages/services/waste/MissedPickup';
import OverflowingBin from './pages/services/waste/OverflowingBin';
import BulkPickup from './pages/services/waste/BulkPickup';

// 5. Municipal Department
import Municipal from './pages/services/Municipal';
import PropertyTax from './pages/services/municipal/PropertyTax';
import CertificateRequest from './pages/services/municipal/CertificateRequest';
import MunicipalGrievance from './pages/services/municipal/MunicipalGrievance';

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
          <Route path="service/electricity/new" element={<PageTransition><NewConnection /></PageTransition>} />
          <Route path="service/electricity/meter" element={<PageTransition><MeterIssue /></PageTransition>} />
          <Route path="service/electricity/load" element={<PageTransition><LoadChange /></PageTransition>} />

          {/* Water */}
          <Route path="service/water" element={<PageTransition><Water /></PageTransition>} />
          <Route path="service/water/pay" element={<PageTransition><WaterBillPayment /></PageTransition>} />
          <Route path="service/water/complaint" element={<PageTransition><WaterComplaint /></PageTransition>} />
          <Route path="service/water/leakage" element={<PageTransition><WaterLeakage /></PageTransition>} />
          <Route path="service/water/quality" element={<PageTransition><WaterQuality /></PageTransition>} />

          {/* Gas */}
          <Route path="service/gas" element={<PageTransition><Gas /></PageTransition>} />
          <Route path="service/gas/book" element={<PageTransition><BookCylinder /></PageTransition>} />
          <Route path="service/gas/leakage" element={<PageTransition><GasLeakage /></PageTransition>} />
          <Route path="service/gas/new" element={<PageTransition><GasNewConnection /></PageTransition>} />
          <Route path="service/gas/cylinder-issue" element={<PageTransition><CylinderIssue /></PageTransition>} />

          {/* Waste */}
          <Route path="service/waste" element={<PageTransition><Waste /></PageTransition>} />
          <Route path="service/waste/missed-pickup" element={<PageTransition><MissedPickup /></PageTransition>} />
          <Route path="service/waste/overflow" element={<PageTransition><OverflowingBin /></PageTransition>} />
          <Route path="service/waste/bulk-pickup" element={<PageTransition><BulkPickup /></PageTransition>} />

          {/* Municipal */}
          <Route path="service/municipal" element={<PageTransition><Municipal /></PageTransition>} />
          <Route path="service/municipal/tax" element={<PageTransition><PropertyTax /></PageTransition>} />
          <Route path="service/municipal/certificate" element={<PageTransition><CertificateRequest /></PageTransition>} />
          <Route path="service/municipal/grievance" element={<PageTransition><MunicipalGrievance /></PageTransition>} />
          

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
import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Layout, Bell, User, MessageSquare, X, Home, Grid, FileText, AlertTriangle, LogOut } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import ChatWidget from '../chat/ChatWidget';

const MainLayout = () => {
  const { lang, toggleLanguage } = useLanguage();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  
  // Check if user is logged in
  const isLoggedIn = localStorage.getItem('token');
  const userName = localStorage.getItem('userName') || 'Citizen';
  const userId = localStorage.getItem('userId')?.slice(-4) || '';
  
  // Check if on auth pages
  const isAuthPage = location.pathname === '/' || location.pathname === '/auth' || location.pathname === '/auth/create-profile';

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('userPhone');
    localStorage.removeItem('userName');
    sessionStorage.clear();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans text-slate-900">
      
      {/* =========================================
          1. GOVERNMENT HEADER & NAVIGATION
      ========================================= */}
      <header className="bg-[#1e3a8a] text-white px-8 py-5 flex justify-between items-center shadow-lg relative z-50">
        
        {/* Left: Branding */}
        <Link to="/" className="flex items-center gap-4 group">
          <div className="bg-white/10 p-3 rounded-full border border-white/20 group-hover:bg-white/20 transition-all">
            <Layout size={28} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight leading-none uppercase">Suvidha Portal</h1>
            <p className="text-xs font-bold text-blue-200 tracking-[0.15em] uppercase mt-1">Govt. of India</p>
          </div>
        </Link>

        {/* Center: Main Navigation - Only show when logged in and not on auth pages */}
        {isLoggedIn && !isAuthPage && (
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/dashboard" className="flex items-center gap-2 hover:bg-white/10 px-4 py-3 rounded-xl transition-all">
              <Home size={20} />
              <span className="font-bold text-sm">HOME</span>
            </Link>
            <Link to="/dashboard" className="flex items-center gap-2 hover:bg-white/10 px-4 py-3 rounded-xl transition-all">
              <Grid size={20} />
              <span className="font-bold text-sm">SERVICES</span>
            </Link>
            <Link to="/service/electricity/outage" className="flex items-center gap-2 hover:bg-white/10 px-4 py-3 rounded-xl transition-all">
              <AlertTriangle size={20} />
              <span className="font-bold text-sm">GRIEVANCES</span>
            </Link>
          </nav>
        )}

        {/* Right: User Tools */}
        <div className="flex items-center gap-6">
           <button 
             onClick={toggleLanguage} 
             className="text-sm font-bold bg-[#3b82f6] hover:bg-blue-400 px-5 py-2.5 rounded-full border border-blue-400 shadow-sm transition-all"
           >
              {lang === 'en' ? 'हिंदी (HI)' : 'English (EN)'}
           </button>

           {/* Only show user info when logged in and not on auth pages */}
           {isLoggedIn && !isAuthPage && (
             <>
               <div className="relative cursor-pointer hover:bg-white/10 p-3 rounded-full transition">
                 <Bell size={22} className="text-blue-100" />
                 <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[#1e3a8a]"></span>
               </div>
               
               <div className="flex items-center gap-4 pl-6 border-l border-blue-800 cursor-pointer">
                  <div className="text-right hidden sm:block">
                    <p className="text-sm font-bold text-white leading-tight">{userName}</p>
                    <p className="text-xs text-blue-300 font-medium">Citizen ID: {userId}</p>
                  </div>
                  <div className="bg-[#172554] p-2.5 rounded-full border border-blue-700">
                    <User size={22} className="text-blue-200" />
                  </div>
               </div>

               {/* Logout / EXIT Button */}
               <button 
                  onClick={handleLogout}
                  className="bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 text-xs font-black rounded-full shadow-lg border border-red-400 active:scale-95 transition-all flex items-center gap-2"
               >
                  <LogOut size={14} />
                  <span>{lang === 'en' ? 'EXIT' : 'बाहर'}</span>
               </button>
             </>
           )}
        </div>
      </header>

      {/* =========================================
          2. MAIN CONTENT AREA
      ========================================= */}
      <main className="flex-1 w-full overflow-y-auto">
        <Outlet />
      </main>

      {/* =========================================
          3. CHAT WIDGET & FLOATING BUTTON
      ========================================= */}
      <ChatWidget isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />

      <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end gap-2 group">
        {!isChatOpen && (
          <div className="bg-white border border-slate-200 shadow-xl px-4 py-2 rounded-lg mb-2 animate-in slide-in-from-bottom-5 hidden group-hover:block">
             <p className="text-xs font-bold text-slate-800">👋 Need help? Ask Suvidha AI</p>
          </div>
        )}
        <button 
          onClick={() => setIsChatOpen(!isChatOpen)} 
          className="bg-orange-600 text-white p-4 rounded-full shadow-2xl hover:scale-110 hover:bg-orange-700 transition-all border-4 border-white"
        >
           {isChatOpen ? <X size={28} /> : <MessageSquare size={28} />}
        </button>
      </div>

      {/* =========================================
          4. SLIM OFFICIAL GOVERNMENT FOOTER
      ========================================= */}
      <footer className="bg-[#f8fafc] border-t border-slate-200 w-full mt-auto relative z-10 py-6">
          <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
            
            {/* Left: Branding & Copyright */}
            <div className="flex items-center gap-3">
              <div className="bg-blue-50 p-1.5 rounded-md border border-blue-100">
                 <Layout size={18} className="text-[#1e3a8a]" />
              </div>
              <div>
                 <p className="text-xs font-black text-[#1e3a8a] uppercase tracking-wider">Suvidha Portal</p>
                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">© 2026 Govt. of India</p>
              </div>
            </div>

            {/* Right: Compliance Links */}
            <nav className="flex flex-wrap justify-center gap-6 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              <Link to="/" className="hover:text-[#1e3a8a] transition-colors">Home</Link>
              <button className="hover:text-[#1e3a8a] transition-colors">Accessibility</button>
              <button className="hover:text-[#1e3a8a] transition-colors">Privacy Policy</button>
              <button className="hover:text-[#1e3a8a] transition-colors">Terms & Conditions</button>
              <button className="hover:text-[#1e3a8a] transition-colors">Help Desk</button>
            </nav>

          </div>
      </footer>

    </div>
  );
};

export default MainLayout;
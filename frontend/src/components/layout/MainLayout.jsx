import React, { useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Layout, MessageSquare, X, LogOut, Home } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import ChatWidget from '../chat/ChatWidget';

const MainLayout = () => {
  const { lang, toggleLanguage } = useLanguage();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isLoggedIn = localStorage.getItem('token');
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
    <div className="h-screen flex flex-col bg-slate-100 font-sans text-slate-900 overflow-hidden select-none">
      
      {/* === KIOSK TOP BAR === */}
      <header className="bg-[#1e3a8a] text-white px-6 py-3 flex justify-between items-center shadow-lg relative z-50 shrink-0">
        
        {/* Left: Branding */}
        <div className="flex items-center gap-3">
          <div className="bg-white/10 p-2.5 rounded-xl border border-white/20">
            <Layout size={22} className="text-white" />
          </div>
          <div>
            <h1 className="text-lg font-black tracking-tight leading-none uppercase">Suvidha</h1>
            <p className="text-[9px] font-bold text-blue-300 tracking-[0.2em] uppercase">Citizen Service Kiosk</p>
          </div>
        </div>

        {/* Right: Controls */}
        <div className="flex items-center gap-3">
          {isLoggedIn && !isAuthPage && (
            <button
              onClick={() => navigate('/dashboard')}
              className="bg-white/10 hover:bg-white/20 text-white p-2.5 rounded-xl border border-white/20 transition-all active:scale-95"
              title="Home"
            >
              <Home size={20} />
            </button>
          )}

          <button 
            onClick={toggleLanguage} 
            className="text-xs font-black bg-white/10 hover:bg-white/20 px-4 py-2.5 rounded-xl border border-white/20 transition-all active:scale-95 tracking-wide"
          >
            {lang === 'en' ? 'हिंदी' : 'ENG'}
          </button>

          {isLoggedIn && !isAuthPage && (
            <button 
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2.5 text-xs font-black rounded-xl shadow-lg border border-red-500 active:scale-95 transition-all flex items-center gap-2"
            >
              <LogOut size={14} />
              <span>{lang === 'en' ? 'EXIT' : 'बाहर'}</span>
            </button>
          )}
        </div>
      </header>

      {/* === MAIN CONTENT === */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto px-6 py-6 h-full">
          <Outlet />
        </div>
      </main>

      {/* === CHAT WIDGET === */}
      <ChatWidget isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
      <div className="fixed bottom-6 right-6 z-50">
        <button 
          onClick={() => setIsChatOpen(!isChatOpen)} 
          className="bg-[#1e3a8a] text-white p-3.5 rounded-full shadow-2xl hover:scale-105 transition-all border-2 border-white"
        >
          {isChatOpen ? <X size={24} /> : <MessageSquare size={24} />}
        </button>
      </div>

      {/* === KIOSK FOOTER === */}
      <footer className="bg-[#1e3a8a] text-blue-300 text-center py-2 text-[10px] font-bold tracking-widest uppercase shrink-0">
        Suvidha Kiosk &middot; Govt. of India &middot; &copy; 2026
      </footer>

    </div>
  );
};

export default MainLayout;
import React, { useState, useEffect } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Layout, Bell, User, MessageSquare, X } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import ChatWidget from '../chat/ChatWidget';

const MainLayout = () => {
  const { lang, toggleLanguage } = useLanguage();
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans text-slate-900">
      
      {/* =========================================
          1. GOVERNMENT HEADER & NAVIGATION
      ========================================= */}
      <header className="bg-[#1e3a8a] text-white px-6 py-4 flex justify-between items-center shadow-lg relative z-50">
        
        {/* Left: Branding */}
        <Link to="/" className="flex items-center gap-4 group">
          <div className="bg-white/10 p-2.5 rounded-full border border-white/20 group-hover:bg-white/20 transition-all">
            <Layout size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tight leading-none uppercase">Suvidha Portal</h1>
            <p className="text-[10px] font-bold text-blue-200 tracking-[0.15em] uppercase mt-0.5">Govt. of Maharashtra</p>
          </div>
        </Link>

        {/* Center: Main Navigation */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-bold tracking-wide text-blue-100">
          <Link to="/" className="hover:text-white transition-colors py-2 border-b-2 border-transparent hover:border-white">
            HOME
          </Link>
          <Link to="/dashboard" className="hover:text-white transition-colors py-2 border-b-2 border-transparent hover:border-white">
            SERVICES
          </Link>
          <Link to="/dashboard" className="hover:text-white transition-colors py-2 border-b-2 border-transparent hover:border-white">
            DASHBOARD
          </Link>
          <Link to="/service/electricity/outage" className="hover:text-white transition-colors py-2 border-b-2 border-transparent hover:border-white">
            GRIEVANCES
          </Link>
        </nav>

        {/* Right: User Tools */}
        <div className="flex items-center gap-5">
           <button 
             onClick={toggleLanguage} 
             className="text-xs font-bold bg-[#3b82f6] hover:bg-blue-400 px-4 py-1.5 rounded-full border border-blue-400 shadow-sm transition-all"
           >
              {lang === 'EN' ? 'मराठी (MAR)' : 'English (EN)'}
           </button>

           <div className="relative cursor-pointer hover:bg-white/10 p-2 rounded-full transition">
             <Bell size={20} className="text-blue-100" />
             <span className="absolute top-1.5 right-2 w-2 h-2 bg-red-500 rounded-full border border-[#1e3a8a]"></span>
           </div>
           
           <div className="flex items-center gap-3 pl-5 border-l border-blue-800 cursor-pointer">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold text-white leading-tight">Aditya K.</p>
                <p className="text-[10px] text-blue-300 font-medium">Citizen ID: 8829</p>
              </div>
              <div className="bg-[#172554] p-2 rounded-full border border-blue-700">
                <User size={18} className="text-blue-200" />
              </div>
           </div>
        </div>
      </header>

      {/* =========================================
          2. MAIN CONTENT AREA
      ========================================= */}
      <main className="flex-1 w-full flex flex-col">
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
                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">© 2026 Govt. of Maharashtra</p>
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
import React from 'react';
import { Shield, Menu } from 'lucide-react';

const Header = () => {
  return (
    <div className="w-full shadow-md relative z-50">
      
      {/* MAIN HEADER BAR - Deep Navy Blue Background */}
      <div className="bg-[#1A365D] text-white px-6 md:px-12 py-4 flex justify-between items-center">
        
        {/* LEFT: BRANDING */}
        <div className="flex items-center gap-4">
          {/* Emblem Placeholder */}
          <div className="w-12 h-12 bg-white rounded-lg flex flex-col items-center justify-center shadow-lg border-2 border-yellow-500">
             <Shield size={24} className="text-[#1A365D] fill-current" />
             <span className="text-[8px] font-black text-[#1A365D] leading-none mt-0.5">GOVT</span>
          </div>
          
          <div className="flex flex-col">
            <h1 className="text-2xl font-black tracking-wide leading-none font-sans">
              सुविधा <span className="font-light opacity-50 mx-1">|</span> SUVIDHA
            </h1>
            <p className="text-[10px] md:text-xs font-bold text-blue-200 uppercase tracking-[0.2em] mt-1">
              Government of Maharashtra • Citizen Interface
            </p>
          </div>
        </div>

        {/* RIGHT: ACTIONS (Hidden on small screens, visible on kiosk) */}
        <div className="flex items-center gap-8">
           
           {/* Utility Links */}
           <div className="hidden md:flex gap-6 text-[11px] font-bold text-blue-200 uppercase tracking-widest">
              <span className="cursor-pointer hover:text-white transition-colors">Accessibility</span>
              <span className="cursor-pointer hover:text-white transition-colors">Helpdesk</span>
              <span className="cursor-pointer hover:text-white transition-colors">Privacy</span>
           </div>

           {/* Language Toggle Button */}
           <button className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2.5 text-xs font-black rounded-full shadow-lg border border-orange-400 active:scale-95 transition-all flex items-center gap-2">
              <span>A</span>
              <span>मराठी</span>
           </button>
        </div>
      </div>
      
      {/* DECORATIVE TRICOLOR STRIP (The "Government" Touch) */}
      <div className="h-1.5 w-full flex shadow-sm">
        <div className="flex-1 bg-[#FF9933]"></div> {/* Saffron */}
        <div className="flex-1 bg-white"></div>     {/* White */}
        <div className="flex-1 bg-[#138808]"></div> {/* India Green */}
      </div>

    </div>
  );
};

export default Header;
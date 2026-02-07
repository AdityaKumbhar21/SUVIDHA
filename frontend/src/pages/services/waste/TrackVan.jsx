import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, Truck, MapPin, Clock, Phone } from 'lucide-react';

const TrackVan = () => {
  const navigate = useNavigate();
  const [eta, setEta] = useState(15); // Minutes
  const [status, setStatus] = useState("On the way");

  // Simulate time dropping
  useEffect(() => {
    const timer = setInterval(() => {
      setEta((prev) => (prev > 0 ? prev - 1 : 0));
    }, 2000); // Fast forward time for demo
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="h-full flex flex-col relative z-10">
      
      {/* Header */}
      <div className="flex items-center gap-4 mb-4 px-2">
        <button 
          onClick={() => navigate(-1)}
          className="p-3 bg-white rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50"
        >
          <ChevronLeft size={24} />
        </button>
        <div>
           <h1 className="text-2xl font-black text-slate-800">Live Van Tracking</h1>
           <p className="text-slate-500 text-sm">Vehicle: MH-14-GT-9988</p>
        </div>
      </div>

      {/* MAP AREA */}
      <div className="flex-1 bg-slate-100 rounded-3xl relative overflow-hidden shadow-inner border border-slate-200">
        
        {/* Background Map Image */}
        <div className="absolute inset-0 opacity-50" 
             style={{ 
               backgroundImage: 'radial-gradient(#cbd5e1 2px, transparent 2px)', 
               backgroundSize: '30px 30px' 
             }}>
        </div>

        {/* The Road Path (SVG) */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {/* A curved road path */}
          <path 
            d="M 100 400 C 150 200, 400 300, 500 100" 
            fill="none" 
            stroke="white" 
            strokeWidth="20" 
            strokeLinecap="round"
          />
          <path 
            d="M 100 400 C 150 200, 400 300, 500 100" 
            fill="none" 
            stroke="#94a3b8" 
            strokeWidth="4" 
            strokeDasharray="10 10" 
            strokeLinecap="round"
          />
        </svg>

        {/* Your Location Pin */}
        <div className="absolute top-[80px] left-[480px]">
          <div className="relative">
            <div className="w-4 h-4 bg-blue-500 rounded-full animate-ping absolute top-0 left-0"></div>
            <MapPin size={32} className="text-blue-600 relative z-10 -ml-2 -mt-4 drop-shadow-lg" />
            <div className="absolute top-8 -left-8 bg-white px-3 py-1 rounded-full shadow-md text-xs font-bold whitespace-nowrap">
              Your Home
            </div>
          </div>
        </div>

        {/* Moving Truck Animation */}
        <motion.div
          className="absolute"
          initial={{ offsetDistance: "0%" }}
          animate={{ offsetDistance: "100%" }}
          transition={{ 
            duration: 10, 
            ease: "linear",
            repeat: Infinity,
            repeatType: "reverse"
          }}
          style={{
            offsetPath: 'path("M 100 400 C 150 200, 400 300, 500 100")',
            offsetRotate: "auto" // Auto-rotates the truck along the curve
          }}
        >
          <div className="bg-emerald-600 p-2 rounded-lg shadow-2xl text-white transform -translate-x-1/2 -translate-y-1/2">
            <Truck size={24} />
          </div>
        </motion.div>

        {/* Floating Status Card */}
        <div className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur-md p-5 rounded-2xl shadow-xl border border-white/50 flex items-center justify-between">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">
               <Clock size={24} />
             </div>
             <div>
               <p className="text-xs font-bold text-slate-400 uppercase">Estimated Arrival</p>
               <h3 className="text-xl font-black text-slate-800">{eta} Mins</h3>
             </div>
          </div>
          
          <button className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 hover:bg-emerald-500 hover:text-white transition-colors">
            <Phone size={20} />
          </button>
        </div>

      </div>
    </div>
  );
};

export default TrackVan;
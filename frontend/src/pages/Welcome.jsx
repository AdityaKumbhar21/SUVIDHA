import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Layout, ArrowRight, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const Welcome = () => {
  const navigate = useNavigate();
  const { setLanguage } = useLanguage();

  const handleSelection = (selectedLang) => {
    // Set the language directly
    setLanguage(selectedLang);

    // Navigate to Auth page
    navigate('/auth');
  };

  return (
    // 'flex-1' ensures it shares space with the footer properly
    <div className="w-full flex-1 flex flex-col items-center justify-center relative overflow-hidden font-sans py-12">
      
      {/* Background Abstract Shapes */}
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-500 via-white to-green-500 z-50"></div>
      <div className="absolute -top-20 -left-20 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
      <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-orange-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>

      {/* Main Container */}
      <div className="z-10 w-full max-w-5xl px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        
        {/* Left Side: Branding & Info */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="text-left"
        >
          <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 px-4 py-2 rounded-full mb-6">
            <ShieldCheck size={16} className="text-blue-600" />
            <span className="text-xs font-bold text-blue-800 uppercase tracking-wider">Official Government Portal</span>
          </div>
          
          <h1 className="text-6xl font-black text-[#1e3a8a] leading-tight mb-4">
            SUVIDHA <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-600">KIOSK</span>
          </h1>
          
          <p className="text-xl text-slate-500 font-medium mb-8 leading-relaxed max-w-md">
            Your one-stop digital gateway for Electricity, Water, Gas, and Municipal services. 
            <br/><span className="text-sm text-slate-400 mt-2 block font-bold uppercase tracking-widest">Govt. of India</span>
          </p>
        </motion.div>

        {/* Right Side: Language Selection Cards */}
        <div className="flex flex-col gap-6 w-full max-w-md mx-auto">
          <p className="text-center text-slate-400 font-bold text-xs uppercase tracking-[0.2em] mb-2">Select Language / भाषा चुनें</p>
          
          {/* English Card */}
          <motion.button
            whileHover={{ scale: 1.02, y: -5 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleSelection('en')}
            className="group relative overflow-hidden bg-white p-6 rounded-3xl shadow-xl border-2 border-transparent hover:border-blue-500 transition-all text-left flex items-center justify-between"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -mr-10 -mt-10 transition-transform group-hover:scale-150"></div>
            <div className="relative z-10 flex items-center gap-6">
               <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-blue-200">En</div>
               <div>
                 <h3 className="text-2xl font-black text-slate-800 group-hover:text-blue-700 transition-colors">English</h3>
                 <p className="text-slate-500 text-sm font-medium">Click to Proceed</p>
               </div>
            </div>
            <ArrowRight className="text-slate-300 group-hover:text-blue-600 transition-colors relative z-10" />
          </motion.button>

          {/* Hindi Card */}
          <motion.button
            whileHover={{ scale: 1.02, y: -5 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleSelection('hi')}
            className="group relative overflow-hidden bg-white p-6 rounded-3xl shadow-xl border-2 border-transparent hover:border-orange-500 transition-all text-left flex items-center justify-between"
          >
             <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50 rounded-full -mr-10 -mt-10 transition-transform group-hover:scale-150"></div>
             <div className="relative z-10 flex items-center gap-6">
               <div className="w-16 h-16 bg-orange-500 rounded-2xl flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-orange-200">हि</div>
               <div>
                 <h3 className="text-2xl font-black text-slate-800 group-hover:text-orange-600 transition-colors">हिंदी</h3>
                 <p className="text-slate-500 text-sm font-medium">आगे बढ़ने के लिए क्लिक करें</p>
               </div>
            </div>
            <ArrowRight className="text-slate-300 group-hover:text-orange-600 transition-colors relative z-10" />
          </motion.button>

        </div>
      </div>
    </div>
  );
};

export default Welcome;
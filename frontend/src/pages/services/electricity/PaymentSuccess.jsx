import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, Home, Printer, Download } from 'lucide-react';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [showReceipt, setShowReceipt] = useState(false);

  // Generate a random Transaction ID
  const transactionId = "TXN" + Math.floor(10000000 + Math.random() * 90000000);

  useEffect(() => {
    // Show receipt details after a slight delay for effect
    setTimeout(() => setShowReceipt(true), 800);
  }, []);

  return (
    <div className="h-full flex flex-col items-center justify-center relative z-10 px-4">
      
      {/* 1. Success Animation */}
      <motion.div 
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 10 }}
        className="w-32 h-32 bg-green-500 rounded-full flex items-center justify-center shadow-green-200 shadow-2xl mb-8"
      >
        <Check size={64} className="text-white stroke-[4]" />
      </motion.div>

      {/* 2. Success Message */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-center space-y-2 mb-10"
      >
        <h1 className="text-3xl font-black text-slate-800">Payment Successful!</h1>
        <p className="text-slate-500 font-medium">Your electricity bill has been paid.</p>
      </motion.div>

      {/* 3. The Digital Receipt Ticket */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 w-full max-w-md relative overflow-hidden"
      >
        {/* Decorative Top Border */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-400 to-emerald-600"></div>

        <div className="space-y-4">
          <div className="flex justify-between border-b border-slate-100 pb-4">
            <span className="text-slate-400 font-bold text-xs uppercase tracking-wider">Transaction ID</span>
            <span className="text-slate-800 font-mono font-bold">{transactionId}</span>
          </div>
          
          <div className="flex justify-between border-b border-slate-100 pb-4">
            <span className="text-slate-400 font-bold text-xs uppercase tracking-wider">Date & Time</span>
            <span className="text-slate-800 font-bold text-sm">05 Feb 2026, 10:42 AM</span>
          </div>

          <div className="flex justify-between items-center pt-2">
            <span className="text-slate-400 font-bold text-xs uppercase tracking-wider">Amount Paid</span>
            <span className="text-3xl font-black text-green-600">₹ 1,450.00</span>
          </div>
        </div>

        {/* Barcode Decoration */}
        <div className="mt-8 opacity-20">
          <div className="h-8 w-full bg-slate-800" style={{ clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%, 10% 50%, 0% 0%)' }}></div> 
          {/* (Just a visual bar, simplified) */}
          <div className="flex justify-between mt-1">
             {[...Array(12)].map((_,i) => <div key={i} className="w-1 h-4 bg-black"></div>)}
          </div>
        </div>

      </motion.div>

      {/* 4. Action Buttons */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="flex gap-4 mt-10 w-full max-w-md"
      >
        <button 
          onClick={() => window.print()} 
          className="flex-1 py-4 bg-white border border-slate-200 text-slate-600 font-bold rounded-xl shadow-sm hover:bg-slate-50 flex items-center justify-center gap-2"
        >
          <Printer size={20} /> Print
        </button>
        
        <button 
          onClick={() => navigate('/dashboard')}
          className="flex-1 py-4 bg-[#1A365D] text-white font-bold rounded-xl shadow-lg hover:shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          <Home size={20} /> Dashboard
        </button>
      </motion.div>

    </div>
  );
};

export default PaymentSuccess;
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, Home, Printer, Download, Copy, CheckCircle2, Sparkles } from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const { lang } = useLanguage();
  const [copied, setCopied] = useState(false);
  const [showContent, setShowContent] = useState(false);

  // Cache sessionStorage data in a ref so it survives React StrictMode double-mount
  const dataRef = useRef(null);
  if (!dataRef.current) {
    const paymentResult = JSON.parse(sessionStorage.getItem('paymentResult') || '{}');
    const billData = JSON.parse(sessionStorage.getItem('billData') || '{}');
    dataRef.current = { paymentResult, billData };
  }
  const { paymentResult, billData } = dataRef.current;

  // Use paymentResult with billData as fallback
  const transactionId = paymentResult.transactionId || billData.paymentIntentId || 'N/A';
  const amountRupees = paymentResult.amountRupees || billData.amountRupees || (billData.amountPaise ? (billData.amountPaise / 100).toFixed(2) : '0.00');
  const consumerId = paymentResult.consumerId || billData.consumerId || '—';
  const invoiceUrl = paymentResult.invoiceUrl || null;
  const paymentDate = paymentResult.date
    ? new Date(paymentResult.date).toLocaleString('en-IN', {
        day: '2-digit', month: 'short', year: 'numeric',
        hour: '2-digit', minute: '2-digit', hour12: true,
      })
    : new Date().toLocaleString('en-IN', {
        day: '2-digit', month: 'short', year: 'numeric',
        hour: '2-digit', minute: '2-digit', hour12: true,
      });

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 600);
    // Clean up sessionStorage only when user navigates away (not on StrictMode remount)
    return () => {
      clearTimeout(timer);
    };
  }, []);

  const handleCopyId = () => {
    if (transactionId !== 'N/A') {
      navigator.clipboard.writeText(transactionId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownloadReceipt = () => {
    if (invoiceUrl) {
      window.open(invoiceUrl, '_blank');
    }
  };

  return (
    <div className="h-full flex flex-col items-center justify-center px-4 py-6">
      
      {/* Confetti-like decorative dots */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full"
            style={{
              background: ['#10B981', '#3B82F6', '#F59E0B', '#8B5CF6', '#EC4899'][i % 5],
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: [0, 0.6, 0], scale: [0, 1.5, 0] }}
            transition={{ delay: 0.3 + i * 0.1, duration: 2, ease: 'easeOut' }}
          />
        ))}
      </div>

      {/* 1. Success Animation */}
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 12 }}
        className="relative mb-6"
      >
        <div className="w-28 h-28 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center shadow-lg shadow-green-200">
          <Check size={56} className="text-white stroke-[3]" />
        </div>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5 }}
          className="absolute -top-1 -right-1 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center shadow-md"
        >
          <Sparkles size={16} className="text-white" />
        </motion.div>
      </motion.div>

      {/* 2. Success Message */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-center space-y-1 mb-8"
      >
        <h1 className="text-2xl font-black text-slate-800 uppercase tracking-tight">
          {lang === 'en' ? 'Payment Successful!' : 'भुगतान सफल!'}
        </h1>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          {lang === 'en' ? 'Your electricity bill has been paid successfully.' : 'आपका बिजली का बिल सफलतापूर्वक भुगतान हो गया है।'}
        </p>
      </motion.div>

      {/* 3. Receipt Card */}
      {showContent && (
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 120 }}
          className="bg-white rounded-3xl shadow-xl border border-slate-100 w-full max-w-md relative overflow-hidden"
        >
          {/* Ticket top decoration */}
          <div className="h-2 bg-gradient-to-r from-green-400 via-emerald-500 to-green-600" />
          
          {/* Amount section */}
          <div className="bg-gradient-to-br from-slate-50 to-white p-6 text-center border-b border-dashed border-slate-200">
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">
              {lang === 'en' ? 'Amount Paid' : 'भुगतान राशि'}
            </p>
            <p className="text-5xl font-black text-green-600">₹{amountRupees}</p>
          </div>

          {/* Details */}
          <div className="p-6 space-y-3">
            <div className="flex justify-between items-center py-2">
              <span className="text-slate-400 font-bold text-xs uppercase tracking-wider">
                {lang === 'en' ? 'Transaction ID' : 'लेनदेन आईडी'}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-slate-700 font-mono font-bold text-sm">
                  {transactionId.length > 20 ? `${transactionId.slice(0, 10)}...${transactionId.slice(-6)}` : transactionId}
                </span>
                {transactionId !== 'N/A' && (
                  <button
                    onClick={handleCopyId}
                    className="p-1 rounded-md hover:bg-slate-100 transition-colors"
                    title="Copy"
                  >
                    {copied ? <CheckCircle2 size={14} className="text-green-500" /> : <Copy size={14} className="text-slate-400" />}
                  </button>
                )}
              </div>
            </div>
            
            <div className="flex justify-between items-center py-2 border-t border-slate-50">
              <span className="text-slate-400 font-bold text-xs uppercase tracking-wider">
                {lang === 'en' ? 'Date & Time' : 'दिनांक और समय'}
              </span>
              <span className="text-slate-700 font-semibold text-sm">{paymentDate}</span>
            </div>

            <div className="flex justify-between items-center py-2 border-t border-slate-50">
              <span className="text-slate-400 font-bold text-xs uppercase tracking-wider">
                {lang === 'en' ? 'Consumer No.' : 'उपभोक्ता क्र.'}
              </span>
              <span className="text-slate-700 font-mono font-bold text-sm">{consumerId}</span>
            </div>

            <div className="flex justify-between items-center py-2 border-t border-slate-50">
              <span className="text-slate-400 font-bold text-xs uppercase tracking-wider">
                {lang === 'en' ? 'Status' : 'स्थिति'}
              </span>
              <span className="inline-flex items-center gap-1.5 bg-green-50 text-green-700 text-xs font-black py-1.5 px-3 rounded-full uppercase tracking-wider">
                <CheckCircle2 size={12} /> {lang === 'en' ? 'Paid' : 'भुगतान हो गया'}
              </span>
            </div>
          </div>

          {/* Ticket Tear Effect */}
          <div className="relative">
            <div className="absolute -left-3 top-0 w-6 h-6 bg-slate-50 rounded-full" />
            <div className="absolute -right-3 top-0 w-6 h-6 bg-slate-50 rounded-full" />
            <div className="border-t border-dashed border-slate-200" />
          </div>

          {/* Barcode Decoration */}
          <div className="p-5 bg-slate-50">
            <div className="flex justify-center gap-[2px]">
              {[...Array(40)].map((_, i) => (
                <div
                  key={i}
                  className="bg-slate-300"
                  style={{
                    width: Math.random() > 0.5 ? 2 : 1,
                    height: 28,
                    opacity: 0.3 + Math.random() * 0.5,
                  }}
                />
              ))}
            </div>
            <p className="text-center text-[10px] text-slate-400 font-mono mt-2">SUVIDHA-{paymentResult.paymentId?.slice(-8)?.toUpperCase() || 'XXXXXXXX'}</p>
          </div>
        </motion.div>
      )}

      {/* 4. Action Buttons */}
      {showContent && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col gap-3 mt-8 w-full max-w-md"
        >
          {/* Download / Print Row */}
          <div className="flex gap-3">
            {invoiceUrl ? (
              <button
                onClick={handleDownloadReceipt}
                className="flex-1 py-3.5 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl shadow-sm hover:bg-slate-50 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <Download size={18} className="text-green-600" />
                {lang === 'en' ? 'Download Receipt' : 'रसीद डाउनलोड करें'}
              </button>
            ) : (
              <button
                onClick={() => window.print()}
                className="flex-1 py-3.5 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl shadow-sm hover:bg-slate-50 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <Printer size={18} />
                {lang === 'en' ? 'Print' : 'प्रिंट'}
              </button>
            )}
          </div>

          {/* Dashboard Button */}
          <button
            onClick={() => { sessionStorage.removeItem('billData'); sessionStorage.removeItem('paymentResult'); navigate('/dashboard'); }}
            className="w-full py-4 bg-[#1e3a8a] text-white font-bold rounded-xl shadow-lg hover:shadow-xl active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <Home size={20} />
            {lang === 'en' ? 'Back to Dashboard' : 'डैशबोर्ड पर वापस जाएं'}
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default PaymentSuccess;
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, CreditCard, ShieldCheck } from 'lucide-react';
import { profileAPI } from '../../../services/api';
import { useLanguage } from '../../../context/LanguageContext';

const BillSummary = () => {
  const navigate = useNavigate();
  const { t, lang } = useLanguage();
  const [error, setError] = useState('');
  const [profile, setProfile] = useState(null);

  // Read bill data from sessionStorage (set by BillPayment page)
  const storedBill = JSON.parse(sessionStorage.getItem('billData') || '{}');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await profileAPI.getProfile();
        setProfile(res.data);
      } catch (err) {
        console.error('Failed to fetch profile:', err);
      }
    };
    fetchProfile();
  }, []);

  const billDetails = {
    consumerName: profile?.name || 'Loading...',
    consumerId: storedBill.consumerId || '—',
    billDate: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
    dueDate: new Date(Date.now() + 15 * 86400000).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
    amount: storedBill.amountRupees || '0.00',
    address: profile?.address || 'Loading...',
    cityWard: profile?.cityWard || '',
  };

  const handleProceedToPay = () => {
    if (!storedBill.paymentIntentId) {
      setError('No payment data found. Please go back and try again.');
      return;
    }
    navigate('/service/electricity/card-payment');
  };

  return (
    <div className="h-full flex flex-col max-w-2xl mx-auto">
      
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button 
          onClick={() => navigate(-1)}
          className="p-3 bg-white rounded-xl border-2 border-slate-200 text-slate-400 hover:border-[#1e3a8a] hover:text-[#1e3a8a] transition-all active:scale-95"
        >
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-2xl font-black text-slate-800 uppercase tracking-tight">{t('billSummary')}</h1>
      </div>

      {/* THE DIGITAL BILL CARD */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-200"
      >
        {/* Top Strip */}
        <div className="bg-[#1A365D] p-6 text-white flex justify-between items-center">
          <div>
            <h2 className="text-lg font-bold">{lang === 'en' ? 'Electricity Bill' : 'बिजली बिल'}</h2>
            <p className="text-blue-200 text-xs">{lang === 'en' ? 'Bill Summary' : 'बिल सारांश'}</p>
          </div>
          <div className="text-right">
            <p className="text-xs font-medium opacity-70">{t('billDate')}</p>
            <p className="font-bold">{billDetails.billDate}</p>
          </div>
        </div>

        {/* Bill Details */}
        <div className="p-8 space-y-6">
          
          <div className="flex justify-between border-b border-slate-100 pb-4">
            <div>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">{t('consumerName')}</p>
              <p className="text-lg font-bold text-slate-800">{billDetails.consumerName}</p>
            </div>
            <div className="text-right">
               <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">{t('consumerNo')}</p>
               <p className="text-lg font-mono font-bold text-slate-600">{billDetails.consumerId}</p>
            </div>
          </div>

          <div>
             <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">{t('billingAddress')}</p>
             <p className="text-sm font-medium text-slate-600">{billDetails.address}</p>
             {billDetails.cityWard && <p className="text-xs text-slate-500 mt-1">{billDetails.cityWard}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl">
             <div>
                <p className="text-xs text-slate-400 font-bold">{t('billDate')}</p>
                <p className="font-semibold text-slate-700">{billDetails.billDate}</p>
             </div>
             <div>
                <p className="text-xs text-slate-400 font-bold">{t('dueDate')}</p>
                <p className="font-semibold text-red-600">{billDetails.dueDate}</p>
             </div>
          </div>

          {/* Total Amount */}
          <div className="flex justify-between items-center pt-2">
            <span className="text-xl font-bold text-slate-800">{t('totalPayable')}</span>
            <span className="text-4xl font-black text-[#1A365D]">₹ {billDetails.amount}</span>
          </div>

        </div>

        {/* Action Button */}
        <div className="p-6 bg-slate-50 border-t border-slate-100">
          <button 
            onClick={handleProceedToPay}
            className="w-full py-4 rounded-xl bg-[#1e3a8a] text-white font-bold text-lg shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <CreditCard size={20} /> {t('payBillNow')}
          </button>
          <p className="text-center text-xs text-slate-400 mt-3 flex items-center justify-center gap-1">
            <ShieldCheck size={12} /> {t('secureTransaction')}
          </p>
          {error && (
            <p className="text-center text-sm text-red-600 font-bold mt-3 animate-pulse">{error}</p>
          )}
        </div>

      </motion.div>
    </div>
  );
};

export default BillSummary;
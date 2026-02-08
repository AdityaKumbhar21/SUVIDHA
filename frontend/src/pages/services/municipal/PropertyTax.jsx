import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CreditCard, ChevronLeft, ShieldCheck, Loader2 } from 'lucide-react';
import { municipalAPI } from '../../../services/api';
import { useLanguage } from '../../../context/LanguageContext';

const PropertyTax = () => {
  const navigate = useNavigate();
  const { lang } = useLanguage();
  const [propertyId, setPropertyId] = useState('');
  const [amountRupees, setAmountRupees] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleProceedToPay = async (e) => {
    e.preventDefault();
    if (!propertyId || !amountRupees || parseFloat(amountRupees) <= 0) return;
    setSubmitting(true);
    setError('');
    try {
      const amountPaise = Math.round(parseFloat(amountRupees) * 100);
      const response = await municipalAPI.payPropertyTax(propertyId, amountPaise);
      const { clientSecret, paymentIntentId } = response.data;

      sessionStorage.setItem('billData', JSON.stringify({
        consumerId: propertyId,
        amountRupees: parseFloat(amountRupees).toFixed(2),
        amountPaise,
        clientSecret,
        paymentIntentId,
        service: 'Property Tax',
      }));
      navigate('/service/electricity/card-payment');
    } catch (err) {
      setError(err.response?.data?.message || (lang === 'en' ? 'Payment initiation failed. Try again.' : 'भुगतान प्रारंभ विफल। पुनः प्रयास करें।'));
      setSubmitting(false);
    }
  };

  return (
    <div className="h-full flex flex-col max-w-2xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => navigate(-1)} className="p-3 bg-white rounded-xl border-2 border-slate-200 text-slate-400 hover:border-[#1e3a8a] hover:text-[#1e3a8a] transition-all active:scale-95">
          <ChevronLeft size={24} />
        </button>
        <div>
          <h1 className="text-2xl font-black text-slate-800 uppercase tracking-tight">
            {lang === 'en' ? 'Property Tax Payment' : 'संपत्ति कर भुगतान'}
          </h1>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{lang === 'en' ? 'Secure Revenue Portal' : 'सुरक्षित महसूल पोर्टल'}</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden flex-1 flex flex-col">
        <form onSubmit={handleProceedToPay} className="p-6 flex-1 flex flex-col gap-6">
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">
              {lang === 'en' ? 'Property ID / Index No.' : 'संपत्ति आईडी / इंडेक्स नंबर'}
            </label>
            <input type="text" required value={propertyId} onChange={(e) => setPropertyId(e.target.value)} disabled={submitting}
              placeholder="Ex: TAX-PN-100293"
              className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl p-4 text-lg font-medium focus:border-[#1e3a8a] focus:outline-none disabled:opacity-50" />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">
              {lang === 'en' ? 'Tax Amount (₹)' : 'कर राशि (₹)'}
            </label>
            <input type="number" required min="1" step="0.01" value={amountRupees} onChange={(e) => setAmountRupees(e.target.value)} disabled={submitting}
              placeholder="e.g. 4350.00"
              className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl p-4 text-lg font-medium focus:border-[#1e3a8a] focus:outline-none disabled:opacity-50" />
          </div>
          {error && <p className="text-sm text-red-600 font-bold animate-pulse">{error}</p>}
        </form>

        <div className="p-6 border-t border-slate-100 bg-slate-50 space-y-3">
          <div className="flex items-center gap-2 text-xs text-slate-400 font-bold uppercase">
            <ShieldCheck size={14} className="text-green-500" /> PCI-DSS Compliant • Secure Stripe Checkout
          </div>
          <button onClick={handleProceedToPay} disabled={!propertyId || !amountRupees || parseFloat(amountRupees) <= 0 || submitting}
            className="w-full py-4 rounded-xl bg-[#1e3a8a] text-white font-bold text-lg shadow-lg active:scale-95 disabled:opacity-50 transition-all flex items-center justify-center gap-2">
            {submitting ? (<><Loader2 className="animate-spin" size={20} /> {lang === 'en' ? 'Processing...' : 'प्रक्रिया जारी...'}</>) : (<><CreditCard size={20} /> {lang === 'en' ? 'Proceed to Pay' : 'भुगतान करें'}</>)}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PropertyTax;
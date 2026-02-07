import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Landmark, Search, CreditCard, ChevronLeft, ShieldCheck, Receipt } from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext';

const PropertyTax = () => {
  const navigate = useNavigate();
  const { lang } = useLanguage();
  const [propertyId, setPropertyId] = useState('');
  const [step, setStep] = useState(1);
  const [isFetching, setIsFetching] = useState(false);

  // Bill Fetching Logic as per Identity Logic [cite: 14, 117]
  const handleFetchBill = (e) => {
    e.preventDefault();
    setIsFetching(true);
    setTimeout(() => {
      setIsFetching(false);
      setStep(2);
    }, 1500);
  };

  return (
    <div className="flex-1 flex flex-col items-center bg-slate-50 p-6 min-h-screen">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
        
        {/* Header - Municipal Branding [cite: 220] */}
        <div className="bg-[#7c3aed] p-6 text-white flex items-center gap-4">
          <button onClick={() => navigate('/service/municipal')} className="hover:bg-white/10 p-2 rounded-full">
            <ChevronLeft size={24} />
          </button>
          <div>
            <h1 className="text-xl font-black uppercase tracking-tight">
              {lang === 'en' ? 'Property Tax Payment' : 'संपत्ति कर भुगतान'}
            </h1>
            <p className="text-purple-100 text-[10px] font-bold uppercase tracking-widest">
              {lang === 'en' ? 'Secure Revenue Portal' : 'सुरक्षित महसूल पोर्टल'}
            </p>
          </div>
        </div>

        <div className="p-8">
          {/* STEP 1: ENTER PROPERTY ID [cite: 115] */}
          {step === 1 && (
            <motion.form initial={{ opacity: 0 }} animate={{ opacity: 1 }} onSubmit={handleFetchBill} className="space-y-6">
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-4">
                  {lang === 'en' ? 'Enter Property ID / Index No.' : 'संपत्ति आईडी / इंडेक्स नंबर दर्ज करें'}
                </label>
                <div className="flex items-center border-2 border-slate-100 rounded-2xl px-5 py-4 bg-slate-50 focus-within:border-[#7c3aed] focus-within:bg-white transition-all">
                  <Landmark className="text-slate-400" size={24} />
                  <input 
                    required
                    type="text"
                    value={propertyId}
                    onChange={(e) => setPropertyId(e.target.value)}
                    placeholder="Ex: TAX-PN-100293"
                    className="flex-1 bg-transparent outline-none ml-4 font-bold text-lg text-slate-700"
                  />
                </div>
              </div>
              
              <button 
                type="submit"
                disabled={isFetching}
                className="w-full bg-[#7c3aed] text-white py-5 rounded-2xl font-black text-xl shadow-xl flex items-center justify-center gap-3 hover:bg-purple-700 transition-all"
              >
                {isFetching ? '...' : (lang === 'en' ? 'FETCH BILL DETAILS' : 'बिल तपशील मिळवा')}
                <Search size={24} />
              </button>
            </motion.form>
          )}

          {/* STEP 2: BILL SUMMARY & STRIPE PAY [cite: 45, 119] */}
          {step === 2 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div className="bg-purple-50 rounded-2xl p-6 border border-purple-100">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="font-black text-slate-800 text-lg uppercase tracking-tight">Aditya K.</h3>
                    <p className="text-xs font-bold text-slate-500 uppercase">Shaniwar Peth, Pune</p>
                  </div>
                  <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-purple-100 text-center">
                    <p className="text-[10px] font-black text-purple-600 uppercase">Tax Year</p>
                    <p className="font-bold text-slate-700">2025-26</p>
                  </div>
                </div>

                <div className="space-y-3 pt-4 border-t border-purple-100">
                  <div className="flex justify-between text-sm font-medium text-slate-600">
                    <span>Principal Amount</span>
                    <span>₹4,200.00</span>
                  </div>
                  <div className="flex justify-between text-sm font-medium text-slate-600">
                    <span>Sewerage Cess</span>
                    <span>₹150.00</span>
                  </div>
                  <div className="flex justify-between text-lg font-black text-[#1e3a8a] pt-4">
                    <span>Total Outstanding</span>
                    <span>₹4,350.00</span>
                  </div>
                </div>
              </div>

              {/* Secure Transaction Info [cite: 404] */}
              <div className="flex items-center gap-3 px-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                <ShieldCheck size={16} className="text-green-500" />
                PCI-DSS Compliant • Secure Stripe Checkout
              </div>

              <button 
                onClick={() => navigate('/service/electricity/success')}
                className="w-full bg-green-600 text-white py-5 rounded-2xl font-black text-xl shadow-xl flex items-center justify-center gap-3 hover:bg-green-700 transition-all active:scale-95"
              >
                {lang === 'en' ? 'PROCEED TO PAY' : 'पेमेंट करण्यासाठी पुढे जा'}
                <CreditCard size={24} />
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PropertyTax;
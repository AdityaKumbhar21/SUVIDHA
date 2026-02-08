import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, Send, Loader2, CheckCircle } from 'lucide-react';
import { electricityAPI } from '../../../services/api';
import { useLanguage } from '../../../context/LanguageContext';

const LoadChange = () => {
  const navigate = useNavigate();
  const { lang } = useLanguage();
  const [currentLoad, setCurrentLoad] = useState('');
  const [requestedLoad, setRequestedLoad] = useState('');
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async () => {
    if (!requestedLoad || Number(requestedLoad) <= 0 || !reason) return;

    setSubmitting(true);
    try {
      const response = await electricityAPI.requestLoadChange({
        requestedLoad: Number(requestedLoad),
        currentLoad: currentLoad ? Number(currentLoad) : undefined,
        reason,
      });
      setSuccess(response.data.complaintId);
      setTimeout(() => navigate('/dashboard'), 3000);
    } catch (err) {
      alert(err.response?.data?.message || (lang === 'en' ? 'Failed to submit request.' : 'अनुरोध सबमिट करने में विफल।'));
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="h-full flex flex-col items-center justify-center px-4">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="bg-white p-10 rounded-3xl shadow-xl border border-green-100 text-center max-w-md w-full">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={48} className="text-green-600" />
          </div>
          <h2 className="text-2xl font-black text-slate-800 mb-2">{lang === 'en' ? 'Request Submitted!' : 'अनुरोध सबमिट!'}</h2>
          <p className="text-slate-500 text-sm">{lang === 'en' ? 'Load change request is being processed.' : 'लोड परिवर्तन अनुरोध प्रक्रिया में है।'}</p>
          <div className="mt-4 bg-slate-50 px-4 py-2 rounded-full text-xs font-mono text-slate-500">ID: {success}</div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col max-w-2xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => navigate(-1)} className="p-3 bg-white rounded-xl border-2 border-slate-200 text-slate-400 hover:border-[#1e3a8a] hover:text-[#1e3a8a] transition-all active:scale-95">
          <ChevronLeft size={24} />
        </button>
        <div>
          <h1 className="text-2xl font-black text-slate-800 uppercase tracking-tight">
            {lang === 'en' ? 'Load Change Request' : 'लोड परिवर्तन अनुरोध'}
          </h1>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{lang === 'en' ? 'Increase or decrease sanctioned load' : 'स्वीकृत लोड बढ़ाएं या घटाएं'}</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden flex-1 flex flex-col">
        <div className="p-6 flex-1 flex flex-col gap-6">

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">
                {lang === 'en' ? 'Current Load (kW)' : 'वर्तमान लोड (kW)'}
              </label>
              <input
                type="number"
                value={currentLoad}
                onChange={(e) => setCurrentLoad(e.target.value)}
                disabled={submitting}
                placeholder="e.g. 3"
                min="0.5"
                step="0.5"
                className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl p-4 text-lg font-medium focus:border-[#1e3a8a] focus:outline-none disabled:opacity-50"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">
                {lang === 'en' ? 'Requested Load (kW)' : 'अनुरोधित लोड (kW)'}
              </label>
              <input
                type="number"
                value={requestedLoad}
                onChange={(e) => setRequestedLoad(e.target.value)}
                disabled={submitting}
                placeholder="e.g. 5"
                min="0.5"
                step="0.5"
                className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl p-4 text-lg font-medium focus:border-[#1e3a8a] focus:outline-none disabled:opacity-50"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">
              {lang === 'en' ? 'Reason for Change' : 'परिवर्तन का कारण'}
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              disabled={submitting}
              placeholder={lang === 'en' ? 'e.g. Adding air conditioner, expanding home office...' : 'जैसे एयर कंडीशनर जोड़ना, होम ऑफिस विस्तार...'}
              className="w-full h-28 bg-slate-50 border-2 border-slate-200 rounded-xl p-4 text-lg font-medium focus:border-[#1e3a8a] focus:outline-none resize-none disabled:opacity-50"
            />
          </div>

        </div>

        <div className="p-6 border-t border-slate-100 bg-slate-50">
          <button
            onClick={handleSubmit}
            disabled={!requestedLoad || Number(requestedLoad) <= 0 || !reason || submitting}
            className="w-full py-4 rounded-xl bg-[#1e3a8a] text-white font-bold text-lg shadow-lg active:scale-95 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
          >
            {submitting ? (
              <><Loader2 className="animate-spin" size={20} /> {lang === 'en' ? 'Submitting...' : 'सबमिट हो रहा है...'}</>
            ) : (
              <><Send size={20} /> {lang === 'en' ? 'Submit Request' : 'अनुरोध सबमिट करें'}</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoadChange;

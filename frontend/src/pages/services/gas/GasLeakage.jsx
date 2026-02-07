import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, MapPin, Camera, Send, ShieldAlert, Loader } from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext';
import { gasAPI } from '../../../services/api';

const GasLeakage = () => {
  const navigate = useNavigate();
  const { lang } = useLanguage();
  const [showWarning, setShowWarning] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [location, setLocation] = useState('Connaught Place, New Delhi 110001');
  const [photoFile, setPhotoFile] = useState(null);
  const [userPhone, setUserPhone] = useState('');

  useEffect(() => {
    // Get user phone from localStorage
    const phone = localStorage.getItem('userPhone') || '';
    setUserPhone(phone);
  }, []);

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
    }
  };

  const handleCriticalSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      // Create FormData for gas leakage report
      const formData = new FormData();
      formData.append('description', 'Gas leak emergency - immediate attention required');
      formData.append('location', location);
      if (photoFile) {
        formData.append('photo', photoFile);
      }

      // Call the API to report gas leakage
      const response = await gasAPI.reportLeakage(formData);
      
      const complaintId = response.data.complaintId || 'GAS-EMG-911';
      alert(lang === 'en' ? `EMERGENCY: Team Dispatched. ID: ${complaintId}` : `आपातकालीन: टीम भेजी गई। आईडी: ${complaintId}`);
      navigate('/dashboard');
    } catch (err) {
      console.error('Error submitting gas leakage report:', err);
      alert(err.response?.data?.message || 'Failed to submit emergency alert. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 flex flex-col items-center">
      
      {/* --- SAFETY WARNING MODAL  --- */}
      <AnimatePresence>
        {showWarning && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-red-900/90 backdrop-blur-md flex items-center justify-center p-6"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }}
              className="bg-white rounded-3xl max-w-lg w-full p-8 shadow-2xl text-center border-4 border-orange-500"
            >
              <div className="bg-red-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertTriangle size={48} className="text-red-600 animate-pulse" />
              </div>
              <h2 className="text-3xl font-black text-red-600 mb-4 uppercase">
                {lang === 'en' ? 'Safety Warning' : 'सुरक्षा सूचना'}
              </h2>
              <ul className="text-left space-y-3 text-slate-700 font-bold mb-8">
                <li className="flex gap-2">⚠️ {lang === 'en' ? 'Do not use mobile phones near the leak.' : 'गळतीजवळ मोबाईल फोन वापरू नका.'}</li>
                <li className="flex gap-2">⚠️ {lang === 'en' ? 'Do not switch on/off any electrical appliances.' : 'कोणतीही विद्युत उपकरणे चालू/बंद करू नका.'}</li>
                <li className="flex gap-2">⚠️ {lang === 'en' ? 'Open all windows and doors.' : 'सभी खिड़कियां और दरवाज़े खोलें।'}</li>
              </ul>
              <button 
                onClick={() => setShowWarning(false)}
                className="w-full bg-red-600 text-white py-4 rounded-xl font-black text-lg shadow-lg hover:bg-red-700 transition-all"
              >
                {lang === 'en' ? 'I AM IN A SAFE AREA' : 'मैं सुरक्षित क्षेत्र में हूं'}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- COMPLAINT FORM [cite: 155] --- */}
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl border border-red-100 overflow-hidden">
        <div className="bg-red-600 p-6 text-white flex items-center gap-4">
          <ShieldAlert size={32} />
          <div>
            <h1 className="font-black text-xl uppercase tracking-tight">{lang === 'en' ? 'Report Gas Leakage' : 'गैस रिसाव की शिकायत करें'}</h1>
            <p className="text-red-100 text-xs font-bold uppercase">{lang === 'en' ? 'High Priority - AI Marked Critical' : 'उच्च प्राथमिकता - AI द्वारे क्रिटिकल मार्क'}</p>
          </div>
        </div>

        <div className="p-8 space-y-8">
          {/* Auto-detect Address  */}
          <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl flex items-center gap-4">
            <MapPin className="text-[#1e3a8a]" />
            <div>
              <p className="text-[10px] font-black text-blue-400 uppercase">{lang === 'en' ? 'Detected Location' : 'शोधलेले ठिकाण'}</p>
              <p className="text-sm font-bold text-slate-700">{location}</p>
            </div>
          </div>

          {/* Photo Upload [cite: 163] */}
          <label className="border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center hover:border-red-400 transition-colors group cursor-pointer block disabled:opacity-50">
            <Camera size={40} className="mx-auto text-slate-300 group-hover:text-red-500 mb-2" />
            <p className="text-sm font-bold text-slate-500">{photoFile ? 'Photo Selected' : (lang === 'en' ? 'Upload Proof (Optional)' : 'सबूत अपलोड करें (वैकल्पिक)')}</p>
            <input 
              type="file" 
              accept="image/*"
              onChange={handlePhotoUpload}
              disabled={isSubmitting}
              className="hidden"
            />
          </label>

          <button 
            onClick={handleCriticalSubmit}
            disabled={isSubmitting}
            className={`w-full py-5 rounded-2xl font-black text-xl shadow-2xl flex items-center justify-center gap-3 transition-all disabled:opacity-70 ${
              isSubmitting ? 'bg-slate-200 text-slate-400' : 'bg-red-600 text-white hover:bg-red-700 hover:-translate-y-1'
            }`}
          >
            {isSubmitting ? (
              <>
                <Loader size={24} className="animate-spin" />
                {lang === 'en' ? 'Submitting...' : 'सबमिट हो रहा है...'}
              </>
            ) : (
              <>
                {lang === 'en' ? 'SUBMIT EMERGENCY ALERT' : 'आपातकालीन अलर्ट सबमिट करें'}
                <Send size={24} />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default GasLeakage;
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Send, ShieldAlert, Loader } from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext';
import { gasAPI } from '../../../services/api';
import LocationPicker from '../../../components/forms/LocationPicker';
import DescriptionPicker from '../../../components/forms/DescriptionPicker';

const GAS_LEAK_REASONS = [
  { value: 'Gas leak emergency - strong smell of gas inside house', label: 'Strong smell of gas inside house' },
  { value: 'Gas leak emergency - hissing sound from pipeline', label: 'Hissing sound from pipeline' },
  { value: 'Gas leak emergency - gas smell near meter or regulator', label: 'Gas smell near meter / regulator' },
  { value: 'Gas leak emergency - gas pipeline damaged', label: 'Gas pipeline damaged' },
  { value: 'Gas leak emergency - smell of gas outdoors in locality', label: 'Smell of gas outdoors in locality' },
  { value: 'Gas leak emergency - immediate attention required', label: 'Other gas leak emergency' },
];

const GAS_LEAK_REASONS_HI = [
  { value: 'Gas leak emergency - strong smell of gas inside house', label: 'घर के अंदर गैस की तेज़ गंध' },
  { value: 'Gas leak emergency - hissing sound from pipeline', label: 'पाइपलाइन से सीटी की आवाज़' },
  { value: 'Gas leak emergency - gas smell near meter or regulator', label: 'मीटर / रेगुलेटर के पास गैस की गंध' },
  { value: 'Gas leak emergency - gas pipeline damaged', label: 'गैस पाइपलाइन क्षतिग्रस्त' },
  { value: 'Gas leak emergency - smell of gas outdoors in locality', label: 'बाहर इलाके में गैस की गंध' },
  { value: 'Gas leak emergency - immediate attention required', label: 'अन्य गैस रिसाव आपातकाल' },
];

const GasLeakage = () => {
  const navigate = useNavigate();
  const { lang } = useLanguage();
  const [showWarning, setShowWarning] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('Gas leak emergency - immediate attention required');


  const handleCriticalSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      // Create FormData for gas leakage report
      const formData = new FormData();
      formData.append('description', description || 'Gas leak emergency - immediate attention required');
      formData.append('location', location);

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
          {/* Location Input */}
          <LocationPicker
            value={location}
            onChange={setLocation}
            disabled={isSubmitting}
            lang={lang}
            label={lang === 'en' ? 'Location' : 'स्थान'}
          />

          {/* Description */}
          <DescriptionPicker
            value={description}
            onChange={setDescription}
            options={lang === 'en' ? GAS_LEAK_REASONS : GAS_LEAK_REASONS_HI}
            placeholder={lang === 'en' ? '-- Select Issue Type --' : '-- समस्या का प्रकार चुनें --'}
            label={lang === 'en' ? 'Details (Optional)' : 'विवरण (वैकल्पिक)'}
            disabled={isSubmitting}
          />

          <button 
            onClick={handleCriticalSubmit}
            disabled={isSubmitting}
            className={`w-full py-5 rounded-2xl font-black text-xl shadow-2xl flex items-center justify-center gap-3 transition-all disabled:opacity-70 ${
              isSubmitting ? 'bg-slate-200 text-slate-400' : 'bg-[#1e3a8a] text-white hover:bg-[#1e3a8a]/90 hover:-translate-y-1'
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
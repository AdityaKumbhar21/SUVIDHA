import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, Send, Loader2, CheckCircle, Trash2 } from 'lucide-react';
import { wasteAPI } from '../../../services/api';
import { useLanguage } from '../../../context/LanguageContext';
import LocationPicker from '../../../components/forms/LocationPicker';
import DescriptionPicker from '../../../components/forms/DescriptionPicker';

const OVERFLOW_REASONS = [
  { value: 'Large garbage bin near park overflowing for 2+ days', label: 'Bin overflowing for 2+ days' },
  { value: 'Community dustbin is full and garbage spilling on road', label: 'Dustbin full, garbage on road' },
  { value: 'Garbage bin not emptied, causing foul smell in area', label: 'Not emptied, causing foul smell' },
  { value: 'Bin is damaged/broken and waste is scattering around', label: 'Bin damaged, waste scattering' },
  { value: 'Street animals tearing garbage bags from overflowing bin', label: 'Animals tearing garbage bags' },
  { value: 'Construction waste dumped near community bin', label: 'Construction waste near bin' },
  { value: 'Bin too small for the area, always overflowing', label: 'Bin too small for area' },
];

const OVERFLOW_REASONS_HI = [
  { value: 'पार्क के पास बड़ा कचरा पात्र 2+ दिनों से ओवरफ्लो', label: '2+ दिनों से ओवरफ्लो' },
  { value: 'सामुदायिक कचरा पात्र भरा है और सड़क पर फैल रहा है', label: 'कचरा पात्र भरा, सड़क पर कचरा' },
  { value: 'कचरा पात्र खाली नहीं किया गया, बदबू आ रही है', label: 'खाली नहीं, बदबू आ रही' },
  { value: 'कचरा पात्र क्षतिग्रस्त/टूटा है और कचरा फैल रहा है', label: 'पात्र टूटा, कचरा फैल रहा' },
  { value: 'आवारा जानवर ओवरफ्लो बिन से कचरे के थैले फाड़ रहे हैं', label: 'जानवर थैले फाड़ रहे' },
  { value: 'सामुदायिक कचरा पात्र के पास निर्माण कचरा डंप किया गया', label: 'निर्माण कचरा डंप' },
  { value: 'क्षेत्र के लिए कचरा पात्र बहुत छोटा है, हमेशा ओवरफ्लो', label: 'पात्र छोटा, हमेशा ओवरफ्लो' },
];

const OverflowingBin = () => {
  const navigate = useNavigate();
  const { lang } = useLanguage();
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async () => {
    if (!description) return;
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('description', description);
      if (location) formData.append('location', location);
      const response = await wasteAPI.reportOverflow(formData);
      setSuccess(response.data.complaintId);
      setTimeout(() => navigate('/dashboard'), 3000);
    } catch (err) {
      alert(err.response?.data?.message || (lang === 'en' ? 'Failed to submit complaint.' : 'शिकायत दर्ज करने में विफल।'));
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
          <h2 className="text-2xl font-black text-slate-800 mb-2">{lang === 'en' ? 'Complaint Registered!' : 'शिकायत दर्ज!'}</h2>
          <p className="text-slate-500 text-sm">{lang === 'en' ? 'Overflowing bin reported. Priority team dispatched.' : 'ओवरफ्लो बिन की रिपोर्ट दर्ज। प्राथमिकता टीम भेजी गई।'}</p>
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
            {lang === 'en' ? 'Overflowing Bin' : 'ओवरफ्लो कचरा पात्र'}
          </h1>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{lang === 'en' ? 'Report overflowing garbage bin' : 'ओवरफ्लो कचरा पात्र की शिकायत'}</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden flex-1 flex flex-col">
        <div className="p-6 flex-1 flex flex-col gap-6">
          <LocationPicker
            value={location}
            onChange={setLocation}
            disabled={submitting}
            lang={lang}
            label={lang === 'en' ? 'Bin Location' : 'कचरा पात्र स्थान'}
          />
          <DescriptionPicker
            value={description}
            onChange={setDescription}
            options={lang === 'en' ? OVERFLOW_REASONS : OVERFLOW_REASONS_HI}
            placeholder={lang === 'en' ? 'Select issue...' : 'समस्या चुनें...'}
            label={lang === 'en' ? 'Overflow Details' : 'ओवरफ्लो विवरण'}
            disabled={submitting}
            icon={Trash2}
          />
        </div>
        <div className="p-6 border-t border-slate-100 bg-slate-50">
          <button onClick={handleSubmit} disabled={!description || submitting}
            className="w-full py-4 rounded-xl bg-[#1e3a8a] text-white font-bold text-lg shadow-lg active:scale-95 disabled:opacity-50 transition-all flex items-center justify-center gap-2">
            {submitting ? (<><Loader2 className="animate-spin" size={20} /> {lang === 'en' ? 'Submitting...' : 'सबमिट हो रहा है...'}</>) : (<><Send size={20} /> {lang === 'en' ? 'Submit Complaint' : 'शिकायत दर्ज करें'}</>)}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OverflowingBin;

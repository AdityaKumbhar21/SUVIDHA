import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, Send, Loader2, CheckCircle, Trash2 } from 'lucide-react';
import { wasteAPI } from '../../../services/api';
import { useLanguage } from '../../../context/LanguageContext';
import LocationPicker from '../../../components/forms/LocationPicker';
import DescriptionPicker from '../../../components/forms/DescriptionPicker';

const MISSED_PICKUP_REASONS = [
  { value: 'Garbage van did not come today', label: 'Garbage van did not come today' },
  { value: 'Garbage van skipped our street / lane', label: 'Van skipped our street/lane' },
  { value: 'Waste collector did not pick up segregated waste', label: 'Segregated waste not picked up' },
  { value: 'No pickup for the last 2-3 days', label: 'No pickup for 2-3 days' },
  { value: 'Only dry waste collected, wet waste left behind', label: 'Only dry waste collected' },
  { value: 'Garbage van came but did not stop at our area', label: 'Van came but did not stop' },
  { value: 'Holiday schedule not followed, no pickup today', label: 'Holiday schedule not followed' },
];

const MISSED_PICKUP_REASONS_HI = [
  { value: 'कचरा वाहन आज नहीं आया', label: 'कचरा वाहन आज नहीं आया' },
  { value: 'कचरा वाहन ने हमारी गली छोड़ दी', label: 'हमारी गली छोड़ दी' },
  { value: 'अलग किया गया कचरा नहीं उठाया गया', label: 'अलग कचरा नहीं उठाया' },
  { value: 'पिछले 2-3 दिनों से कोई पिकअप नहीं', label: '2-3 दिनों से पिकअप नहीं' },
  { value: 'सिर्फ सूखा कचरा उठाया, गीला छोड़ दिया', label: 'सिर्फ सूखा कचरा उठाया' },
  { value: 'वाहन आया लेकिन हमारे क्षेत्र में नहीं रुका', label: 'वाहन आया पर रुका नहीं' },
  { value: 'छुट्टी का शेड्यूल फॉलो नहीं किया गया', label: 'छुट्टी शेड्यूल फॉलो नहीं' },
];

const MissedPickup = () => {
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

      const response = await wasteAPI.reportMissedPickup(formData);
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
          <p className="text-slate-500 text-sm">{lang === 'en' ? 'Missed pickup reported. Team notified.' : 'मिस्ड पिकअप रिपोर्ट दर्ज। टीम को सूचित किया गया।'}</p>
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
            {lang === 'en' ? 'Missed Pickup' : 'मिस्ड पिकअप'}
          </h1>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{lang === 'en' ? 'Report missed garbage collection' : 'छूटी हुई कचरा संग्रहण की शिकायत'}</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden flex-1 flex flex-col">
        <div className="p-6 flex-1 flex flex-col gap-6">
          <LocationPicker
            value={location}
            onChange={setLocation}
            disabled={submitting}
            lang={lang}
            label={lang === 'en' ? 'Location / Address' : 'स्थान / पता'}
          />
          <DescriptionPicker
            value={description}
            onChange={setDescription}
            options={lang === 'en' ? MISSED_PICKUP_REASONS : MISSED_PICKUP_REASONS_HI}
            placeholder={lang === 'en' ? 'Select reason...' : 'कारण चुनें...'}
            label={lang === 'en' ? 'Reason for Complaint' : 'शिकायत का कारण'}
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

export default MissedPickup;

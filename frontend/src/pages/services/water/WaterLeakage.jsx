import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, Send, Loader2, CheckCircle, Droplets } from 'lucide-react';
import { waterAPI } from '../../../services/api';
import { useLanguage } from '../../../context/LanguageContext';
import LocationPicker from '../../../components/forms/LocationPicker';
import DescriptionPicker from '../../../components/forms/DescriptionPicker';

const LEAKAGE_REASONS = [
  { value: 'Pipe burst on main road causing water flow on street', label: 'Pipe burst on main road' },
  { value: 'Underground pipe leaking near my house', label: 'Underground pipe leaking' },
  { value: 'Water overflowing from manhole cover', label: 'Water overflowing from manhole' },
  { value: 'Leaking water valve or junction point', label: 'Leaking valve or junction' },
  { value: 'Street flooding due to broken pipeline', label: 'Street flooding - broken pipeline' },
  { value: 'Water meter connection leaking continuously', label: 'Water meter connection leaking' },
  { value: 'Sewage water mixing with drinking water supply', label: 'Sewage mixing with drinking water' },
  { value: 'Continuous water dripping from overhead tank pipe', label: 'Dripping from overhead tank pipe' },
];

const LEAKAGE_REASONS_HI = [
  { value: 'मुख्य सड़क पर पाइप फटा, सड़क पर पानी बह रहा है', label: 'मुख्य सड़क पर पाइप फटा' },
  { value: 'मेरे घर के पास भूमिगत पाइप से रिसाव', label: 'भूमिगत पाइप से रिसाव' },
  { value: 'मैनहोल कवर से पानी बह रहा है', label: 'मैनहोल से पानी बहना' },
  { value: 'पानी का वाल्व या जंक्शन प्वाइंट से रिसाव', label: 'वाल्व या जंक्शन से रिसाव' },
  { value: 'टूटी पाइपलाइन के कारण सड़क पर बाढ़', label: 'टूटी पाइपलाइन - सड़क पर बाढ़' },
  { value: 'पानी मीटर कनेक्शन से लगातार रिसाव', label: 'पानी मीटर कनेक्शन से रिसाव' },
  { value: 'सीवेज पानी पीने के पानी में मिल रहा है', label: 'सीवेज पीने के पानी में मिलना' },
  { value: 'ओवरहेड टैंक पाइप से लगातार पानी टपकना', label: 'ओवरहेड टैंक से पानी टपकना' },
];

const WaterLeakage = () => {
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
      const response = await waterAPI.reportLowPressure({
        description,
        location: location || undefined,
      });
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
          <p className="text-slate-500 text-sm">{lang === 'en' ? 'Our team will investigate the leakage.' : 'हमारी टीम रिसाव की जांच करेगी।'}</p>
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
            {lang === 'en' ? 'Report Leakage' : 'रिसाव की शिकायत'}
          </h1>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{lang === 'en' ? 'Pipe bursts or street leakage' : 'पाइप फटना या सड़क पर रिसाव'}</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden flex-1 flex flex-col">
        <div className="p-6 flex-1 flex flex-col gap-6">

          <LocationPicker
            value={location}
            onChange={setLocation}
            disabled={submitting}
            lang={lang}
            label={lang === 'en' ? 'Leakage Location' : 'रिसाव स्थान'}
          />

          <DescriptionPicker
            value={description}
            onChange={setDescription}
            options={lang === 'en' ? LEAKAGE_REASONS : LEAKAGE_REASONS_HI}
            placeholder={lang === 'en' ? 'Select leakage type...' : 'रिसाव का प्रकार चुनें...'}
            label={lang === 'en' ? 'Type of Leakage' : 'रिसाव का प्रकार'}
            disabled={submitting}
            icon={Droplets}
          />

        </div>

        <div className="p-6 border-t border-slate-100 bg-slate-50">
          <button
            onClick={handleSubmit}
            disabled={!description || submitting}
            className="w-full py-4 rounded-xl bg-[#1e3a8a] text-white font-bold text-lg shadow-lg active:scale-95 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
          >
            {submitting ? (
              <><Loader2 className="animate-spin" size={20} /> {lang === 'en' ? 'Submitting...' : 'सबमिट हो रहा है...'}</>
            ) : (
              <><Send size={20} /> {lang === 'en' ? 'Submit Complaint' : 'शिकायत दर्ज करें'}</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default WaterLeakage;

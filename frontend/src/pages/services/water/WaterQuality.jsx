import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, Send, Loader2, CheckCircle, Droplets } from 'lucide-react';
import { waterAPI } from '../../../services/api';
import { useLanguage } from '../../../context/LanguageContext';
import LocationPicker from '../../../components/forms/LocationPicker';
import DescriptionPicker from '../../../components/forms/DescriptionPicker';

const WATER_QUALITY_ISSUES = [
  { value: 'Water is yellow or brown in color', label: 'Yellow/brown colored water' },
  { value: 'Water has bad smell or foul odor', label: 'Bad smell or foul odor' },
  { value: 'Water contains sand, mud or particles', label: 'Contains sand/mud/particles' },
  { value: 'Water appears milky or cloudy', label: 'Milky or cloudy water' },
  { value: 'Water has oily layer on top', label: 'Oily layer on water surface' },
  { value: 'Water tastes metallic or chemical', label: 'Metallic or chemical taste' },
  { value: 'Insects or worms found in water', label: 'Insects or worms in water' },
  { value: 'Water has excessive chlorine smell', label: 'Excessive chlorine smell' },
];

const WATER_QUALITY_ISSUES_HI = [
  { value: 'पानी पीले या भूरे रंग का है', label: 'पीला/भूरा पानी' },
  { value: 'पानी में बदबू या दुर्गंध आ रही है', label: 'बदबू या दुर्गंध' },
  { value: 'पानी में रेत, मिट्टी या कण हैं', label: 'रेत/मिट्टी/कण हैं' },
  { value: 'पानी दूधिया या धुंधला दिख रहा है', label: 'दूधिया या धुंधला पानी' },
  { value: 'पानी की सतह पर तेल की परत है', label: 'पानी पर तेल की परत' },
  { value: 'पानी का स्वाद धातु या रासायनिक है', label: 'धातु या रासायनिक स्वाद' },
  { value: 'पानी में कीड़े या कीट पाए गए', label: 'पानी में कीड़े/कीट' },
  { value: 'पानी में अत्यधिक क्लोरीन की गंध', label: 'अत्यधिक क्लोरीन गंध' },
];

const WaterQuality = () => {
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
      const response = await waterAPI.reportMeterIssue({
        description: `Water quality issue: ${description}`,
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
          <p className="text-slate-500 text-sm">{lang === 'en' ? 'Water quality team has been notified.' : 'जल गुणवत्ता टीम को सूचित किया गया है।'}</p>
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
            {lang === 'en' ? 'Water Quality Issue' : 'पानी की गुणवत्ता समस्या'}
          </h1>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{lang === 'en' ? 'Report dirty or contaminated water' : 'गंदे या दूषित पानी की शिकायत करें'}</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden flex-1 flex flex-col">
        <div className="p-6 flex-1 flex flex-col gap-6">

          <LocationPicker
            value={location}
            onChange={setLocation}
            disabled={submitting}
            lang={lang}
            label={lang === 'en' ? 'Your Location / Area' : 'आपका स्थान / क्षेत्र'}
          />

          <DescriptionPicker
            value={description}
            onChange={setDescription}
            options={lang === 'en' ? WATER_QUALITY_ISSUES : WATER_QUALITY_ISSUES_HI}
            placeholder={lang === 'en' ? 'Select water quality issue...' : 'पानी की गुणवत्ता समस्या चुनें...'}
            label={lang === 'en' ? 'Water Quality Problem' : 'पानी गुणवत्ता समस्या'}
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
              <><Send size={20} /> {lang === 'en' ? 'Submit Report' : 'रिपोर्ट सबमिट करें'}</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default WaterQuality;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, Send, Loader2, CheckCircle, Gauge } from 'lucide-react';
import { electricityAPI } from '../../../services/api';
import { useLanguage } from '../../../context/LanguageContext';
import DescriptionPicker from '../../../components/forms/DescriptionPicker';

const METER_ISSUES = [
  { value: 'Meter display is blank or not working', label: 'Meter display is blank / not working' },
  { value: 'Meter is running too fast', label: 'Meter is running too fast' },
  { value: 'Meter is sparking or making noise', label: 'Meter is sparking / making noise' },
  { value: 'Meter reading does not match consumption', label: 'Reading does not match consumption' },
  { value: 'Meter glass is broken or damaged', label: 'Meter glass is broken / damaged' },
  { value: 'Meter seal is broken or tampered', label: 'Meter seal is broken / tampered' },
  { value: 'Meter stopped recording units', label: 'Meter stopped recording units' },
  { value: 'Other meter issue', label: 'Other meter issue' },
];

const METER_ISSUES_HI = [
  { value: 'Meter display is blank or not working', label: 'मीटर डिस्प्ले खाली / काम नहीं कर रहा' },
  { value: 'Meter is running too fast', label: 'मीटर बहुत तेज़ चल रहा है' },
  { value: 'Meter is sparking or making noise', label: 'मीटर में चिंगारी / आवाज़ आ रही है' },
  { value: 'Meter reading does not match consumption', label: 'रीडिंग उपभोग से मेल नहीं खाती' },
  { value: 'Meter glass is broken or damaged', label: 'मीटर का काँच टूटा / क्षतिग्रस्त' },
  { value: 'Meter seal is broken or tampered', label: 'मीटर की सील टूटी / छेड़छाड़' },
  { value: 'Meter stopped recording units', label: 'मीटर ने यूनिट रिकॉर्ड करना बंद कर दिया' },
  { value: 'Other meter issue', label: 'अन्य मीटर समस्या' },
];

const MeterIssue = () => {
  const navigate = useNavigate();
  const { lang } = useLanguage();
  const [description, setDescription] = useState('');
  const [consumerNumber, setConsumerNumber] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async () => {
    if (!description || description.length < 10) return;

    setSubmitting(true);
    try {
      const response = await electricityAPI.reportMeterIssue({
        description,
        consumerNumber: consumerNumber || undefined,
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
          <p className="text-slate-500 text-sm">{lang === 'en' ? 'Our team will inspect your meter.' : 'हमारी टीम आपके मीटर का निरीक्षण करेगी।'}</p>
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
            {lang === 'en' ? 'Report Meter Issue' : 'मीटर समस्या की शिकायत'}
          </h1>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{lang === 'en' ? 'Report faulty, fast, or damaged meters' : 'खराब, तेज़ या क्षतिग्रस्त मीटर की रिपोर्ट करें'}</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden flex-1 flex flex-col">
        <div className="p-6 flex-1 flex flex-col gap-6">

          <div>
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">
              <Gauge size={14} className="inline mr-1" />
              {lang === 'en' ? 'Consumer Number (Optional)' : 'उपभोक्ता नंबर (वैकल्पिक)'}
            </label>
            <input
              type="text"
              value={consumerNumber}
              onChange={(e) => setConsumerNumber(e.target.value)}
              disabled={submitting}
              placeholder={lang === 'en' ? 'Enter your consumer number' : 'अपना उपभोक्ता नंबर दर्ज करें'}
              className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl p-4 text-lg font-medium focus:border-[#1e3a8a] focus:outline-none disabled:opacity-50"
            />
          </div>

          <DescriptionPicker
            value={description}
            onChange={setDescription}
            options={lang === 'en' ? METER_ISSUES : METER_ISSUES_HI}
            placeholder={lang === 'en' ? '-- Select Issue Type --' : '-- समस्या का प्रकार चुनें --'}
            label={lang === 'en' ? 'Describe the Issue' : 'समस्या का वर्णन करें'}
            disabled={submitting}
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

export default MeterIssue;

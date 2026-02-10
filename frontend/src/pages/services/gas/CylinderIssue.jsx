import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, Send, Loader2, CheckCircle } from 'lucide-react';
import { gasAPI } from '../../../services/api';
import { useLanguage } from '../../../context/LanguageContext';
import DescriptionPicker from '../../../components/forms/DescriptionPicker';

const CYLINDER_ISSUES = [
  { value: 'Cylinder is making hissing sound from valve', label: 'Hissing sound from valve' },
  { value: 'Regulator is defective or leaking', label: 'Regulator defective / leaking' },
  { value: 'Wrong weight delivered - cylinder feels light', label: 'Wrong weight - cylinder feels light' },
  { value: 'Cylinder body is rusted or damaged', label: 'Cylinder body rusted / damaged' },
  { value: 'Gas flame is yellow or weak', label: 'Gas flame is yellow / weak' },
  { value: 'Cylinder valve is stuck or hard to open', label: 'Valve is stuck / hard to open' },
  { value: 'Delivered cylinder is dented or deformed', label: 'Cylinder is dented / deformed' },
  { value: 'Other cylinder issue', label: 'Other cylinder issue' },
];

const CYLINDER_ISSUES_HI = [
  { value: 'Cylinder is making hissing sound from valve', label: 'वाल्व से सीटी की आवाज़' },
  { value: 'Regulator is defective or leaking', label: 'रेगुलेटर खराब / लीक हो रहा है' },
  { value: 'Wrong weight delivered - cylinder feels light', label: 'गलत वजन - सिलेंडर हल्का लगता है' },
  { value: 'Cylinder body is rusted or damaged', label: 'सिलेंडर में जंग / क्षति' },
  { value: 'Gas flame is yellow or weak', label: 'गैस की लौ पीली / कमज़ोर' },
  { value: 'Cylinder valve is stuck or hard to open', label: 'वाल्व अटका / खोलने में मुश्किल' },
  { value: 'Delivered cylinder is dented or deformed', label: 'सिलेंडर पिचका / विकृत' },
  { value: 'Other cylinder issue', label: 'अन्य सिलेंडर समस्या' },
];

const CylinderIssue = () => {
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
      const response = await gasAPI.reportCylinderIssue({
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
          <p className="text-slate-500 text-sm">{lang === 'en' ? 'Cylinder issue has been reported.' : 'सिलेंडर समस्या की रिपोर्ट दर्ज हो गई है।'}</p>
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
            {lang === 'en' ? 'Cylinder Issue' : 'सिलेंडर समस्या'}
          </h1>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{lang === 'en' ? 'Report defective or damaged cylinder' : 'दोषपूर्ण या क्षतिग्रस्त सिलेंडर की रिपोर्ट करें'}</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden flex-1 flex flex-col">
        <div className="p-6 flex-1 flex flex-col gap-6">

          <div>
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">
              {lang === 'en' ? 'Consumer Number (Optional)' : 'उपभोक्ता नंबर (वैकल्पिक)'}
            </label>
            <input
              type="text"
              value={consumerNumber}
              onChange={(e) => setConsumerNumber(e.target.value)}
              disabled={submitting}
              placeholder={lang === 'en' ? 'Enter your gas consumer number' : 'अपना गैस उपभोक्ता नंबर दर्ज करें'}
              className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl p-4 text-lg font-medium focus:border-[#1e3a8a] focus:outline-none disabled:opacity-50"
            />
          </div>

          <DescriptionPicker
            value={description}
            onChange={setDescription}
            options={lang === 'en' ? CYLINDER_ISSUES : CYLINDER_ISSUES_HI}
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

export default CylinderIssue;

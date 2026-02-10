import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, Send, CheckCircle, Loader2 } from 'lucide-react';
import { waterAPI } from '../../../services/api';
import { useLanguage } from '../../../context/LanguageContext';
import LocationPicker from '../../../components/forms/LocationPicker';
import DescriptionPicker from '../../../components/forms/DescriptionPicker';

const WATER_SUPPLY_ISSUES = [
  { value: 'No water supply since morning in the entire area', label: 'No water supply since morning' },
  { value: 'Very low water pressure, barely trickling', label: 'Very low water pressure' },
  { value: 'Water comes only for a few minutes then stops', label: 'Water comes briefly then stops' },
  { value: 'No water supply for more than 24 hours', label: 'No supply for 24+ hours' },
  { value: 'Water supply timing has changed without notice', label: 'Supply timing changed without notice' },
  { value: 'Tanker water not received on scheduled day', label: 'Tanker water not received' },
  { value: 'Other water supply issue', label: 'Other water supply issue' },
];

const WATER_SUPPLY_ISSUES_HI = [
  { value: 'No water supply since morning in the entire area', label: 'सुबह से पूरे क्षेत्र में पानी नहीं' },
  { value: 'Very low water pressure, barely trickling', label: 'बहुत कम पानी का दबाव' },
  { value: 'Water comes only for a few minutes then stops', label: 'पानी कुछ मिनट आता है फिर बंद' },
  { value: 'No water supply for more than 24 hours', label: '24 घंटे+ से पानी नहीं' },
  { value: 'Water supply timing has changed without notice', label: 'बिना सूचना समय बदल गया' },
  { value: 'Tanker water not received on scheduled day', label: 'टैंकर का पानी नहीं मिला' },
  { value: 'Other water supply issue', label: 'अन्य पानी आपूर्ति समस्या' },
];

const WaterComplaint = () => {
  const navigate = useNavigate();
  const { lang } = useLanguage();
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async () => {
    if (!description || description.length < 10) return;
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('description', description);
      if (location) formData.append('location', location);
      const response = await waterAPI.reportNoSupply(formData);
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
          <p className="text-slate-500 text-sm">{lang === 'en' ? 'Team will be dispatched to your area.' : 'आपके क्षेत्र में टीम भेजी जाएगी।'}</p>
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
            {lang === 'en' ? 'No Water Supply' : 'पानी की आपूर्ति नहीं'}
          </h1>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{lang === 'en' ? 'Report water supply issues in your area' : 'अपने क्षेत्र में पानी की समस्या की रिपोर्ट करें'}</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden flex-1 flex flex-col">
        <div className="p-6 flex-1 flex flex-col gap-6">
          <LocationPicker
            value={location}
            onChange={setLocation}
            disabled={submitting}
            lang={lang}
            label={lang === 'en' ? 'Location' : 'स्थान'}
          />
          <DescriptionPicker
            value={description}
            onChange={setDescription}
            options={lang === 'en' ? WATER_SUPPLY_ISSUES : WATER_SUPPLY_ISSUES_HI}
            placeholder={lang === 'en' ? '-- Select Issue Type --' : '-- समस्या का प्रकार चुनें --'}
            label={lang === 'en' ? 'Describe the Issue' : 'समस्या का वर्णन करें'}
            disabled={submitting}
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

export default WaterComplaint;
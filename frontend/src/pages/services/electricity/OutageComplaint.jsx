import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, MapPin, Send, Loader2 } from 'lucide-react';
import { electricityAPI } from '../../../services/api';
import { useLanguage } from '../../../context/LanguageContext';

const OutageComplaint = () => {
  const navigate = useNavigate();
  const { lang } = useLanguage();
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!description) return;
    setSubmitting(true);
    
    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('description', description);
      formData.append('location', location);

      // Call the API
      const response = await electricityAPI.reportOutage(formData);
      
      const complaintId = response.data.complaintId || 'PWR-SUBMITTED';
      alert(lang === 'en' ? `Complaint Registered! Ticket #${complaintId}` : `शिकायत दर्ज! टिकट #${complaintId}`);
      navigate('/dashboard');
    } catch (err) {
      console.error('Error submitting complaint:', err);
      alert(err.response?.data?.message || (lang === 'en' ? 'Failed to submit complaint. Please try again.' : 'शिकायत दर्ज करने में विफल। कृपया पुनः प्रयास करें।'));
      setSubmitting(false);
    }
  };

  return (
    <div className="h-full flex flex-col max-w-2xl mx-auto">
      
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button 
          onClick={() => navigate(-1)}
          className="p-3 bg-white rounded-xl border-2 border-slate-200 text-slate-400 hover:border-[#1e3a8a] hover:text-[#1e3a8a] transition-all active:scale-95"
        >
          <ChevronLeft size={24} />
        </button>
        <div>
           <h1 className="text-2xl font-black text-slate-800 uppercase tracking-tight">
             {lang === 'en' ? 'Report Outage' : 'बिजली कटौती की शिकायत'}
           </h1>
           <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{lang === 'en' ? 'AI-Assisted Complaint System' : 'AI-सहायता प्राप्त शिकायत प्रणाली'}</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden flex-1 flex flex-col">
        
        {/* 1. Location Input */}
        <div className="bg-slate-50 p-4 border-b border-slate-100">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">
            <MapPin size={14} className="inline mr-1" />
            {lang === 'en' ? 'Affected Location' : 'प्रभावित स्थान'}
          </label>
          <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} disabled={submitting}
            placeholder={lang === 'en' ? 'Enter area, ward, street' : 'क्षेत्र, वार्ड, सड़क दर्ज करें'}
            className="w-full bg-white border-2 border-slate-200 rounded-xl p-3 text-base font-medium focus:border-[#1e3a8a] focus:outline-none disabled:opacity-50" />
        </div>

        {/* 2. Complaint Input Area */}
        <div className="p-6 flex-1 flex flex-col gap-6">

          {/* Text Area */}
          <div className="relative">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">
              {lang === 'en' ? 'Describe the Issue' : 'समस्या का वर्णन करें'}
            </label>
            <textarea 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={submitting}
              placeholder={lang === 'en' ? "Or type your complaint here..." : "या यहां अपनी शिकायत टाइप करें..."}
              className="w-full h-32 bg-slate-50 border-2 border-slate-200 rounded-xl p-4 text-lg font-medium focus:border-[#1e3a8a] focus:outline-none resize-none disabled:opacity-50"
            ></textarea>
          </div>

        </div>

        {/* 3. Submit Button */}
        <div className="p-6 border-t border-slate-100 bg-slate-50">
          <button 
            onClick={handleSubmit}
            disabled={!description || submitting}
            className="w-full py-4 rounded-xl bg-[#1e3a8a] text-white font-bold text-lg shadow-lg active:scale-95 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
          >
            {submitting ? (
              <> <Loader2 className="animate-spin" /> {lang === 'en' ? 'Submitting...' : 'सबमिट हो रहा है...'} </>
            ) : (
              <> <Send size={20} /> {lang === 'en' ? 'Submit Complaint' : 'शिकायत दर्ज करें'} </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};

export default OutageComplaint;
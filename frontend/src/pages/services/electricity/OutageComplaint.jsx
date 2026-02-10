import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Send, Loader2 } from 'lucide-react';
import { electricityAPI } from '../../../services/api';
import { useLanguage } from '../../../context/LanguageContext';
import LocationPicker from '../../../components/forms/LocationPicker';
import DescriptionPicker from '../../../components/forms/DescriptionPicker';

const OUTAGE_REASONS = [
  { value: 'Complete power outage in the area since several hours', label: 'Complete power outage in the area' },
  { value: 'Frequent power cuts and voltage fluctuations', label: 'Frequent power cuts / voltage fluctuations' },
  { value: 'Transformer failure or sparking', label: 'Transformer failure / sparking' },
  { value: 'Fallen electric pole or wire on road', label: 'Fallen electric pole / wire on road' },
  { value: 'Partial outage - some houses have power, some do not', label: 'Partial outage - some houses affected' },
  { value: 'Scheduled maintenance not restored on time', label: 'Scheduled maintenance not restored' },
  { value: 'Street lights not working in the area', label: 'Street lights not working' },
  { value: 'Other power supply issue', label: 'Other power supply issue' },
];

const OUTAGE_REASONS_HI = [
  { value: 'Complete power outage in the area since several hours', label: 'क्षेत्र में पूर्ण बिजली कटौती' },
  { value: 'Frequent power cuts and voltage fluctuations', label: 'बार-बार बिजली कटौती / वोल्टेज उतार-चढ़ाव' },
  { value: 'Transformer failure or sparking', label: 'ट्रांसफॉर्मर खराबी / चिंगारी' },
  { value: 'Fallen electric pole or wire on road', label: 'बिजली का खंभा / तार सड़क पर गिरा' },
  { value: 'Partial outage - some houses have power, some do not', label: 'आंशिक कटौती - कुछ घरों में बिजली नहीं' },
  { value: 'Scheduled maintenance not restored on time', label: 'निर्धारित रखरखाव के बाद बिजली बहाल नहीं' },
  { value: 'Street lights not working in the area', label: 'स्ट्रीट लाइट काम नहीं कर रहीं' },
  { value: 'Other power supply issue', label: 'अन्य बिजली आपूर्ति समस्या' },
];

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
          <LocationPicker
            value={location}
            onChange={setLocation}
            disabled={submitting}
            lang={lang}
            label={lang === 'en' ? 'Affected Location' : 'प्रभावित स्थान'}
          />
        </div>

        {/* 2. Complaint Input Area */}
        <div className="p-6 flex-1 flex flex-col gap-6">

          {/* Dropdown for issue type */}
          <DescriptionPicker
            value={description}
            onChange={setDescription}
            options={lang === 'en' ? OUTAGE_REASONS : OUTAGE_REASONS_HI}
            placeholder={lang === 'en' ? '-- Select Issue Type --' : '-- समस्या का प्रकार चुनें --'}
            label={lang === 'en' ? 'Describe the Issue' : 'समस्या का वर्णन करें'}
            disabled={submitting}
          />

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
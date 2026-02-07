import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, Mic, MapPin, Camera, Send, AlertTriangle, Loader2 } from 'lucide-react';
import { electricityAPI } from '../../../services/api';
import { useLanguage } from '../../../context/LanguageContext';

const OutageComplaint = () => {
  const navigate = useNavigate();
  const { lang } = useLanguage();
  const [location, setLocation] = useState('Detecting Location...');
  const [recording, setRecording] = useState(false);
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [photoFile, setPhotoFile] = useState(null);

  // Simulate GPS Location Detection
  useEffect(() => {
    setTimeout(() => {
      setLocation(lang === 'en' ? 'Kothrud, Pune (Ward 12)' : 'कोथरुड, पुणे (वार्ड 12)');
    }, 2000);
  }, []);

  const handleVoiceInput = () => {
    setRecording(!recording);
    if (!recording) {
      // Simulate listening
      setTimeout(() => {
        setRecording(false);
        setDescription("There is no power in my lane since 2 PM. The transformer sparked.");
      }, 3000);
    }
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
    }
  };

  const handleSubmit = async () => {
    if (!description) return;
    setSubmitting(true);
    
    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('description', description);
      formData.append('location', location);
      
      if (photoFile) {
        formData.append('photo', photoFile);
      }

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
    <div className="h-full flex flex-col relative z-10 max-w-2xl mx-auto">
      
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button 
          onClick={() => navigate(-1)}
          className="p-3 bg-white rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50"
        >
          <ChevronLeft size={24} />
        </button>
        <div>
           <h1 className="text-2xl font-black text-slate-800 flex items-center gap-2">
             <AlertTriangle className="text-red-500" /> {lang === 'en' ? 'Report Outage' : 'बिजली कटौती की शिकायत'}
           </h1>
           <p className="text-slate-500 text-sm">{lang === 'en' ? 'AI-Assisted Complaint System' : 'AI-सहायता प्राप्त शिकायत प्रणाली'}</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden flex-1 flex flex-col">
        
        {/* 1. Location Bar */}
        <div className="bg-slate-50 p-4 border-b border-slate-100 flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-blue-600 shadow-sm">
            {location === 'Detecting Location...' ? <Loader2 className="animate-spin" size={20}/> : <MapPin size={20} />}
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{lang === 'en' ? 'Affected Location' : 'प्रभावित स्थान'}</p>
            <p className="text-slate-800 font-bold">{location}</p>
          </div>
        </div>

        {/* 2. Complaint Input Area */}
        <div className="p-6 flex-1 flex flex-col gap-6">
          
          {/* Voice Recorder Button */}
          <div className="text-center">
            <button 
              onClick={handleVoiceInput}
              disabled={submitting}
              className={`w-20 h-20 rounded-full flex items-center justify-center shadow-xl transition-all disabled:opacity-50 ${recording ? 'bg-red-500 scale-110 animate-pulse' : 'bg-[#1A365D] hover:scale-105'}`}
            >
              <Mic size={32} className="text-white" />
            </button>
            <p className="mt-3 text-sm font-bold text-slate-500">
              {recording ? (lang === 'en' ? "Listening..." : "सुन रहे हैं...") : (lang === 'en' ? "Tap to Speak Issue" : "समस्या बोलने के लिए टैप करें")}
            </p>
          </div>

          {/* Text Area (Auto-filled by voice) */}
          <div className="relative">
            <textarea 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={submitting}
              placeholder={lang === 'en' ? "Or type your complaint here..." : "या यहां अपनी शिकायत टाइप करें..."}
              className="w-full h-32 bg-slate-50 border-2 border-slate-200 rounded-xl p-4 text-lg font-medium focus:border-blue-500 focus:outline-none resize-none disabled:opacity-50"
            ></textarea>
          </div>

          {/* Photo Upload */}
          <label className="flex items-center justify-center gap-2 w-full py-4 border-2 border-dashed border-slate-300 rounded-xl text-slate-500 font-bold hover:bg-slate-50 transition-colors cursor-pointer disabled:opacity-50">
            <Camera size={20} /> {photoFile ? (lang === 'en' ? 'Photo Selected' : 'फोटो चुनी गई') : (lang === 'en' ? 'Upload Photo of Issue (Optional)' : 'समस्या की फोटो अपलोड करें (वैकल्पिक)')}
            <input 
              type="file" 
              accept="image/*" 
              onChange={handlePhotoUpload}
              disabled={submitting}
              className="hidden"
            />
          </label>

        </div>

        {/* 3. Submit Button */}
        <div className="p-6 border-t border-slate-100 bg-slate-50">
          <button 
            onClick={handleSubmit}
            disabled={!description || submitting}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-red-600 to-orange-600 text-white font-bold text-lg shadow-lg active:scale-95 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
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
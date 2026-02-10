import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, MapPin, Save, Loader } from 'lucide-react';
import { profileAPI } from '../../services/api';
import { useLanguage } from '../../context/LanguageContext';

const ProfileCreation = () => {
  const navigate = useNavigate();
  const { lang } = useLanguage();
  const [formData, setFormData] = useState({
    fullName: '',
    address: '',
    city: 'Pune',
    ward: ''
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');

  // Fetch existing profile data on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await profileAPI.getProfile();
        if (response.data) {
          const { name, address, cityWard } = response.data;
          let city = 'Pune';
          let ward = '';
          if (cityWard && cityWard.includes(' - ')) {
            const parts = cityWard.split(' - ');
            city = parts[0] || 'Pune';
            ward = parts[1] || '';
          } else if (cityWard) {
            city = cityWard;
          }
          setFormData({
            fullName: name || '',
            address: address || '',
            city,
            ward,
          });
        }
      } catch (err) {
        // Profile not found or auth issue — user fills fresh
        console.log('No existing profile to pre-fill');
      } finally {
        setFetching(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Validate required fields
      if (!formData.fullName || !formData.address) {
        setError(lang === 'en' ? 'Please fill in all required fields' : 'कृपया सभी आवश्यक फील्ड भरें');
        setLoading(false);
        return;
      }

      // Call the API to update profile - map frontend fields to backend fields
      const response = await profileAPI.updateProfile({
        name: formData.fullName,
        address: formData.address,
        cityWard: formData.ward ? `${formData.city} - ${formData.ward}` : formData.city,
      });
      
      // Navigate to dashboard on success
      navigate('/dashboard');
    } catch (err) {
      console.error('Profile creation error:', err);
      setError(err.response?.data?.message || (lang === 'en' ? 'Failed to save profile. Please try again.' : 'प्रोफ़ाइल सहेजने में विफल। कृपया पुनः प्रयास करें।'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-[#f8fafc] py-12 px-6">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-lg bg-white rounded-3xl shadow-2xl p-10 border border-slate-100">
        <h1 className="text-3xl font-black text-[#1e3a8a] mb-2 uppercase tracking-tight">{lang === 'en' ? 'Complete Profile' : 'प्रोफ़ाइल पूरी करें'}</h1>
        <p className="text-slate-500 text-sm font-medium mb-8">{lang === 'en' ? 'Set up your identity for automated utility fetching.' : 'स्वचालित सेवा प्राप्ति के लिए अपनी पहचान सेट करें।'}</p>
        
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg"
          >
            <p className="text-sm text-red-600 font-bold">{error}</p>
          </motion.div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">{lang === 'en' ? 'Full Name *' : 'पूरा नाम *'}</label>
            <div className="flex items-center border-2 border-slate-100 rounded-xl px-4 py-3 bg-slate-50 focus-within:border-[#1e3a8a] transition-all">
              <User size={20} className="text-slate-400" />
              <input 
                required 
                type="text" 
                className="flex-1 bg-transparent outline-none ml-3 font-bold text-slate-700 disabled:opacity-50"
                placeholder="Ex: Aditya K."
                disabled={loading}
                value={formData.fullName}
                onChange={(e) => setFormData({...formData, fullName: e.target.value})}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">{lang === 'en' ? 'Residential Address *' : 'आवासीय पता *'}</label>
            <div className="flex items-start border-2 border-slate-100 rounded-xl px-4 py-3 bg-slate-50 focus-within:border-[#1e3a8a] transition-all">
              <MapPin size={20} className="text-slate-400 mt-1" />
              <textarea 
                required 
                className="flex-1 bg-transparent outline-none ml-3 font-bold text-slate-700 h-24 disabled:opacity-50"
                placeholder="House No, Society, Landmark"
                disabled={loading}
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
              ></textarea>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-[#1e3a8a] hover:bg-blue-900 disabled:bg-blue-800 text-white py-4 rounded-xl font-black text-lg shadow-lg flex items-center justify-center gap-2 hover:shadow-xl transition-all disabled:opacity-70"
          >
            {loading ? (
              <>
                <Loader size={20} className="animate-spin" />
                {lang === 'en' ? 'SAVING...' : 'सहेज हो रहा है...'}
              </>
            ) : (
              <>
                <Save size={20} /> {lang === 'en' ? 'SAVE & CONTINUE' : 'सहेजें और आगे बढ़ें'}
              </>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default ProfileCreation;
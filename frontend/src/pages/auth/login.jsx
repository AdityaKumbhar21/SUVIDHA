import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Smartphone, ArrowRight, ShieldCheck, KeyRound, Loader, UserCheck, MapPin, Phone, CheckCircle } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { authAPI } from '../../services/api';

const Login = () => {
  const navigate = useNavigate();
  const { lang } = useLanguage();
  
  // State for 3-Step Login
  const [step, setStep] = useState(1); // 1 = Mobile, 2 = OTP, 3 = Profile Confirmation
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [userData, setUserData] = useState(null);

  // Handle Mobile Input (10 digits max)
  const handleMobileChange = (e) => {
    const value = e.target.value;
    if (/^\d{0,10}$/.test(value)) setMobile(value);
    setError('');
  };

  // Handle OTP Input (6 digits max)
  const handleOtpChange = (e) => {
    const value = e.target.value;
    if (/^\d{0,6}$/.test(value)) setOtp(value);
    setError('');
  };

  // Main Logic
  const handleAuth = async () => {
    setError('');
    setLoading(true);

    try {
      if (step === 1) {
        // Step 1: Send OTP
        if (mobile.length === 10) {
          const response = await authAPI.sendOtp('+91' + mobile);
          if (response.data.success) {
            setStep(2); // Move to Step 2
          } else {
            setError(response.data.message || (lang === 'en' ? 'Failed to send OTP' : 'OTP भेजने में विफल'));
          }
        } else {
          setError(lang === 'en' ? "Please enter valid 10-digit number" : "कृपया वैध 10 अंकों का नंबर दर्ज करें");
        }
      } else {
        // Step 2: Verify OTP
        if (otp.length === 6) {
          const response = await authAPI.verifyOtp('+91' + mobile, otp);
          if (response.data.success) {
            // Save token to localStorage
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('userId', response.data.userId);
            localStorage.setItem('userPhone', '+91' + mobile);
            
            // Check if profile is complete
            if (response.data.isProfileComplete && response.data.user?.name) {
              // Existing user with complete profile → show confirmation
              setUserData(response.data.user);
              setStep(3);
            } else {
              // New user or incomplete profile → go to profile creation
              // Profile creation page will fetch and pre-fill any existing data
              navigate('/auth/create-profile');
            }
          } else {
            setError(response.data.message || (lang === 'en' ? 'Invalid OTP' : 'अमान्य OTP'));
          }
        } else {
          setError(lang === 'en' ? "Please enter valid 6-digit OTP" : "कृपया वैध 6 अंकों का OTP दर्ज करें");
        }
      }
    } catch (err) {
      console.error('Auth error:', err);
      setError(
        err.response?.data?.message ||
        (lang === 'en' ? 'Authentication failed. Please try again.' : 'प्रमाणीकरण विफल। कृपया पुनः प्रयास करें।')
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-[#f8fafc] py-16 px-8 relative overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-500 via-white to-green-500"></div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg bg-white rounded-3xl shadow-2xl p-10 border border-slate-100 relative z-10"
      >
        <div className="flex justify-center mb-8">
           <div className="bg-blue-50 p-5 rounded-full">
              {/* Change Icon based on Step */}
              {step === 1 ? <Smartphone size={40} className="text-[#1e3a8a]" /> 
               : step === 2 ? <KeyRound size={40} className="text-[#1e3a8a]" />
               : <UserCheck size={40} className="text-[#1e3a8a]" />}
           </div>
        </div>

        {/* Dynamic Headlines */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black text-[#1e3a8a] mb-3">
            {step === 1 
              ? (lang === 'en' ? 'Citizen Login' : 'नागरिक लॉगिन') 
              : step === 2 
              ? (lang === 'en' ? 'Verify OTP' : 'OTP सत्यापित करें')
              : (lang === 'en' ? 'Welcome Back!' : 'वापसी पर स्वागत!')}
          </h1>
          <p className="text-slate-500 font-medium text-base">
            {step === 1 
              ? (lang === 'en' ? 'Secure Access via Mobile OTP' : 'मोबाइल OTP द्वारा सुरक्षित प्रवेश')
              : step === 2
              ? (lang === 'en' ? `OTP Sent to +91 ${mobile}` : `+91 ${mobile} पर OTP भेजा गया`)
              : (lang === 'en' ? 'Confirm your identity to continue' : 'जारी रखने के लिए अपनी पहचान की पुष्टि करें')}
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg"
          >
            <p className="text-sm text-red-600 font-bold">{error}</p>
          </motion.div>
        )}

        <div className="space-y-6">
          
          {/* STEP 1: MOBILE INPUT */}
          {step === 1 && (
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
              <label className="block text-sm font-bold text-slate-500 uppercase tracking-widest mb-3">
                 {lang === 'en' ? 'Enter Mobile Number' : 'मोबाइल नंबर दर्ज करें'}
              </label>
              <div className="flex items-center border-2 border-blue-100 rounded-2xl px-5 py-4 focus-within:border-[#1e3a8a] focus-within:ring-4 focus-within:ring-blue-50 transition-all bg-slate-50">
                <span className="text-slate-400 font-bold text-lg border-r border-slate-300 pr-4 mr-4">+91</span>
                <input 
                  type="text" 
                  inputMode="numeric"
                  value={mobile}
                  onChange={handleMobileChange}
                  disabled={loading}
                  className="flex-1 bg-transparent outline-none font-bold text-xl text-slate-800 placeholder:text-slate-300 tracking-[0.3em] disabled:opacity-50"
                  placeholder="XXXXXXXXXX"
                  autoFocus
                />
              </div>
            </motion.div>
          )}

          {/* STEP 2: OTP INPUT */}
          {step === 2 && (
             <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
               <label className="block text-sm font-bold text-slate-500 uppercase tracking-widest mb-3">
                 {lang === 'en' ? 'Enter 6-Digit OTP' : '6 अंकों का OTP दर्ज करें'}
               </label>
               <div className="flex items-center border-2 border-blue-100 rounded-2xl px-5 py-4 focus-within:border-[#1e3a8a] focus-within:ring-4 focus-within:ring-blue-50 transition-all bg-slate-50">
                 <input 
                   type="text" 
                   inputMode="numeric"
                   value={otp}
                   onChange={handleOtpChange}
                   disabled={loading}
                   className="flex-1 bg-transparent outline-none font-black text-3xl text-center text-[#1e3a8a] tracking-[1.5em] disabled:opacity-50"
                   placeholder="••••••"
                   autoFocus
                 />
               </div>
               <div className="text-center mt-4">
                 <button 
                   onClick={() => setStep(1)} 
                   disabled={loading}
                   className="text-xs font-bold text-slate-400 hover:text-[#1e3a8a] underline disabled:opacity-50"
                 >
                    {lang === 'en' ? 'Change Mobile Number' : 'मोबाइल नंबर बदलें'}
                 </button>
               </div>
             </motion.div>
          )}

          {/* STEP 3: PROFILE CONFIRMATION */}
          {step === 3 && userData && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
              <div className="bg-gradient-to-br from-blue-50 to-slate-50 rounded-2xl p-6 border border-blue-100 space-y-4">
                <div className="flex items-center gap-3 pb-3 border-b border-blue-100">
                  <div className="bg-green-100 p-2 rounded-full">
                    <CheckCircle size={20} className="text-green-600" />
                  </div>
                  <p className="font-bold text-green-700 text-sm">
                    {lang === 'en' ? 'Profile Found' : 'प्रोफ़ाइल मिली'}
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <UserCheck size={18} className="text-slate-400" />
                    <div>
                      <p className="text-xs text-slate-400 font-bold uppercase">{lang === 'en' ? 'Name' : 'नाम'}</p>
                      <p className="text-lg font-black text-slate-800">{userData.name}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Phone size={18} className="text-slate-400" />
                    <div>
                      <p className="text-xs text-slate-400 font-bold uppercase">{lang === 'en' ? 'Mobile' : 'मोबाइल'}</p>
                      <p className="text-lg font-black text-slate-800">{userData.mobile}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <MapPin size={18} className="text-slate-400" />
                    <div>
                      <p className="text-xs text-slate-400 font-bold uppercase">{lang === 'en' ? 'Address' : 'पता'}</p>
                      <p className="text-sm font-bold text-slate-700">{userData.address}</p>
                      {userData.cityWard && <p className="text-xs text-slate-500 mt-1">{userData.cityWard}</p>}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* MAIN ACTION BUTTON */}
          <button 
            onClick={step === 3 ? () => navigate('/dashboard') : handleAuth}
            disabled={loading}
            className="w-full bg-[#1e3a8a] hover:bg-blue-900 disabled:bg-blue-800 text-white py-5 rounded-2xl font-bold text-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all flex items-center justify-center gap-3 disabled:opacity-70 mt-4"
          >
            {loading ? (
              <>
                <Loader size={20} className="animate-spin" />
                {lang === 'en' ? 'Processing...' : 'प्रक्रिया जारी...'}
              </>
            ) : (
              <>
                {step === 1 
                  ? (lang === 'en' ? 'SEND OTP' : 'OTP भेजें') 
                  : step === 2 
                  ? (lang === 'en' ? 'VERIFY & LOGIN' : 'सत्यापित करें और लॉगिन करें')
                  : (lang === 'en' ? 'CONTINUE TO DASHBOARD' : 'डैशबोर्ड पर जाएं')}
                <ArrowRight size={20} />
              </>
            )}
          </button>
        </div>

        {/* FOOTER TEXT */}
        <div className="mt-10 text-center">
           <p className="text-xs text-slate-400 font-bold uppercase tracking-widest flex items-center justify-center gap-2">
             <ShieldCheck size={16} />
             {lang === 'en' ? '100% Secure & Encrypted' : '100% सुरक्षित एवं एन्क्रिप्टेड'}
           </p>
        </div>

      </motion.div>
    </div>
  );
};

export default Login;
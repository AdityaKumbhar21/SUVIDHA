import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Smartphone, ArrowRight, ShieldCheck, KeyRound, Loader } from 'lucide-react'; // Added KeyRound icon
import { useLanguage } from '../../context/LanguageContext';
import { authAPI } from '../../services/api';

const Login = () => {
  const navigate = useNavigate();
  const { lang } = useLanguage();
  
  // State for 2-Step Login
  const [step, setStep] = useState(1); // 1 = Mobile, 2 = OTP
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Handle Mobile Input (10 digits max)
  const handleMobileChange = (e) => {
    const value = e.target.value;
    if (/^\d{0,10}$/.test(value)) setMobile(value);
    setError('');
  };

  // Handle OTP Input (4 digits max)
  const handleOtpChange = (e) => {
    const value = e.target.value;
    if (/^\d{0,4}$/.test(value)) setOtp(value);
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
            setError(response.data.message || (lang === 'EN' ? 'Failed to send OTP' : 'OTP पाठवणे अयशस्वी'));
          }
        } else {
          setError(lang === 'EN' ? "Please enter valid 10-digit number" : "कृपया वैध १० अंकी क्रमांक प्रविष्ट करा");
        }
      } else {
        // Step 2: Verify OTP
        if (otp.length === 4) {
          const response = await authAPI.verifyOtp('+91' + mobile, otp);
          if (response.data.success) {
            // Save token to localStorage
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('userId', response.data.userId);
            localStorage.setItem('userPhone', '+91' + mobile);
            
            // Navigate to profile creation or dashboard
            navigate('/auth/create-profile');
          } else {
            setError(response.data.message || (lang === 'EN' ? 'Invalid OTP' : 'अमान्य OTP'));
          }
        } else {
          setError(lang === 'EN' ? "Please enter valid 4-digit OTP" : "कृपया वैध ४ अंकी OTP प्रविष्ट करा");
        }
      }
    } catch (err) {
      console.error('Auth error:', err);
      setError(
        err.response?.data?.message ||
        (lang === 'EN' ? 'Authentication failed. Please try again.' : 'प्रमाणीकरण विफल. कृपया पुन्हा प्रयत्न करा.')
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-[#f8fafc] py-12 px-6 relative overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 via-white to-green-500"></div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 border border-slate-100 relative z-10"
      >
        <div className="flex justify-center mb-6">
           <div className="bg-blue-50 p-4 rounded-full">
              {/* Change Icon based on Step */}
              {step === 1 ? <Smartphone size={32} className="text-[#1e3a8a]" /> : <KeyRound size={32} className="text-[#1e3a8a]" />}
           </div>
        </div>

        {/* Dynamic Headlines */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-[#1e3a8a] mb-2">
            {step === 1 
              ? (lang === 'EN' ? 'Citizen Login' : 'नागरिक लॉगिन') 
              : (lang === 'EN' ? 'Verify OTP' : 'OTP सत्यापित करा')}
          </h1>
          <p className="text-slate-500 font-medium text-sm">
            {step === 1 
              ? (lang === 'EN' ? 'Secure Access via Mobile OTP' : 'मोबाईल OTP द्वारे सुरक्षित प्रवेश')
              : (lang === 'EN' ? `OTP Sent to +91 ${mobile}` : `+91 ${mobile} वर OTP पाठवला`)}
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
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                 {lang === 'EN' ? 'Enter Mobile Number' : 'मोबाईल क्रमांक प्रविष्ट करा'}
              </label>
              <div className="flex items-center border-2 border-blue-100 rounded-xl px-4 py-3 focus-within:border-[#1e3a8a] focus-within:ring-4 focus-within:ring-blue-50 transition-all bg-slate-50">
                <span className="text-slate-400 font-bold border-r border-slate-300 pr-3 mr-3">+91</span>
                <input 
                  type="text" 
                  inputMode="numeric"
                  value={mobile}
                  onChange={handleMobileChange}
                  disabled={loading}
                  className="flex-1 bg-transparent outline-none font-bold text-lg text-slate-800 placeholder:text-slate-300 tracking-widest disabled:opacity-50"
                  placeholder="XXXXXXXXXX"
                  autoFocus
                />
              </div>
            </motion.div>
          )}

          {/* STEP 2: OTP INPUT */}
          {step === 2 && (
             <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
               <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                 {lang === 'EN' ? 'Enter 4-Digit OTP' : '४-अंकी OTP प्रविष्ट करा'}
               </label>
               <div className="flex items-center border-2 border-blue-100 rounded-xl px-4 py-3 focus-within:border-[#1e3a8a] focus-within:ring-4 focus-within:ring-blue-50 transition-all bg-slate-50">
                 <input 
                   type="text" 
                   inputMode="numeric"
                   value={otp}
                   onChange={handleOtpChange}
                   disabled={loading}
                   className="flex-1 bg-transparent outline-none font-black text-2xl text-center text-[#1e3a8a] tracking-[1em] disabled:opacity-50"
                   placeholder="••••"
                   autoFocus
                 />
               </div>
               <div className="text-center mt-4">
                 <button 
                   onClick={() => setStep(1)} 
                   disabled={loading}
                   className="text-xs font-bold text-slate-400 hover:text-[#1e3a8a] underline disabled:opacity-50"
                 >
                    {lang === 'EN' ? 'Change Mobile Number' : 'मोबाईल नंबर बदला'}
                 </button>
               </div>
             </motion.div>
          )}

          {/* MAIN ACTION BUTTON */}
          <button 
            onClick={handleAuth}
            disabled={loading}
            className="w-full bg-[#1e3a8a] hover:bg-blue-900 disabled:bg-blue-800 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {loading ? (
              <>
                <Loader size={20} className="animate-spin" />
                {lang === 'EN' ? 'Processing...' : 'प्रक्रियाशील...'}
              </>
            ) : (
              <>
                {step === 1 
                  ? (lang === 'EN' ? 'SEND OTP' : 'OTP पाठवा') 
                  : (lang === 'EN' ? 'VERIFY & LOGIN' : 'सत्यापित करा')}
                <ArrowRight size={20} />
              </>
            )}
          </button>
        </div>

        {/* FOOTER TEXT */}
        <div className="mt-8 text-center">
           <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center justify-center gap-2">
             <ShieldCheck size={14} />
             {lang === 'EN' ? '100% Secure & Encrypted' : '१००% सुरक्षित आणि एनक्रिप्टेड'}
           </p>
        </div>

      </motion.div>
    </div>
  );
};

export default Login;
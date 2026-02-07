import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileText, Upload, CheckCircle, ShieldCheck, ArrowRight, ChevronLeft } from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext';

const CertificateRequest = () => {
  const navigate = useNavigate();
  const { lang } = useLanguage();
  const [step, setStep] = useState(1);
  const [certType, setCertType] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  // AI OCR Simulation logic [cite: 273, 274]
  const handleFileUpload = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setStep(3);
    }, 2500);
  };

  return (
    <div className="flex-1 flex flex-col items-center bg-slate-50 p-6 min-h-screen">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
        
        {/* Header */}
        <div className="bg-[#1e3a8a] p-6 text-white flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/service/municipal')} className="hover:bg-white/10 p-2 rounded-full transition-all">
              <ChevronLeft size={24} />
            </button>
            <div>
              <h1 className="text-xl font-black uppercase tracking-tight">
                {lang === 'EN' ? 'Certificate Request' : 'प्रमाणपत्र विनंती'}
              </h1>
              <p className="text-blue-200 text-[10px] font-bold uppercase tracking-widest">
                {lang === 'EN' ? 'Municipal Services • AI Verified' : 'महानगरपालिका सेवा • AI सत्यापित'}
              </p>
            </div>
          </div>
          <div className="bg-white/10 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
            Step {step} of 3
          </div>
        </div>

        <div className="p-8">
          {/* STEP 1: SELECT CERTIFICATE TYPE [cite: 224] */}
          {step === 1 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              <label className="block text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4">
                {lang === 'EN' ? 'Choose Certificate Type' : 'प्रमाणपत्राचा प्रकार निवडा'}
              </label>
              {['Birth Certificate', 'Death Certificate', 'Trade License'].map((type) => (
                <button 
                  key={type}
                  onClick={() => { setCertType(type); setStep(2); }}
                  className="w-full flex items-center justify-between p-6 rounded-2xl border-2 border-slate-100 hover:border-[#1e3a8a] hover:bg-blue-50 transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className="bg-slate-100 p-3 rounded-xl group-hover:bg-[#1e3a8a] group-hover:text-white transition-colors">
                      <FileText size={24} />
                    </div>
                    <span className="font-bold text-slate-700">{lang === 'EN' ? type : 'प्रमाणपत्र'}</span>
                  </div>
                  <ArrowRight size={20} className="text-slate-300 group-hover:text-[#1e3a8a]" />
                </button>
              ))}
            </motion.div>
          )}

          {/* STEP 2: DOCUMENT UPLOAD (AI OCR) [cite: 226, 273] */}
          {step === 2 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="text-center py-6">
              <div className="bg-blue-50 p-10 rounded-3xl border-2 border-dashed border-blue-200 mb-8">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                   <Upload size={32} className="text-[#1e3a8a]" />
                </div>
                <h3 className="text-xl font-black text-slate-800 mb-2">
                  {lang === 'EN' ? `Upload ID for ${certType}` : 'ओळखपत्र अपलोड करा'}
                </h3>
                <p className="text-sm text-slate-500 font-medium mb-8 max-w-xs mx-auto">
                  {lang === 'EN' ? 'Our AI will extract your Name and Address automatically.' : 'आमचे AI तुमचे नाव आणि पत्ता आपोआप काढेल.'}
                </p>
                <button 
                  onClick={handleFileUpload}
                  disabled={isVerifying}
                  className={`px-12 py-4 rounded-xl font-black text-lg shadow-xl transition-all ${
                    isVerifying ? 'bg-slate-200 text-slate-400' : 'bg-[#1e3a8a] text-white hover:scale-105'
                  }`}
                >
                  {isVerifying ? (lang === 'EN' ? 'SCANNING ID...' : 'आयडी स्कॅन करत आहे...') : (lang === 'EN' ? 'SELECT FILE' : 'फाइल निवडा')}
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 3: REVIEW & PAYMENT [cite: 230, 231] */}
          {step === 3 && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
              <div className="bg-green-50 border border-green-100 p-5 rounded-2xl flex items-center gap-4 text-green-700">
                <CheckCircle size={28} />
                <div>
                  <p className="text-sm font-black uppercase tracking-tight">{lang === 'EN' ? 'AI OCR Verified' : 'AI OCR सत्यापित'}</p>
                  <p className="text-xs font-medium opacity-80">{lang === 'EN' ? 'Data extracted: Aditya K., Pune.' : 'डेटा प्राप्त: आदित्य के., पुणे.'}</p>
                </div>
              </div>
              
              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-slate-500 font-bold text-xs uppercase tracking-widest">{lang === 'EN' ? 'Application Fee' : 'अर्ज शुल्क'}</span>
                  <span className="text-2xl font-black text-[#1e3a8a]">₹25.00</span>
                </div>
                <div className="h-px bg-slate-200 my-4"></div>
                
                <button 
                  onClick={() => navigate('/service/electricity/success')} 
                  className="w-full bg-green-600 text-white py-5 rounded-2xl font-black text-xl shadow-xl flex items-center justify-center gap-3 hover:bg-green-700 transition-all"
                >
                  {lang === 'EN' ? 'PAY & SUBMIT' : 'पेमेंट आणि सबमिट'} <ShieldCheck size={24} />
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CertificateRequest;
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Smile, Frown, Meh, Send, CheckCircle2, Loader2 } from 'lucide-react';
import { complaintAPI } from '../../services/api';
import { useLanguage } from '../../context/LanguageContext';

const Feedback = () => {
  const navigate = useNavigate();
  const { lang } = useLanguage();
  const [sentiment, setSentiment] = useState(null);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!sentiment) return;
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('description', `Service Feedback: ${sentiment}. ${comment || 'No additional comments.'}`);
      await complaintAPI.createComplaint(formData);
      setSubmitted(true);
      setTimeout(() => navigate('/dashboard'), 3000);
    } catch (err) {
      alert(err.response?.data?.message || (lang === 'en' ? 'Failed to submit feedback.' : 'प्रतिक्रिया सबमिट करने में विफल।'));
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <motion.div initial={{ scale: 0.5 }} animate={{ scale: 1 }} className="bg-white p-10 rounded-3xl shadow-2xl border border-green-100">
          <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={48} className="text-green-600" />
          </div>
          <h2 className="text-2xl font-black text-[#1e3a8a] mb-2">
            {lang === 'en' ? 'Thank You!' : 'धन्यवाद!'}
          </h2>
          <p className="text-slate-500 font-medium">
            {lang === 'en' ? 'Your feedback helps us improve services.' : 'आपकी प्रतिक्रिया हमें सेवाएं सुधारने में मदद करती है।'}
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 bg-slate-50">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-lg bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
        <div className="bg-[#1e3a8a] p-8 text-center text-white">
          <h1 className="text-2xl font-black uppercase tracking-tight">
            {lang === 'en' ? 'Service Feedback' : 'सेवा प्रतिक्रिया'}
          </h1>
          <p className="text-blue-200 text-xs font-bold uppercase tracking-widest mt-2">
            {lang === 'en' ? 'AI Sentiment Analysis Active' : 'AI सेंटिमेंट विश्लेषण सक्रिय'}
          </p>
        </div>

        <div className="p-8 space-y-8">
          <div className="flex justify-around items-center">
            {[
              { icon: <Frown size={40} />, label: 'Poor', color: 'text-red-500', val: 'negative' },
              { icon: <Meh size={40} />, label: 'Neutral', color: 'text-orange-500', val: 'neutral' },
              { icon: <Smile size={40} />, label: 'Great', color: 'text-green-500', val: 'positive' }
            ].map((s) => (
              <button
                key={s.val}
                onClick={() => setSentiment(s.val)}
                className={`flex flex-col items-center gap-2 p-4 rounded-2xl transition-all ${sentiment === s.val ? `bg-slate-100 ${s.color} scale-110 shadow-inner` : 'text-slate-300 hover:text-slate-400'}`}
              >
                {s.icon}
                <span className="text-[10px] font-black uppercase tracking-tighter">{lang === 'en' ? s.label : 'अभिप्राय'}</span>
              </button>
            ))}
          </div>

          <textarea
            className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 font-medium text-slate-700 outline-none focus:border-[#1e3a8a] transition-all h-32"
            placeholder={lang === 'en' ? "Tell us more about your experience..." : "अपना अनुभव हमें बताएं..."}
            onChange={(e) => setComment(e.target.value)}
          />

          <button
            onClick={handleSubmit}
            disabled={!sentiment || submitting}
            className={`w-full py-4 rounded-xl font-black text-lg shadow-lg flex items-center justify-center gap-2 transition-all ${sentiment && !submitting ? 'bg-[#1e3a8a] text-white hover:bg-blue-900' : 'bg-slate-100 text-slate-300'}`}
          >
            {submitting ? (<><Loader2 className="animate-spin" size={20} /> {lang === 'en' ? 'Submitting...' : 'सबमिट हो रहा है...'}</>) : (<>{lang === 'en' ? 'SUBMIT FEEDBACK' : 'प्रतिक्रिया सबमिट करें'} <Send size={20} /></>)}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Feedback;
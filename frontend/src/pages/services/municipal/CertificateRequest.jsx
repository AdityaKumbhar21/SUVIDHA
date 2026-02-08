import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileText, Upload, CheckCircle, ChevronLeft, ArrowRight, Loader2 } from 'lucide-react';
import { municipalAPI } from '../../../services/api';
import { useLanguage } from '../../../context/LanguageContext';

const CertificateRequest = () => {
  const navigate = useNavigate();
  const { lang } = useLanguage();
  const [step, setStep] = useState(1);
  const [certType, setCertType] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(null);
  const [docFile, setDocFile] = useState(null);

  // Birth certificate fields
  const [childName, setChildName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [placeOfBirth, setPlaceOfBirth] = useState('');

  // Death certificate fields
  const [deceasedName, setDeceasedName] = useState('');
  const [dateOfDeath, setDateOfDeath] = useState('');
  const [placeOfDeath, setPlaceOfDeath] = useState('');

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const formData = new FormData();
      if (docFile) formData.append('document', docFile);

      let response;
      if (certType === 'Birth Certificate') {
        formData.append('childName', childName);
        formData.append('dateOfBirth', dateOfBirth);
        formData.append('placeOfBirth', placeOfBirth);
        response = await municipalAPI.requestBirthCertificate(formData);
      } else {
        formData.append('deceasedName', deceasedName);
        formData.append('dateOfDeath', dateOfDeath);
        formData.append('placeOfDeath', placeOfDeath);
        response = await municipalAPI.requestDeathCertificate(formData);
      }
      setSuccess(response.data.complaintId);
      setTimeout(() => navigate('/dashboard'), 3000);
    } catch (err) {
      alert(err.response?.data?.message || (lang === 'en' ? 'Failed to submit request.' : 'अनुरोध सबमिट करने में विफल।'));
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
          <h2 className="text-2xl font-black text-slate-800 mb-2">{lang === 'en' ? 'Request Submitted!' : 'अनुरोध सबमिट!'}</h2>
          <p className="text-slate-500 text-sm">{lang === 'en' ? 'Your certificate request has been registered.' : 'आपका प्रमाणपत्र अनुरोध दर्ज कर लिया गया है।'}</p>
          <div className="mt-4 bg-slate-50 px-4 py-2 rounded-full text-xs font-mono text-slate-500">ID: {success}</div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col max-w-2xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => step === 1 ? navigate(-1) : setStep(step - 1)} className="p-3 bg-white rounded-xl border-2 border-slate-200 text-slate-400 hover:border-[#1e3a8a] hover:text-[#1e3a8a] transition-all active:scale-95">
          <ChevronLeft size={24} />
        </button>
        <div>
          <h1 className="text-2xl font-black text-slate-800 uppercase tracking-tight">
            {lang === 'en' ? 'Certificate Request' : 'प्रमाणपत्र अनुरोध'}
          </h1>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{lang === 'en' ? `Step ${step} of 2` : `चरण ${step} / 2`}</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden flex-1 flex flex-col">
        {step === 1 && (
          <div className="p-6 flex-1 flex flex-col gap-4">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{lang === 'en' ? 'Choose Certificate Type' : 'प्रमाण पत्र का प्रकार चुनें'}</p>
            {['Birth Certificate', 'Death Certificate'].map((type) => (
              <button key={type} onClick={() => { setCertType(type); setStep(2); }}
                className="w-full flex items-center justify-between p-6 rounded-2xl border-2 border-slate-200 hover:border-blue-500 hover:bg-blue-50 transition-all group">
                <div className="flex items-center gap-4">
                  <div className="bg-slate-100 p-3 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <FileText size={24} />
                  </div>
                  <span className="font-bold text-slate-700">{lang === 'en' ? type : (type === 'Birth Certificate' ? 'जन्म प्रमाण पत्र' : 'मृत्यु प्रमाण पत्र')}</span>
                </div>
                <ArrowRight size={20} className="text-slate-300 group-hover:text-blue-600" />
              </button>
            ))}
          </div>
        )}

        {step === 2 && (
          <div className="p-6 flex-1 flex flex-col gap-5">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{lang === 'en' ? `${certType} Details` : 'विवरण भरें'}</p>
            {certType === 'Birth Certificate' ? (
              <>
                <input type="text" value={childName} onChange={(e) => setChildName(e.target.value)} disabled={submitting}
                  placeholder={lang === 'en' ? "Child's Full Name" : "बच्चे का पूरा नाम"}
                  className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl p-4 text-lg font-medium focus:border-[#1e3a8a] focus:outline-none disabled:opacity-50" />
                <input type="date" value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} disabled={submitting}
                  className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl p-4 text-lg font-medium focus:border-[#1e3a8a] focus:outline-none disabled:opacity-50" />
                <input type="text" value={placeOfBirth} onChange={(e) => setPlaceOfBirth(e.target.value)} disabled={submitting}
                  placeholder={lang === 'en' ? "Place of Birth (Hospital / City)" : "जन्म स्थान (अस্পতল / शहर)"}
                  className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl p-4 text-lg font-medium focus:border-[#1e3a8a] focus:outline-none disabled:opacity-50" />
              </>
            ) : (
              <>
                <input type="text" value={deceasedName} onChange={(e) => setDeceasedName(e.target.value)} disabled={submitting}
                  placeholder={lang === 'en' ? "Deceased's Full Name" : "मृतक का पूरा नाम"}
                  className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl p-4 text-lg font-medium focus:border-[#1e3a8a] focus:outline-none disabled:opacity-50" />
                <input type="date" value={dateOfDeath} onChange={(e) => setDateOfDeath(e.target.value)} disabled={submitting}
                  className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl p-4 text-lg font-medium focus:border-[#1e3a8a] focus:outline-none disabled:opacity-50" />
                <input type="text" value={placeOfDeath} onChange={(e) => setPlaceOfDeath(e.target.value)} disabled={submitting}
                  placeholder={lang === 'en' ? "Place of Death" : "मृत्यु स्थान"}
                  className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl p-4 text-lg font-medium focus:border-[#1e3a8a] focus:outline-none disabled:opacity-50" />
              </>
            )}
            <label className="flex items-center justify-center gap-2 w-full py-4 border-2 border-dashed border-slate-300 rounded-xl text-slate-500 font-bold hover:bg-slate-50 cursor-pointer">
              <Upload size={20} /> {docFile ? (lang === 'en' ? 'Document Selected' : 'दस्तावेज़ चयनित') : (lang === 'en' ? 'Upload Supporting Document (Optional)' : 'सहायक दस्तावेज़ अपलोड करें (वैकल्पिक)')}
              <input type="file" accept="image/*,.pdf" onChange={(e) => setDocFile(e.target.files?.[0] || null)} disabled={submitting} className="hidden" />
            </label>
          </div>
        )}

        {step === 2 && (
          <div className="p-6 border-t border-slate-100 bg-slate-50">
            <button onClick={handleSubmit}
              disabled={submitting || (certType === 'Birth Certificate' ? (!childName || !dateOfBirth || !placeOfBirth) : (!deceasedName || !dateOfDeath || !placeOfDeath))}
              className="w-full py-4 rounded-xl bg-[#1e3a8a] text-white font-bold text-lg shadow-lg active:scale-95 disabled:opacity-50 transition-all flex items-center justify-center gap-2">
              {submitting ? (<><Loader2 className="animate-spin" size={20} /> {lang === 'en' ? 'Submitting...' : 'सबमिट हो रहा है...'}</>) : (lang === 'en' ? 'Submit Request' : 'अनुरोध सबमिट करें')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CertificateRequest;
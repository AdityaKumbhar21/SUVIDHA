import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  Building2,
  MapPin,
  Send,
  Loader2,
  CheckCircle,
  X,
  AlertTriangle,
  Clock,
  Shield,
  Sparkles,
  Home,
  FileText,
  Lightbulb,
  Droplets,
  Construction,
  TreePine,
  Zap,
  Trash2,
} from 'lucide-react';
import { complaintAPI } from '../../../services/api';
import { useLanguage } from '../../../context/LanguageContext';
import LocationPicker from '../../../components/forms/LocationPicker';
import DescriptionPicker from '../../../components/forms/DescriptionPicker';

// ─── Category-specific description options ───
const CATEGORY_DESCRIPTIONS = {
  road: [
    { value: 'Large pothole on road causing accidents', label: 'Large pothole on road' },
    { value: 'Road surface completely damaged and broken', label: 'Road surface damaged' },
    { value: 'Speed breaker is too high or damaged', label: 'Speed breaker issue' },
    { value: 'Road not repaired after digging for pipeline', label: 'Road not repaired after digging' },
    { value: 'Waterlogging on road due to poor drainage', label: 'Waterlogging on road' },
    { value: 'Road divider broken or missing', label: 'Road divider broken/missing' },
  ],
  streetlight: [
    { value: 'Streetlight not working for several days', label: 'Not working for days' },
    { value: 'Streetlight pole is leaning or fallen', label: 'Pole leaning or fallen' },
    { value: 'Wires exposed from streetlight, safety hazard', label: 'Exposed wires - safety hazard' },
    { value: 'Streetlight flickering or dim', label: 'Flickering or dim light' },
    { value: 'New streetlight needed in dark area', label: 'New streetlight needed' },
    { value: 'Multiple streetlights not working in area', label: 'Multiple lights not working' },
  ],
  drainage: [
    { value: 'Drain blocked causing water stagnation', label: 'Drain blocked' },
    { value: 'Sewage overflowing on road', label: 'Sewage overflowing' },
    { value: 'Manhole cover missing or broken', label: 'Manhole cover missing/broken' },
    { value: 'Drain needs cleaning, full of garbage', label: 'Drain full of garbage' },
    { value: 'Sewage water entering houses', label: 'Sewage entering houses' },
    { value: 'Bad smell from open drain', label: 'Bad smell from drain' },
  ],
  water: [
    { value: 'No water supply for several days', label: 'No water supply' },
    { value: 'Low water pressure in area', label: 'Low water pressure' },
    { value: 'Contaminated or dirty water coming', label: 'Contaminated water' },
    { value: 'Water pipeline leaking on road', label: 'Pipeline leaking' },
    { value: 'Irregular water supply timing', label: 'Irregular supply timing' },
    { value: 'Water tanker not arriving as scheduled', label: 'Tanker not arriving' },
  ],
  garbage: [
    { value: 'Garbage not collected for many days', label: 'Not collected for days' },
    { value: 'Garbage dumped illegally in open area', label: 'Illegal dumping' },
    { value: 'Community dustbin overflowing', label: 'Dustbin overflowing' },
    { value: 'No dustbin provided in our area', label: 'No dustbin in area' },
    { value: 'Waste segregation not being done', label: 'No waste segregation' },
    { value: 'Dead animal carcass not removed', label: 'Dead animal not removed' },
  ],
  tree: [
    { value: 'Large tree fallen blocking road', label: 'Fallen tree blocking road' },
    { value: 'Tree needs trimming, blocking visibility', label: 'Tree needs trimming' },
    { value: 'Park not maintained, overgrown grass', label: 'Park not maintained' },
    { value: 'Broken bench or equipment in park', label: 'Broken park equipment' },
    { value: 'Tree roots damaging road or footpath', label: 'Tree roots damaging road' },
    { value: 'Request for tree plantation in area', label: 'Tree plantation request' },
  ],
  encroachment: [
    { value: 'Illegal construction on government land', label: 'Illegal construction' },
    { value: 'Footpath blocked by street vendors', label: 'Footpath blocked' },
    { value: 'Shops extending beyond allowed boundary', label: 'Shops extending boundary' },
    { value: 'Unauthorized parking blocking road', label: 'Unauthorized parking' },
    { value: 'Construction material dumped on public road', label: 'Construction material on road' },
    { value: 'Illegal hoarding or signboard', label: 'Illegal hoarding/signboard' },
  ],
  other: [
    { value: 'Public toilet not clean or maintained', label: 'Public toilet not clean' },
    { value: 'Stray dog or animal menace in area', label: 'Stray animal menace' },
    { value: 'Noise pollution from construction or event', label: 'Noise pollution' },
    { value: 'Mosquito breeding in stagnant water', label: 'Mosquito breeding' },
    { value: 'Public property damaged or vandalized', label: 'Public property damaged' },
    { value: 'Other civic issue not listed above', label: 'Other civic issue' },
  ],
};

const CATEGORY_DESCRIPTIONS_HI = {
  road: [
    { value: 'सड़क पर बड़ा गड्ढा, दुर्घटना का कारण', label: 'सड़क पर बड़ा गड्ढा' },
    { value: 'सड़क की सतह पूरी तरह क्षतिग्रस्त', label: 'सड़क क्षतिग्रस्त' },
    { value: 'स्पीड ब्रेकर बहुत ऊंचा या टूटा हुआ', label: 'स्पीड ब्रेकर समस्या' },
    { value: 'पाइपलाइन खुदाई के बाद सड़क की मरम्मत नहीं', label: 'खुदाई के बाद मरम्मत नहीं' },
    { value: 'खराब नाली के कारण सड़क पर जलभराव', label: 'सड़क पर जलभराव' },
    { value: 'सड़क विभाजक टूटा या गायब', label: 'सड़क विभाजक टूटा' },
  ],
  streetlight: [
    { value: 'कई दिनों से स्ट्रीटलाइट काम नहीं कर रही', label: 'कई दिनों से बंद' },
    { value: 'स्ट्रीटलाइट का खंभा झुका या गिरा', label: 'खंभा झुका या गिरा' },
    { value: 'स्ट्रीटलाइट से तार खुले, सुरक्षा खतरा', label: 'तार खुले - खतरा' },
    { value: 'स्ट्रीटलाइट टिमटिमा रही या मद्धम', label: 'टिमटिमा रही या मद्धम' },
    { value: 'अंधेरे क्षेत्र में नई स्ट्रीटलाइट चाहिए', label: 'नई स्ट्रीटलाइट चाहिए' },
    { value: 'क्षेत्र में कई स्ट्रीटलाइट बंद', label: 'कई लाइट बंद' },
  ],
  drainage: [
    { value: 'नाली बंद, पानी भर रहा है', label: 'नाली बंद' },
    { value: 'सीवेज सड़क पर बह रहा है', label: 'सीवेज ओवरफ्लो' },
    { value: 'मैनहोल कवर गायब या टूटा', label: 'मैनहोल कवर गायब' },
    { value: 'नाली सफाई चाहिए, कचरे से भरी', label: 'नाली कचरे से भरी' },
    { value: 'सीवेज पानी घरों में आ रहा है', label: 'सीवेज घरों में' },
    { value: 'खुली नाली से बदबू', label: 'नाली से बदबू' },
  ],
  water: [
    { value: 'कई दिनों से पानी की आपूर्ति नहीं', label: 'पानी नहीं आ रहा' },
    { value: 'क्षेत्र में पानी का दबाव कम', label: 'कम पानी दबाव' },
    { value: 'दूषित या गंदा पानी आ रहा है', label: 'दूषित पानी' },
    { value: 'सड़क पर पानी की पाइपलाइन से रिसाव', label: 'पाइपलाइन रिसाव' },
    { value: 'पानी की आपूर्ति का समय अनियमित', label: 'अनियमित आपूर्ति' },
    { value: 'पानी का टैंकर समय पर नहीं आया', label: 'टैंकर नहीं आया' },
  ],
  garbage: [
    { value: 'कई दिनों से कचरा नहीं उठाया गया', label: 'कचरा नहीं उठाया' },
    { value: 'खुले क्षेत्र में अवैध कचरा फेंका गया', label: 'अवैध कचरा डंपिंग' },
    { value: 'सामुदायिक कचरा पात्र ओवरफ्लो', label: 'कचरा पात्र ओवरफ्लो' },
    { value: 'हमारे क्षेत्र में कचरा पात्र नहीं', label: 'कचरा पात्र नहीं' },
    { value: 'कचरा अलगाव नहीं किया जा रहा', label: 'कचरा अलगाव नहीं' },
    { value: 'मृत जानवर का शव नहीं हटाया गया', label: 'मृत जानवर नहीं हटाया' },
  ],
  tree: [
    { value: 'बड़ा पेड़ गिरा, सड़क बंद', label: 'पेड़ गिरा, सड़क बंद' },
    { value: 'पेड़ की कटाई चाहिए, दृश्यता अवरुद्ध', label: 'पेड़ कटाई चाहिए' },
    { value: 'पार्क की देखभाल नहीं, घास बढ़ी', label: 'पार्क देखभाल नहीं' },
    { value: 'पार्क में टूटी बेंच या उपकरण', label: 'पार्क उपकरण टूटा' },
    { value: 'पेड़ की जड़ें सड़क या फुटपाथ तोड़ रही', label: 'पेड़ जड़ें सड़क तोड़ रही' },
    { value: 'क्षेत्र में वृक्षारोपण का अनुरोध', label: 'वृक्षारोपण अनुरोध' },
  ],
  encroachment: [
    { value: 'सरकारी जमीन पर अवैध निर्माण', label: 'अवैध निर्माण' },
    { value: 'फुटपाथ पर रेहड़ी-पटरी वालों का कब्जा', label: 'फुटपाथ पर कब्जा' },
    { value: 'दुकानें अनुमत सीमा से बाहर बढ़ीं', label: 'दुकानें सीमा से बाहर' },
    { value: 'अनाधिकृत पार्किंग से सड़क बंद', label: 'अनाधिकृत पार्किंग' },
    { value: 'सार्वजनिक सड़क पर निर्माण सामग्री', label: 'सड़क पर निर्माण सामग्री' },
    { value: 'अवैध होर्डिंग या साइनबोर्ड', label: 'अवैध होर्डिंग' },
  ],
  other: [
    { value: 'सार्वजनिक शौचालय साफ नहीं', label: 'शौचालय साफ नहीं' },
    { value: 'क्षेत्र में आवारा कुत्ते या जानवरों का उपद्रव', label: 'आवारा जानवर उपद्रव' },
    { value: 'निर्माण या कार्यक्रम से ध्वनि प्रदूषण', label: 'ध्वनि प्रदूषण' },
    { value: 'रुके पानी में मच्छर पनप रहे', label: 'मच्छर पनपना' },
    { value: 'सार्वजनिक संपत्ति क्षतिग्रस्त', label: 'सार्वजनिक संपत्ति क्षतिग्रस्त' },
    { value: 'अन्य नागरिक समस्या', label: 'अन्य नागरिक समस्या' },
  ],
};

// ─── Kiosk Grievance Categories ───
const GRIEVANCE_CATEGORIES = [
  { id: 'road', icon: Construction, color: 'from-orange-500 to-amber-600', en: 'Road / Pothole', hi: 'सड़क / गड्ढा' },
  { id: 'streetlight', icon: Lightbulb, color: 'from-yellow-500 to-orange-500', en: 'Streetlight', hi: 'स्ट्रीटलाइट' },
  { id: 'drainage', icon: Droplets, color: 'from-blue-500 to-cyan-600', en: 'Drainage / Sewer', hi: 'नाली / सीवर' },
  { id: 'water', icon: Droplets, color: 'from-sky-500 to-blue-600', en: 'Water Supply', hi: 'पानी आपूर्ति' },
  { id: 'garbage', icon: Trash2, color: 'from-green-500 to-emerald-600', en: 'Garbage / Waste', hi: 'कचरा / कूड़ा' },
  { id: 'tree', icon: TreePine, color: 'from-emerald-500 to-green-600', en: 'Tree / Park', hi: 'पेड़ / पार्क' },
  { id: 'encroachment', icon: Building2, color: 'from-red-500 to-rose-600', en: 'Encroachment', hi: 'अतिक्रमण' },
  { id: 'other', icon: FileText, color: 'from-purple-500 to-indigo-600', en: 'Other Issue', hi: 'अन्य समस्या' },
];

// ─── Priority Badge Component ───
const PriorityBadge = ({ priority }) => {
  const config = {
    CRITICAL: { bg: 'bg-red-100 border-red-300', text: 'text-red-700', label: 'CRITICAL', icon: AlertTriangle },
    MEDIUM: { bg: 'bg-amber-100 border-amber-300', text: 'text-amber-700', label: 'MEDIUM', icon: Clock },
    LOW: { bg: 'bg-green-100 border-green-300', text: 'text-green-700', label: 'LOW', icon: Shield },
  };
  const c = config[priority] || config.MEDIUM;
  const Icon = c.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${c.bg} ${c.text}`}>
      <Icon size={14} /> {c.label}
    </span>
  );
};

// ─── Step Indicator ───
const StepIndicator = ({ current, total, labels }) => (
  <div className="flex items-center justify-center gap-2 py-4">
    {Array.from({ length: total }, (_, i) => (
      <React.Fragment key={i}>
        <div className={`flex items-center justify-center w-10 h-10 rounded-full text-sm font-bold transition-all duration-300 ${
          i < current ? 'bg-green-500 text-white shadow-lg shadow-green-200' :
          i === current ? 'bg-[#7c3aed] text-white shadow-lg shadow-purple-200 scale-110' :
          'bg-slate-200 text-slate-400'
        }`}>
          {i < current ? <CheckCircle size={18} /> : i + 1}
        </div>
        {i < total - 1 && (
          <div className={`h-1 w-8 rounded-full transition-all duration-300 ${
            i < current ? 'bg-green-400' : 'bg-slate-200'
          }`} />
        )}
      </React.Fragment>
    ))}
  </div>
);

// ─── Main Kiosk Grievance Component ───
const MunicipalGrievance = () => {
  const navigate = useNavigate();
  const { lang } = useLanguage();

  // ── State ──
  const [step, setStep] = useState(0); // 0=category, 1=description, 2=review, 3=success
  const [category, setCategory] = useState(null);
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [aiResult, setAiResult] = useState(null);
  const [successData, setSuccessData] = useState(null);
  const [error, setError] = useState(null);

  // ── Text helpers ──
  const txt = useCallback((en, hi) => lang === 'en' ? en : hi, [lang]);

  // ── Descriptions based on category ──
  const getCategoryDescription = (catId) => {
    const descs = {
      road: txt('Damaged road, pothole, or uneven surface', 'क्षतिग्रस्त सड़क, गड्ढा या असमान सतह'),
      streetlight: txt('Non-working or damaged streetlight', 'खराब या क्षतिग्रस्त स्ट्रीटलाइट'),
      drainage: txt('Blocked drain or sewage overflow', 'अवरुद्ध नाली या सीवेज ओवरफ्लो'),
      water: txt('Water supply issue or contamination', 'पानी आपूर्ति समस्या या प्रदूषण'),
      garbage: txt('Garbage not collected or dumping', 'कचरा नहीं उठाया गया या डंपिंग'),
      tree: txt('Fallen tree or park maintenance issue', 'गिरा हुआ पेड़ या पार्क रखरखाव'),
      encroachment: txt('Illegal construction or encroachment', 'अवैध निर्माण या अतिक्रमण'),
      other: txt('Other municipal civic issue', 'अन्य नगरपालिका नागरिक मुद्दा'),
    };
    return descs[catId] || '';
  };



  // ── Build the full description including category context ──
  const buildFullDescription = () => {
    const catLabel = category ? (lang === 'en' ? GRIEVANCE_CATEGORIES.find(c => c.id === category)?.en : GRIEVANCE_CATEGORIES.find(c => c.id === category)?.hi) : '';
    return `[${catLabel}] ${description}`;
  };

  // ── Submit ──
  const handleSubmit = async () => {
    if (!description) return;
    setSubmitting(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('description', buildFullDescription());
      formData.append('department', 'MUNICIPAL');
      if (location) formData.append('location', location);
      formData.append('language', lang);

      const response = await complaintAPI.createComplaint(formData);
      const data = response.data;

      setAiResult({
        department: data.complaint?.department || 'MUNICIPAL',
        complaintType: data.complaint?.complaintType || 'GENERAL',
        priority: data.complaint?.priority || 'MEDIUM',
        etaMinutes: data.complaint?.etaMinutes || 2880,
      });

      setSuccessData({
        id: data.complaint?.id,
        department: data.complaint?.department,
        complaintType: data.complaint?.complaintType,
        status: data.complaint?.status,
        priority: data.complaint?.priority,
        etaMinutes: data.complaint?.etaMinutes,
      });

      setStep(3);
    } catch (err) {
      const msg = err.response?.data?.error || err.response?.data?.message;
      if (err.response?.status === 409) {
        setError(txt(
          'A similar complaint was already submitted recently. Please check your existing complaints.',
          'इसी प्रकार की शिकायत हाल ही में पहले से दर्ज की गई है। कृपया अपनी मौजूदा शिकायतें जांचें।'
        ));
      } else {
        setError(msg || txt('Failed to submit grievance. Please try again.', 'शिकायत दर्ज करने में विफल। कृपया पुनः प्रयास करें।'));
      }
      setSubmitting(false);
    }
  };

  // ── Format ETA ──
  const formatEta = (mins) => {
    if (!mins) return '';
    if (mins < 60) return `${mins} ${txt('mins', 'मिनट')}`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs} ${txt('hours', 'घंटे')}`;
    const days = Math.floor(hrs / 24);
    return `${days} ${txt('days', 'दिन')}`;
  };

  // ── Slide animation variants ──
  const slideVariants = {
    enter: (dir) => ({ x: dir > 0 ? 300 : -300, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir) => ({ x: dir < 0 ? 300 : -300, opacity: 0 }),
  };

  // ═══════════════════════════════════
  //  STEP 4: SUCCESS SCREEN
  // ═══════════════════════════════════
  if (step === 3 && successData) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center px-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: 40 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ type: 'spring', damping: 15 }}
          className="bg-white p-8 md:p-12 rounded-3xl shadow-2xl border border-green-100 text-center max-w-lg w-full"
        >
          {/* Success icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', damping: 10 }}
            className="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-green-200"
          >
            <CheckCircle size={52} className="text-white" strokeWidth={2.5} />
          </motion.div>

          <h2 className="text-3xl font-black text-slate-800 mb-2">
            {txt('Grievance Registered!', 'शिकायत दर्ज!')}
          </h2>
          <p className="text-slate-500 text-base mb-6">
            {txt('Your complaint has been registered and assigned.', 'आपकी शिकायत दर्ज करके सौंपी गई है।')}
          </p>

          {/* Complaint details card */}
          <div className="bg-slate-50 rounded-2xl p-5 text-left space-y-3 mb-6 border border-slate-100">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-slate-400 uppercase">{txt('Complaint ID', 'शिकायत आईडी')}</span>
              <span className="text-sm font-mono font-bold text-[#7c3aed] bg-purple-50 px-3 py-1 rounded-full">
                {successData.id?.slice(0, 8)}...
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-slate-400 uppercase">{txt('Department', 'विभाग')}</span>
              <span className="text-sm font-bold text-slate-700">{successData.department}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-slate-400 uppercase">{txt('Category', 'श्रेणी')}</span>
              <span className="text-sm font-bold text-slate-700">{successData.complaintType}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-slate-400 uppercase">{txt('Priority', 'प्राथमिकता')}</span>
              <PriorityBadge priority={successData.priority} />
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-slate-400 uppercase">{txt('Est. Resolution', 'अनुमानित समाधान')}</span>
              <span className="text-sm font-bold text-slate-700 flex items-center gap-1">
                <Clock size={14} className="text-amber-500" /> {formatEta(successData.etaMinutes)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-slate-400 uppercase">{txt('Status', 'स्थिति')}</span>
              <span className="bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full">{successData.status}</span>
            </div>
          </div>

          {/* AI badge */}
          <div className="flex items-center justify-center gap-2 text-xs text-purple-600 bg-purple-50 rounded-full px-4 py-2 mb-6">
            <Sparkles size={14} /> {txt('AI-classified and auto-routed to the correct department', 'AI द्वारा वर्गीकृत और सही विभाग को भेजा गया')}
          </div>

          <button
            onClick={() => navigate('/dashboard')}
            className="w-full py-4 rounded-2xl bg-[#1e3a8a] text-white font-bold text-lg shadow-lg shadow-purple-200 active:scale-[0.98] transition-transform flex items-center justify-center gap-2"
          >
            <Home size={20} /> {txt('Return to Home', 'होम पर लौटें')}
          </button>
        </motion.div>
      </div>
    );
  }

  // ═══════════════════════════════════
  //  MAIN KIOSK UI
  // ═══════════════════════════════════
  return (
    <div className="min-h-[80vh] flex flex-col relative z-10 max-w-2xl mx-auto pb-6">

      {/* ── Header ── */}
      <div className="flex items-center gap-4 mb-2">
        <button
          onClick={() => step > 0 ? setStep(step - 1) : navigate(-1)}
          className="p-3.5 bg-white rounded-2xl border-2 border-slate-200 text-slate-500 hover:bg-slate-50 active:scale-95 transition-transform shadow-sm"
        >
          <ChevronLeft size={24} />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-black text-slate-800 flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#7c3aed] to-indigo-600 flex items-center justify-center shadow-sm">
              <Building2 className="text-white" size={18} />
            </div>
            {txt('File Grievance', 'शिकायत दर्ज करें')}
          </h1>
          <p className="text-slate-400 text-xs font-medium mt-0.5">
            {txt('Municipal Corporation • AI-Powered', 'नगर निगम • AI-संचालित')}
          </p>
        </div>
      </div>

      {/* ── Step Indicator ── */}
      <StepIndicator current={step} total={3} />

      {/* ── Error Banner ── */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-red-50 border-2 border-red-200 rounded-2xl p-4 mb-4 flex items-start gap-3"
          >
            <AlertTriangle size={20} className="text-red-500 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-red-700 text-sm font-semibold">{error}</p>
            </div>
            <button onClick={() => setError(null)} className="text-red-400 hover:text-red-600">
              <X size={18} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Step Content ── */}
      <div className="bg-white rounded-3xl shadow-lg border border-slate-200 overflow-hidden flex-1 flex flex-col">
        <AnimatePresence mode="wait" custom={1}>

          {/* ═══ STEP 0: Category Selection ═══ */}
          {step === 0 && (
            <motion.div
              key="step0"
              custom={1}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.25 }}
              className="p-6 flex-1 flex flex-col"
            >
              <div className="mb-5">
                <h2 className="text-xl font-black text-slate-800">
                  {txt('What is the issue?', 'समस्या क्या है?')}
                </h2>
                <p className="text-slate-400 text-sm mt-1">
                  {txt('Tap on the category that best describes your grievance', 'अपनी शिकायत का सबसे उपयुक्त श्रेणी चुनें')}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 flex-1">
                {GRIEVANCE_CATEGORIES.map((cat) => {
                  const Icon = cat.icon;
                  const isSelected = category === cat.id;
                  return (
                    <motion.button
                      key={cat.id}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setCategory(cat.id);
                        setDescription(getCategoryDescription(cat.id));
                      }}
                      className={`relative flex flex-col items-center justify-center gap-2 p-5 rounded-2xl border-2 transition-all duration-200 min-h-[100px] ${
                        isSelected
                          ? 'border-[#7c3aed] bg-purple-50 shadow-lg shadow-purple-100'
                          : 'border-slate-200 bg-slate-50 hover:bg-white hover:border-slate-300 hover:shadow-md'
                      }`}
                    >
                      {isSelected && (
                        <motion.div
                          layoutId="categoryCheck"
                          className="absolute top-2 right-2 w-6 h-6 bg-[#7c3aed] rounded-full flex items-center justify-center"
                        >
                          <CheckCircle size={14} className="text-white" />
                        </motion.div>
                      )}
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center shadow-sm`}>
                        <Icon size={22} className="text-white" />
                      </div>
                      <span className={`text-sm font-bold text-center leading-tight ${isSelected ? 'text-[#7c3aed]' : 'text-slate-700'}`}>
                        {lang === 'en' ? cat.en : cat.hi}
                      </span>
                    </motion.button>
                  );
                })}
              </div>

              {/* Next button */}
              <div className="mt-5">
                <button
                  onClick={() => category && setStep(1)}
                  disabled={!category}
                  className="w-full py-4 rounded-2xl bg-[#1e3a8a] text-white font-bold text-lg shadow-lg shadow-purple-200 disabled:opacity-40 disabled:shadow-none active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                >
                  {txt('Next', 'आगे बढ़ें')} <ChevronRight size={20} />
                </button>
              </div>
            </motion.div>
          )}

          {/* ═══ STEP 1: Description & Location ═══ */}
          {step === 1 && (
            <motion.div
              key="step1"
              custom={1}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.25 }}
              className="p-6 flex-1 flex flex-col"
            >
              <div className="mb-5">
                <h2 className="text-xl font-black text-slate-800">
                  {txt('Describe the Problem', 'समस्या का वर्णन करें')}
                </h2>
                <p className="text-slate-400 text-sm mt-1">
                  {txt('Provide details so we can help you faster', 'विवरण दें ताकि हम आपकी जल्दी मदद कर सकें')}
                </p>
              </div>

              {/* Location */}
              <div className="mb-4">
                <LocationPicker
                  value={location}
                  onChange={setLocation}
                  disabled={submitting}
                  lang={lang}
                  label={txt('Location', 'स्थान')}
                />
              </div>

              {/* Description */}
              <div className="flex-1 flex flex-col">
                <DescriptionPicker
                  value={description}
                  onChange={setDescription}
                  options={lang === 'en' ? (CATEGORY_DESCRIPTIONS[category] || CATEGORY_DESCRIPTIONS.other) : (CATEGORY_DESCRIPTIONS_HI[category] || CATEGORY_DESCRIPTIONS_HI.other)}
                  placeholder={txt('Select issue description...', 'समस्या विवरण चुनें...')}
                  label={txt('Complaint Details', 'शिकायत विवरण')}
                  disabled={submitting}
                />
                <div className="flex justify-between items-center mt-2">
                  <p className={`text-xs font-medium ${description ? 'text-green-500' : 'text-slate-400'}`}>
                    {description ? '✓' : '○'} {txt('Issue selected', 'समस्या चयनित')}
                  </p>
                  <div className="flex items-center gap-1 text-xs text-purple-500">
                    <Sparkles size={12} /> {txt('AI will auto-classify', 'AI स्वतः वर्गीकृत करेगा')}
                  </div>
                </div>
              </div>

              {/* Next */}
              <div className="mt-5">
                <button
                  onClick={() => description && setStep(2)}
                  disabled={!description}
                  className="w-full py-4 rounded-2xl bg-[#1e3a8a] text-white font-bold text-lg shadow-lg shadow-purple-200 disabled:opacity-40 disabled:shadow-none active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                >
                  {txt('Next: Review', 'आगे: समीक्षा')} <ChevronRight size={20} />
                </button>
              </div>
            </motion.div>
          )}

          {/* ═══ STEP 2: Review & Submit ═══ */}
          {step === 2 && (
            <motion.div
              key="step2"
              custom={1}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.25 }}
              className="p-6 flex-1 flex flex-col"
            >
              <div className="mb-5">
                <h2 className="text-xl font-black text-slate-800">
                  {txt('Review & Submit', 'समीक्षा करें और सबमिट करें')}
                </h2>
                <p className="text-slate-400 text-sm mt-1">
                  {txt('Verify details before submitting', 'सबमिट करने से पहले विवरण सत्यापित करें')}
                </p>
              </div>

              <div className="flex-1 space-y-4 overflow-y-auto">
                {/* Category */}
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                  <span className="text-xs font-bold text-slate-400 uppercase block mb-1">{txt('Category', 'श्रेणी')}</span>
                  <div className="flex items-center gap-2">
                    {category && (() => {
                      const cat = GRIEVANCE_CATEGORIES.find(c => c.id === category);
                      const Icon = cat?.icon || FileText;
                      return (
                        <>
                          <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${cat?.color} flex items-center justify-center`}>
                            <Icon size={16} className="text-white" />
                          </div>
                          <span className="font-bold text-slate-800">{lang === 'en' ? cat?.en : cat?.hi}</span>
                        </>
                      );
                    })()}
                  </div>
                </div>

                {/* Location */}
                {location && (
                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                    <span className="text-xs font-bold text-slate-400 uppercase block mb-1">{txt('Location', 'स्थान')}</span>
                    <div className="flex items-center gap-2">
                      <MapPin size={16} className="text-[#7c3aed]" />
                      <span className="font-medium text-slate-700">{location}</span>
                    </div>
                  </div>
                )}

                {/* Description */}
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                  <span className="text-xs font-bold text-slate-400 uppercase block mb-1">{txt('Description', 'विवरण')}</span>
                  <p className="text-slate-700 font-medium text-sm leading-relaxed">{description}</p>
                </div>

                {/* AI Notice */}
                <div className="bg-purple-50 rounded-2xl p-4 border border-purple-100 flex items-start gap-3">
                  <Sparkles size={20} className="text-[#7c3aed] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-bold text-[#7c3aed]">{txt('AI Auto-Classification', 'AI स्वतः वर्गीकरण')}</p>
                    <p className="text-xs text-purple-500 mt-1">
                      {txt(
                        'Your complaint will be automatically classified by AI and routed to the correct department with priority assignment.',
                        'आपकी शिकायत AI द्वारा स्वचालित रूप से वर्गीकृत और प्राथमिकता के साथ सही विभाग को भेजी जाएगी।'
                      )}
                    </p>
                  </div>
                </div>
              </div>

              {/* Submit */}
              <div className="mt-5">
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="w-full py-5 rounded-2xl bg-[#1e3a8a] text-white font-bold text-lg shadow-lg shadow-green-200 disabled:opacity-60 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="animate-spin" size={22} />
                      <span>{txt('AI is classifying & submitting...', 'AI वर्गीकृत और सबमिट कर रहा है...')}</span>
                    </>
                  ) : (
                    <>
                      <Send size={20} />
                      <span>{txt('Submit Grievance', 'शिकायत सबमिट करें')}</span>
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* ── Kiosk Footer ── */}
      <div className="mt-4 text-center">
        <p className="text-xs text-slate-400 font-medium">
          {txt('Designed for Public Service • AI-Powered Complaint System', 'सार्वजनिक सेवा के लिए डिज़ाइन • AI-संचालित शिकायत प्रणाली')}
        </p>
      </div>
    </div>
  );
};

export default MunicipalGrievance;

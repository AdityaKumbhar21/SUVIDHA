import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Flame, Truck, CheckCircle, Package, Loader2, CreditCard, Banknote, Delete, Search } from 'lucide-react';
import { gasAPI } from '../../../services/api';
import { useLanguage } from '../../../context/LanguageContext';

const PROVIDERS = [
  { id: 'indane', label: 'Indane Gas', color: 'border-blue-500 bg-blue-50 text-blue-700' },
  { id: 'hp', label: 'HP Gas', color: 'border-green-500 bg-green-50 text-green-700' },
  { id: 'bharat', label: 'Bharat Gas', color: 'border-red-500 bg-red-50 text-red-700' },
];

const CYLINDER_TYPES = [
  { id: '14.2kg', label: '14.2 kg', price: 903 },
  { id: '5kg', label: '5 kg', price: 455 },
  { id: '19kg', label: '19 kg (Commercial)', price: 1750 },
];

const slideVariants = {
  enter: (d) => ({ x: d > 0 ? 300 : -300, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (d) => ({ x: d < 0 ? 300 : -300, opacity: 0 }),
};

const BookCylinder = () => {
  const navigate = useNavigate();
  const { lang } = useLanguage();
  const txt = (en, hi) => (lang === 'en' ? en : hi);

  // Step: 1=mobile, 2=details+config, 3=success
  const [step, setStep] = useState(1);
  const [mobile, setMobile] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetched user data
  const [userData, setUserData] = useState(null);

  // Booking config
  const [selectedConnection, setSelectedConnection] = useState('');
  const [provider, setProvider] = useState('indane');
  const [cylinderType, setCylinderType] = useState('14.2kg');
  const [address, setAddress] = useState('');
  const [paymentMode, setPaymentMode] = useState('PAY_ON_DELIVERY');

  // Result
  const [bookingResult, setBookingResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // ── Keypad ──
  const handleKeyPress = (key) => {
    if (key === 'backspace') {
      setMobile((p) => p.slice(0, -1));
    } else if (mobile.length < 10) {
      setMobile((p) => p + key);
    }
    setError('');
  };

  // ── Lookup ──
  const handleLookup = async () => {
    if (mobile.length !== 10) {
      setError(txt('Enter 10-digit mobile number', '10 अंकों का मोबाइल नंबर दर्ज करें'));
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await gasAPI.lookupByMobile(mobile);
      setUserData(res.data);
      setAddress(res.data.address || '');
      if (res.data.gasConnections?.length > 0) {
        setSelectedConnection(res.data.gasConnections[0]);
      }
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || txt('No gas connection found', 'कोई गैस कनेक्शन नहीं मिला'));
    } finally {
      setLoading(false);
    }
  };

  // ── Book ──
  const handleBook = async () => {
    if (!selectedConnection || !address) return;
    setSubmitting(true);
    try {
      const res = await gasAPI.bookCylinder({
        consumerNumber: selectedConnection,
        provider,
        deliveryAddress: address,
        cylinderType,
        paymentMode,
      });
      setBookingResult(res.data);
      setStep(3);

      // If PAY_NOW, navigate to card payment
      if (res.data.paymentMode === 'PAY_NOW' && res.data.clientSecret) {
        setTimeout(() => {
          navigate('/service/electricity/card-payment', {
            state: {
              clientSecret: res.data.clientSecret,
              amountPaise: res.data.amountPaise,
              consumerNumber: selectedConnection,
              service: 'Gas Cylinder',
            },
          });
        }, 1500);
      } else {
        // Auto-redirect for pay on delivery
        setTimeout(() => navigate('/dashboard'), 4000);
      }
    } catch (err) {
      setError(err.response?.data?.message || txt('Booking failed', 'बुकिंग विफल'));
      setSubmitting(false);
    }
  };

  const selectedPrice = CYLINDER_TYPES.find(c => c.id === cylinderType)?.price || 903;

  return (
    <div className="h-full flex flex-col max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => (step > 1 && step < 3 ? setStep(step - 1) : navigate(-1))}
          className="p-3 bg-white rounded-xl border-2 border-slate-200 text-slate-400 hover:border-[#1e3a8a] hover:text-[#1e3a8a] transition-all active:scale-95"
        >
          <ChevronLeft size={24} />
        </button>
        <div>
          <h1 className="text-2xl font-black text-slate-800 uppercase tracking-tight">
            {txt('Book Cylinder', 'सिलेंडर बुक करें')}
          </h1>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            {step === 1 && txt('Enter your mobile number', 'अपना मोबाइल नंबर दर्ज करें')}
            {step === 2 && txt('Select options & confirm', 'विकल्प चुनें और पुष्टि करें')}
            {step === 3 && txt('Booking confirmed', 'बुकिंग की पुष्टि')}
          </p>
        </div>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden flex-1 flex flex-col">
        <AnimatePresence mode="wait" custom={1}>

          {/* ═══ STEP 1: Mobile Keypad ═══ */}
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
              {/* Mobile Display */}
              <div className="bg-slate-50 rounded-2xl p-4 mb-4 border border-slate-100">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  {txt('Registered Mobile Number', 'पंजीकृत मोबाइल नंबर')}
                </label>
                <div className="flex items-center gap-3">
                  <span className="text-lg font-bold text-slate-500">+91</span>
                  <div className="flex-1 text-3xl font-black tracking-[0.2em] text-slate-800 min-h-[44px]">
                    {mobile || <span className="text-slate-300">••••••••••</span>}
                  </div>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-3 text-red-700 text-sm font-medium text-center">
                  {error}
                </div>
              )}

              {/* Keypad */}
              <div className="grid grid-cols-3 gap-2 mb-4">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, null, 0, 'backspace'].map((key, i) =>
                  key === null ? (
                    <div key={i} />
                  ) : (
                    <button
                      key={i}
                      onClick={() => handleKeyPress(key === 'backspace' ? 'backspace' : String(key))}
                      className={`py-4 rounded-xl text-xl font-bold transition-all active:scale-95 ${
                        key === 'backspace'
                          ? 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                          : 'bg-slate-50 text-slate-800 hover:bg-slate-100 border border-slate-200'
                      }`}
                    >
                      {key === 'backspace' ? <Delete size={22} className="mx-auto" /> : key}
                    </button>
                  )
                )}
              </div>

              {/* Fetch Button */}
              <button
                onClick={handleLookup}
                disabled={mobile.length !== 10 || loading}
                className="w-full py-5 rounded-2xl bg-[#1e3a8a] text-white font-bold text-lg shadow-lg disabled:opacity-40 active:scale-[0.98] transition-all flex items-center justify-center gap-3"
              >
                {loading ? (
                  <Loader2 size={22} className="animate-spin" />
                ) : (
                  <>
                    <Search size={20} />
                    {txt('Fetch Details', 'विवरण प्राप्त करें')}
                  </>
                )}
              </button>
            </motion.div>
          )}

          {/* ═══ STEP 2: Configuration & Confirm ═══ */}
          {step === 2 && userData && (
            <motion.div
              key="step2"
              custom={1}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.25 }}
              className="p-6 flex-1 flex flex-col overflow-y-auto"
            >
              {/* User Details */}
              <div className="bg-slate-50 rounded-2xl p-4 mb-4 border border-slate-100 space-y-2">
                <div className="flex justify-between">
                  <span className="text-xs font-bold text-slate-400 uppercase">{txt('Name', 'नाम')}</span>
                  <span className="font-bold text-slate-700">{userData.name || '—'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs font-bold text-slate-400 uppercase">{txt('Mobile', 'मोबाइल')}</span>
                  <span className="font-bold text-slate-700">{userData.mobile}</span>
                </div>
              </div>

              {/* Gas Connection Selector */}
              {userData.gasConnections?.length > 1 && (
                <div className="mb-4">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
                    {txt('Select Gas Connection', 'गैस कनेक्शन चुनें')}
                  </label>
                  <div className="flex gap-2 flex-wrap">
                    {userData.gasConnections.map((cn) => (
                      <button
                        key={cn}
                        onClick={() => setSelectedConnection(cn)}
                        className={`px-4 py-2 rounded-xl font-bold text-sm border-2 transition-all ${
                          selectedConnection === cn
                            ? 'border-[#1e3a8a] bg-blue-50 text-[#1e3a8a]'
                            : 'border-slate-200 text-slate-500'
                        }`}
                      >
                        {cn}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {userData.gasConnections?.length === 1 && (
                <div className="bg-blue-50 rounded-xl p-3 mb-4 border border-blue-100 text-sm">
                  <span className="text-xs font-bold text-slate-400 uppercase">{txt('Consumer No.', 'उपभोक्ता नं.')}</span>
                  <span className="font-bold text-[#1e3a8a] ml-2">{selectedConnection}</span>
                </div>
              )}

              {/* Provider */}
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
                {txt('Select Provider', 'प्रदाता चुनें')}
              </label>
              <div className="grid grid-cols-3 gap-2 mb-4">
                {PROVIDERS.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setProvider(p.id)}
                    className={`p-3 rounded-xl border-2 flex flex-col items-center gap-1 transition-all text-sm ${
                      provider === p.id
                        ? p.color
                        : 'border-slate-100 bg-slate-50 text-slate-400'
                    }`}
                  >
                    <Flame size={20} className={provider === p.id ? 'fill-current' : ''} />
                    <span className="font-bold">{p.label}</span>
                  </button>
                ))}
              </div>

              {/* Cylinder Type */}
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
                {txt('Cylinder Type', 'सिलेंडर प्रकार')}
              </label>
              <div className="grid grid-cols-3 gap-2 mb-4">
                {CYLINDER_TYPES.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setCylinderType(c.id)}
                    className={`p-3 rounded-xl border-2 flex flex-col items-center gap-1 transition-all text-sm ${
                      cylinderType === c.id
                        ? 'border-orange-500 bg-orange-50 text-orange-700'
                        : 'border-slate-100 bg-slate-50 text-slate-400'
                    }`}
                  >
                    <Package size={18} />
                    <span className="font-bold">{c.label}</span>
                    <span className="text-xs">₹{c.price}</span>
                  </button>
                ))}
              </div>

              {/* Delivery Address */}
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
                {txt('Delivery Address', 'डिलीवरी पता')}
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder={txt('Enter delivery address', 'डिलीवरी पता दर्ज करें')}
                className="w-full bg-white border-2 border-slate-200 rounded-xl p-3 text-base font-medium focus:border-[#1e3a8a] focus:outline-none mb-4"
              />

              {/* Payment Mode */}
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
                {txt('Payment Method', 'भुगतान विधि')}
              </label>
              <div className="grid grid-cols-2 gap-3 mb-5">
                <button
                  onClick={() => setPaymentMode('PAY_ON_DELIVERY')}
                  className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${
                    paymentMode === 'PAY_ON_DELIVERY'
                      ? 'border-green-500 bg-green-50 text-green-700'
                      : 'border-slate-100 bg-slate-50 text-slate-400'
                  }`}
                >
                  <Banknote size={24} />
                  <span className="font-bold text-sm">{txt('Pay on Delivery', 'डिलीवरी पर भुगतान')}</span>
                  <span className="text-xs">{txt('Cash / UPI', 'नकद / UPI')}</span>
                </button>
                <button
                  onClick={() => setPaymentMode('PAY_NOW')}
                  className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${
                    paymentMode === 'PAY_NOW'
                      ? 'border-[#1e3a8a] bg-blue-50 text-[#1e3a8a]'
                      : 'border-slate-100 bg-slate-50 text-slate-400'
                  }`}
                >
                  <CreditCard size={24} />
                  <span className="font-bold text-sm">{txt('Pay Now', 'अभी भुगतान करें')}</span>
                  <span className="text-xs">{txt('Card / Online', 'कार्ड / ऑनलाइन')}</span>
                </button>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-3 text-red-700 text-sm font-medium text-center">
                  {error}
                </div>
              )}

              {/* Price Summary & Book */}
              <div className="mt-auto">
                <div className="bg-slate-50 rounded-xl p-3 mb-3 flex justify-between items-center border border-slate-100">
                  <span className="text-sm font-bold text-slate-500">{txt('Total Amount', 'कुल राशि')}</span>
                  <span className="text-2xl font-black text-slate-800">₹{selectedPrice}</span>
                </div>
                <button
                  onClick={handleBook}
                  disabled={submitting || !address || !selectedConnection}
                  className="w-full py-5 rounded-2xl bg-[#1e3a8a] text-white font-bold text-lg shadow-lg disabled:opacity-40 active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                >
                  {submitting ? (
                    <>
                      <Loader2 size={22} className="animate-spin" />
                      <span>{txt('Booking...', 'बुकिंग हो रही है...')}</span>
                    </>
                  ) : paymentMode === 'PAY_ON_DELIVERY' ? (
                    <>
                      <Package size={20} />
                      {txt('Book — Pay on Delivery', 'बुक करें — डिलीवरी पर भुगतान')}
                    </>
                  ) : (
                    <>
                      <CreditCard size={20} />
                      {txt('Book & Pay Now', 'बुक करें और भुगतान करें')}
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          )}

          {/* ═══ STEP 3: Success ═══ */}
          {step === 3 && (
            <motion.div
              key="step3"
              custom={1}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.25 }}
              className="flex-1 flex flex-col items-center justify-center text-center p-8"
            >
              <motion.div
                initial={{ x: -300 }}
                animate={{ x: 0 }}
                transition={{ type: 'spring', stiffness: 50 }}
                className="mb-6"
              >
                <Truck size={80} className="text-green-600" />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <CheckCircle size={48} className="text-green-500 mx-auto mb-3" />
                <h2 className="text-3xl font-black text-green-800 mb-2">
                  {txt('Booking Confirmed!', 'बुकिंग की पुष्टि!')}
                </h2>
                <p className="text-green-700 font-medium mb-1">
                  {bookingResult?.paymentMode === 'PAY_ON_DELIVERY'
                    ? txt('Your cylinder will be delivered in 2-3 days.', 'आपका सिलेंडर 2-3 दिनों में डिलीवर होगा।')
                    : txt('Redirecting to payment...', 'भुगतान पर जा रहे हैं...')}
                </p>
                {bookingResult?.paymentMode === 'PAY_ON_DELIVERY' && (
                  <p className="text-green-600 text-sm font-medium">
                    {txt(`Pay ₹${selectedPrice} to the delivery person`, `डिलीवरी व्यक्ति को ₹${selectedPrice} का भुगतान करें`)}
                  </p>
                )}
                {bookingResult?.bookingId && (
                  <div className="mt-4 bg-white px-4 py-2 rounded-full border border-green-200 text-xs font-mono text-green-600">
                    Booking ID: {bookingResult.bookingId.slice(0, 8).toUpperCase()}
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
};

export default BookCylinder;
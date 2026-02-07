import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, Flame, Truck, CheckCircle, Package, Loader } from 'lucide-react';
import { gasAPI } from '../../../services/api';
import { useLanguage } from '../../../context/LanguageContext';

const BookCylinder = () => {
  const navigate = useNavigate();
  const { lang } = useLanguage();
  const [provider, setProvider] = useState('indane');
  const [bookingStatus, setBookingStatus] = useState('idle'); // idle, booking, success
  const [refId, setRefId] = useState('');

  const handleBook = async () => {
    setBookingStatus('booking');
    
    try {
      // Call the API to book cylinder (uses new-connection endpoint)
      const response = await gasAPI.bookCylinder({
        address: 'Default delivery address',
        provider: provider,
      });
      
      // Backend returns { complaintId: ... }
      const refId = response.data.complaintId || 'GAS-2026-BOOKED';
      setRefId(refId);
      setBookingStatus('success');
      
      // Auto-redirect after animation
      setTimeout(() => {
        navigate('/dashboard');
      }, 4000);
    } catch (err) {
      console.error('Error booking cylinder:', err);
      alert(err.response?.data?.message || (lang === 'en' ? 'Failed to book cylinder. Please try again.' : 'सिलेंडर बुक करने में विफल। कृपया पुनः प्रयास करें।'));
      setBookingStatus('idle');
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
           <h1 className="text-2xl font-black text-slate-800">{lang === 'en' ? 'Book Cylinder Refill' : 'सिलेंडर रिफिल बुक करें'}</h1>
           <p className="text-slate-500 text-sm">{lang === 'en' ? 'Select provider & confirm' : 'प्रदाता चुनें और पुष्टि करें'}</p>
        </div>
      </div>

      {/* MAIN CONTENT CARD */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden relative min-h-[400px]">
        
        {/* SUCCESS STATE (Truck Animation) */}
        {bookingStatus === 'success' ? (
          <div className="absolute inset-0 z-20 bg-green-50 flex flex-col items-center justify-center text-center p-8">
            <motion.div 
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              transition={{ type: "spring", stiffness: 50 }}
              className="mb-6"
            >
              <Truck size={80} className="text-green-600" />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <h2 className="text-3xl font-black text-green-800 mb-2">{lang === 'en' ? 'Booking Confirmed!' : 'बुकिंग की पुष्टि!'}</h2>
              <p className="text-green-700 font-medium">{lang === 'en' ? 'Your cylinder will be delivered in 2 days.' : 'आपका सिलेंडर 2 दिनों में डिलीवर होगा।'}</p>
              <div className="mt-6 bg-white px-4 py-2 rounded-full border border-green-200 text-xs font-mono text-green-600">
                Ref ID: {refId}
              </div>
            </motion.div>
          </div>
        ) : (
          /* FORM STATE */
          <div className="p-8 h-full flex flex-col">
            
            {/* Provider Selection */}
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">{lang === 'en' ? 'Select Provider' : 'प्रदाता चुनें'}</h3>
            <div className="grid grid-cols-3 gap-4 mb-8">
              {['indane', 'hp', 'bharat'].map((p) => (
                <button
                  key={p}
                  onClick={() => setProvider(p)}
                  disabled={bookingStatus === 'booking'}
                  className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all disabled:opacity-50 ${
                    provider === p 
                    ? 'border-orange-500 bg-orange-50 text-orange-700' 
                    : 'border-slate-100 bg-slate-50 text-slate-400 hover:border-orange-200'
                  }`}
                >
                  <Flame size={24} className={provider === p ? 'fill-orange-500' : ''} />
                  <span className="font-bold capitalize">{p} Gas</span>
                </button>
              ))}
            </div>

            {/* Consumer Details (Static for Demo) */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 mb-8 space-y-3">
              <div className="flex justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase">{lang === 'en' ? 'Consumer Name' : 'उपभोक्ता नाम'}</span>
                <span className="font-bold text-slate-700">Rahul Deshmukh</span>
              </div>
              <div className="flex justify-between">
                 <span className="text-xs font-bold text-slate-400 uppercase">{lang === 'en' ? 'Registered Mobile' : 'पंजीकृत मोबाइल'}</span>
                 <span className="font-bold text-slate-700">+91 98****1234</span>
              </div>
              <div className="flex justify-between">
                 <span className="text-xs font-bold text-slate-400 uppercase">{lang === 'en' ? 'Price (14.2kg)' : 'कीमत (14.2kg)'}</span>
                 <span className="font-bold text-slate-700">₹ 903.00</span>
              </div>
            </div>

            {/* Book Button */}
            <button 
              onClick={handleBook}
              disabled={bookingStatus === 'booking'}
              className="mt-auto w-full py-5 rounded-xl bg-[#1A365D] text-white font-bold text-lg shadow-lg active:scale-95 disabled:opacity-70 transition-all flex items-center justify-center gap-3"
            >
              {bookingStatus === 'booking' ? (
                <>
                  <Loader size={20} className="animate-spin" />
                  <span className="animate-pulse">{lang === 'en' ? 'Processing Booking...' : 'बुकिंग प्रक्रिया जारी...'}</span>
                </>
              ) : (
                <>
                  <Package size={20} /> {lang === 'en' ? 'Book Now (Pay on Delivery)' : 'अभी बुक करें (डिलीवरी पर भुगतान)'}
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookCylinder;
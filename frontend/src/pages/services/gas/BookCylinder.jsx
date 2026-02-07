import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, Flame, Truck, CheckCircle, Package, Loader } from 'lucide-react';
import { gasAPI } from '../../../services/api';

const BookCylinder = () => {
  const navigate = useNavigate();
  const [provider, setProvider] = useState('indane');
  const [bookingStatus, setBookingStatus] = useState('idle'); // idle, booking, success
  const [refId, setRefId] = useState('');

  const handleBook = async () => {
    setBookingStatus('booking');
    
    try {
      // Call the API to book cylinder
      const response = await gasAPI.bookCylinder({
        provider: provider,
        cylinderType: '14.2kg',
      });
      
      if (response.data.success) {
        setRefId(response.data.referenceId || 'GAS-2026-8899');
        setBookingStatus('success');
        
        // Auto-redirect after animation
        setTimeout(() => {
          navigate('/dashboard');
        }, 4000);
      } else {
        alert(response.data.message || 'Failed to book cylinder');
        setBookingStatus('idle');
      }
    } catch (err) {
      console.error('Error booking cylinder:', err);
      alert(err.response?.data?.message || 'Failed to book cylinder. Please try again.');
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
           <h1 className="text-2xl font-black text-slate-800">Book Cylinder Refill</h1>
           <p className="text-slate-500 text-sm">Select provider & confirm</p>
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
              <h2 className="text-3xl font-black text-green-800 mb-2">Booking Confirmed!</h2>
              <p className="text-green-700 font-medium">Your cylinder will be delivered in 2 days.</p>
              <div className="mt-6 bg-white px-4 py-2 rounded-full border border-green-200 text-xs font-mono text-green-600">
                Ref ID: {refId}
              </div>
            </motion.div>
          </div>
        ) : (
          /* FORM STATE */
          <div className="p-8 h-full flex flex-col">
            
            {/* Provider Selection */}
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Select Provider</h3>
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
                <span className="text-xs font-bold text-slate-400 uppercase">Consumer Name</span>
                <span className="font-bold text-slate-700">Rahul Deshmukh</span>
              </div>
              <div className="flex justify-between">
                 <span className="text-xs font-bold text-slate-400 uppercase">Registered Mobile</span>
                 <span className="font-bold text-slate-700">+91 98****1234</span>
              </div>
              <div className="flex justify-between">
                 <span className="text-xs font-bold text-slate-400 uppercase">Price (14.2kg)</span>
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
                  <span className="animate-pulse">Processing Booking...</span>
                </>
              ) : (
                <>
                  <Package size={20} /> Book Now (Pay on Delivery)
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
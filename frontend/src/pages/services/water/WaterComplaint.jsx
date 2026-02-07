import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, MapPin, Navigation, CheckCircle, Loader2 } from 'lucide-react';
import { waterAPI } from '../../../services/api';

const WaterComplaint = () => {
  const navigate = useNavigate();
  const [pinned, setPinned] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [location, setLocation] = useState('');

  // Simulate pinning a location
  const handleMapClick = () => {
    if (!submitted && !submitting) {
      setPinned(true);
      setLocation('Sector 4, Pune');
    }
  };

  const handleSubmit = async () => {
    if (!pinned) return;
    
    setSubmitting(true);
    
    try {
      // Call the API to report no water supply
      const response = await waterAPI.reportNoSupply({
        location: location,
        description: 'No water supply complaint',
      });
      
      if (response.data.success) {
        setSubmitted(true);
        setTimeout(() => {
          navigate('/dashboard');
        }, 2500);
      } else {
        alert(response.data.message || 'Failed to submit complaint');
        setSubmitting(false);
      }
    } catch (err) {
      console.error('Error submitting complaint:', err);
      alert(err.response?.data?.message || 'Failed to submit complaint. Please try again.');
      setSubmitting(false);
    }
  };

  return (
    <div className="h-full flex flex-col relative z-10">
      
      {/* Header */}
      <div className="flex items-center gap-4 mb-4 px-2">
        <button 
          onClick={() => navigate(-1)}
          className="p-3 bg-white rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50"
        >
          <ChevronLeft size={24} />
        </button>
        <div>
           <h1 className="text-2xl font-black text-slate-800">No Water Supply</h1>
           <p className="text-slate-500 text-sm">Tap your location on the map</p>
        </div>
      </div>

      {/* MAP AREA (Simulated) */}
      <div className="flex-1 bg-slate-100 rounded-3xl relative overflow-hidden shadow-inner border border-slate-200 group cursor-crosshair" onClick={handleMapClick}>
        
        {/* Fake Map Background Image */}
        <img 
          src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=1200&q=80" 
          alt="Map" 
          className="w-full h-full object-cover opacity-60 grayscale group-hover:grayscale-0 transition-all duration-500"
        />

        {/* Floating Instruction */}
        {!pinned && !submitted && !submitting && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="bg-white/90 backdrop-blur-md px-6 py-3 rounded-full shadow-xl flex items-center gap-2 animate-bounce">
              <Navigation size={20} className="text-blue-600" />
              <span className="font-bold text-slate-700">Tap to Pin Location</span>
            </div>
          </div>
        )}

        {/* The Pin (Appears on Click) */}
        {pinned && !submitted && (
          <motion.div 
            initial={{ scale: 0, y: -50 }}
            animate={{ scale: 1, y: 0 }}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
          >
            <MapPin size={48} className="text-red-600 drop-shadow-2xl fill-red-100" />
          </motion.div>
        )}

        {/* Success Overlay */}
        {submitted && (
          <div className="absolute inset-0 bg-emerald-500/90 flex flex-col items-center justify-center text-white z-20">
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="bg-white text-emerald-600 rounded-full p-6 mb-4 shadow-2xl"
            >
              <CheckCircle size={64} />
            </motion.div>
            <h2 className="text-3xl font-black">Complaint Registered</h2>
            <p className="font-medium opacity-90 mt-2">Team Dispatched to {location}</p>
          </div>
        )}

      </div>

      {/* Bottom Action Bar */}
      <div className="mt-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${pinned ? 'bg-green-500' : 'bg-slate-300'}`}></div>
          <span className="text-sm font-bold text-slate-600">
            {pinned ? `Location Selected: ${location}` : "Waiting for selection..."}
          </span>
        </div>

        <button 
          onClick={handleSubmit}
          disabled={!pinned || submitted || submitting}
          className="px-8 py-3 bg-[#1A365D] text-white font-bold rounded-xl shadow-lg active:scale-95 disabled:opacity-50 disabled:active:scale-100 transition-all flex items-center gap-2"
        >
          {submitting ? (
            <>
              <Loader2 size={20} className="animate-spin" />
              Submitting...
            </>
          ) : (
            'Confirm & Report'
          )}
        </button>
      </div>

    </div>
  );
};

export default WaterComplaint;
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Search, Receipt, Loader } from 'lucide-react';
import { electricityAPI } from '../../../services/api';

const BillPayment = () => {
  const navigate = useNavigate();
  const [consumerId, setConsumerId] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Keypad numbers
  const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0', '⌫'];

  const handleKeyPress = (key) => {
    setError('');
    if (key === 'C') {
      setConsumerId('');
    } else if (key === '⌫') {
      setConsumerId(prev => prev.slice(0, -1));
    } else {
      if (consumerId.length < 12) {
        setConsumerId(prev => prev + key);
      }
    }
  };

  const handleFetchBill = async () => {
    // Validation: Require at least 5 digits
    if (consumerId.length < 5) {
      setError('Enter at least 5 digits');
      return;
    }
    
    setLoading(true);
    
    try {
      // Call the API to fetch bill
      const response = await electricityAPI.payBill(consumerId, 0); // 0 for fetching bill only
      if (response.data.success) {
        // Store bill details in session/context and navigate
        sessionStorage.setItem('billData', JSON.stringify(response.data.data));
        navigate('/service/electricity/summary'); 
      } else {
        setError(response.data.message || 'Bill not found');
      }
    } catch (err) {
      console.error('Error fetching bill:', err);
      setError(err.response?.data?.message || 'Failed to fetch bill. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col relative z-10">
      
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button 
          onClick={() => navigate('/service/electricity')}
          className="p-3 bg-white rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 active:scale-95"
        >
          <ChevronLeft size={24} />
        </button>
        <div>
          <h1 className="text-2xl font-black text-slate-800">Pay Electricity Bill</h1>
          <p className="text-slate-500 text-sm font-medium">Enter your 12-digit Consumer Number</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8 h-full pb-10">
        
        {/* LEFT: Input Display Area */}
        <div className="flex-1 flex flex-col justify-center">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 text-center space-y-6">
            <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center mx-auto text-orange-600">
              <Receipt size={32} />
            </div>
            
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
                Consumer Number / ग्राहक क्रमांक
              </label>
              
              {/* The Display Box */}
              <div className={`h-20 flex items-center justify-center text-4xl font-mono font-bold tracking-widest border-b-2 ${error ? 'border-red-500 text-red-600' : 'border-slate-200 text-slate-800'}`}>
                {consumerId || <span className="text-slate-200">___________</span>}
              </div>
              
              {error && <p className="text-red-500 text-xs font-bold mt-2 animate-pulse">{error}</p>}
            </div>

            <button 
              onClick={handleFetchBill}
              disabled={loading}
              className="w-full py-5 rounded-xl bg-[#1A365D] text-white font-bold text-lg shadow-lg active:scale-95 disabled:opacity-70 transition-all flex items-center justify-center gap-3"
            >
              {loading ? (
                <>
                  <Loader size={20} className="animate-spin" />
                  <span className="animate-pulse">Fetching Details...</span>
                </>
              ) : (
                <>
                  <Search size={20} /> Fetch Bill
                </>
              )}
            </button>
          </div>
        </div>

        {/* RIGHT: Numeric Keypad */}
        <div className="flex-1 max-w-md mx-auto w-full">
          <div className="grid grid-cols-3 gap-4 h-full max-h-[400px]">
            {keys.map((key) => (
              <button
                key={key}
                onClick={() => handleKeyPress(key)}
                disabled={loading}
                className={`
                  rounded-2xl text-2xl font-bold shadow-sm border border-slate-200 active:scale-90 transition-all disabled:opacity-50
                  ${key === 'C' ? 'text-red-500 bg-white' : 'bg-white text-slate-700 hover:bg-slate-50'}
                `}
              >
                {key}
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default BillPayment;
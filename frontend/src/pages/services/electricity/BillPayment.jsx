import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Search, Receipt, Loader, AlertCircle, IndianRupee } from 'lucide-react';
import { electricityAPI } from '../../../services/api';
import { useLanguage } from '../../../context/LanguageContext';

const BillPayment = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [consumerId, setConsumerId] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [pendingBills, setPendingBills] = useState([]);
  const [connections, setConnections] = useState([]);
  const [loadingBills, setLoadingBills] = useState(true);

  // Fetch pending bills on mount
  useEffect(() => {
    const fetchPendingBills = async () => {
      try {
        const response = await electricityAPI.getPendingBills();
        setPendingBills(response.data.pendingBills || []);
        setConnections(response.data.connections || []);
        // Auto-fill consumer number if user has one connection
        if (response.data.connections?.length === 1) {
          setConsumerId(response.data.connections[0]);
        }
      } catch (err) {
        console.error('Failed to fetch pending bills:', err);
      } finally {
        setLoadingBills(false);
      }
    };
    fetchPendingBills();
  }, []);

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
      // Check if there's a pending bill amount to use
      const pendingAmount = pendingBills.length > 0 ? pendingBills[0].amountPaise : undefined;
      
      // Call the API to initiate payment
      const response = await electricityAPI.payBill(consumerId, pendingAmount);
      
      // If we get a client secret, payment intent was created successfully
      if (response.data.clientSecret) {
        const actualAmount = response.data.amountPaise || pendingAmount || 0;
        // Store payment data and navigate to summary
        sessionStorage.setItem('billData', JSON.stringify({
          consumerId,
          clientSecret: response.data.clientSecret,
          paymentIntentId: response.data.paymentIntentId,
          paymentId: response.data.paymentId,
          amountPaise: actualAmount,
          amountRupees: (actualAmount / 100).toFixed(2),
        }));
        navigate('/service/electricity/summary'); 
      } else {
        setError('Unable to fetch bill details');
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
          <h1 className="text-2xl font-black text-slate-800">{t('payElectricityBill')}</h1>
          <p className="text-slate-500 text-sm font-medium">{t('enterConsumerNumber')}</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8 h-full pb-10">
        
        {/* LEFT: Input Display Area */}
        <div className="flex-1 flex flex-col justify-center gap-6">

          {/* PENDING BILLS ALERT */}
          {!loadingBills && pendingBills.length > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <AlertCircle size={18} className="text-amber-600" />
                <h3 className="text-sm font-black text-amber-800 uppercase tracking-wider">{t('pendingBills')}</h3>
              </div>
              <div className="space-y-2">
                {pendingBills.map((bill) => (
                  <div key={bill.id} className="flex items-center justify-between bg-white rounded-xl p-4 border border-amber-100">
                    <div>
                      <p className="text-xs text-slate-400 font-bold uppercase">{t('consumerNo')}</p>
                      <p className="font-mono font-bold text-slate-700">{connections[0] || '—'}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-slate-400 font-bold uppercase">{t('amountDue')}</p>
                      <p className="text-2xl font-black text-red-600 flex items-center gap-1">
                        <IndianRupee size={18} /> {bill.amountRupees}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {loadingBills && (
            <div className="flex items-center justify-center gap-2 text-slate-400 py-4">
              <Loader size={16} className="animate-spin" />
              <span className="text-sm font-medium">{t('checkingBills')}</span>
            </div>
          )}

          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 text-center space-y-6">
            <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center mx-auto text-orange-600">
              <Receipt size={32} />
            </div>
            
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
                {t('consumerNumberLabel')}
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
                  <span className="animate-pulse">{t('fetchingDetails')}</span>
                </>
              ) : (
                <>
                  <Search size={20} /> {t('fetchBill')}
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
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Search, Receipt, Loader, AlertCircle, IndianRupee } from 'lucide-react';
import { waterAPI } from '../../../services/api';
import { useLanguage } from '../../../context/LanguageContext';

const WaterBillPayment = () => {
  const navigate = useNavigate();
  const { lang } = useLanguage();
  const [consumerId, setConsumerId] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [pendingBills, setPendingBills] = useState([]);
  const [connections, setConnections] = useState([]);
  const [loadingBills, setLoadingBills] = useState(true);

  useEffect(() => {
    const fetchPendingBills = async () => {
      try {
        const response = await waterAPI.getPendingBills();
        setPendingBills(response.data.pendingBills || []);
        setConnections(response.data.connections || []);
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

  const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0', '⌫'];

  const handleKeyPress = (key) => {
    setError('');
    if (key === 'C') setConsumerId('');
    else if (key === '⌫') setConsumerId(prev => prev.slice(0, -1));
    else if (consumerId.length < 12) setConsumerId(prev => prev + key);
  };

  const handleFetchBill = async () => {
    if (consumerId.length < 5) { setError(lang === 'en' ? 'Enter at least 5 digits' : 'कम से कम 5 अंक दर्ज करें'); return; }
    setLoading(true);
    try {
      const pendingAmount = pendingBills.find(b => b.consumerNumber === consumerId)?.amountPaise;
      const response = await waterAPI.payBill(consumerId, pendingAmount);
      if (response.data.clientSecret) {
        const actualAmount = response.data.amountPaise || pendingAmount || 0;
        sessionStorage.setItem('billData', JSON.stringify({
          consumerId,
          clientSecret: response.data.clientSecret,
          paymentIntentId: response.data.paymentIntentId,
          paymentId: response.data.paymentId,
          amountPaise: actualAmount,
          amountRupees: (actualAmount / 100).toFixed(2),
          service: 'Water Bill',
        }));
        navigate('/service/electricity/summary');
      } else {
        setError(lang === 'en' ? 'Unable to fetch bill details' : 'बिल विवरण प्राप्त करने में असमर्थ');
      }
    } catch (err) {
      setError(err.response?.data?.message || (lang === 'en' ? 'Failed to fetch bill. Please try again.' : 'बिल प्राप्त करने में विफल। पुनः प्रयास करें।'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate('/service/water')} className="p-3 bg-white rounded-xl border-2 border-slate-200 text-slate-400 hover:border-[#1e3a8a] hover:text-[#1e3a8a] transition-all active:scale-95">
          <ChevronLeft size={24} />
        </button>
        <div>
          <h1 className="text-2xl font-black text-slate-800 uppercase tracking-tight">{lang === 'en' ? 'Pay Water Bill' : 'पानी का बिल भरें'}</h1>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{lang === 'en' ? 'Enter consumer number' : 'उपभोक्ता नंबर दर्ज करें'}</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8 h-full pb-10">
        <div className="flex-1 flex flex-col justify-center gap-6">
          {!loadingBills && pendingBills.length > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <AlertCircle size={18} className="text-amber-600" />
                <h3 className="text-sm font-black text-amber-800 uppercase tracking-wider">{lang === 'en' ? 'Pending Bills' : 'लंबित बिल'}</h3>
              </div>
              <div className="space-y-2">
                {pendingBills.map((bill) => (
                  <button key={bill.id} onClick={() => setConsumerId(bill.consumerNumber || connections[0] || '')}
                    className="w-full flex items-center justify-between bg-white rounded-xl p-4 border border-amber-100 hover:border-amber-300 transition-all active:scale-[0.98]">
                    <div className="text-left">
                      <p className="text-xs text-slate-400 font-bold uppercase">{lang === 'en' ? 'Consumer No.' : 'उपभोक्ता क्र.'}</p>
                      <p className="font-mono font-bold text-slate-700">{bill.consumerNumber || connections[0] || '—'}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-slate-400 font-bold uppercase">{lang === 'en' ? 'Amount Due' : 'बकाया राशि'}</p>
                      <p className="text-2xl font-black text-red-600 flex items-center gap-1"><IndianRupee size={18} /> {bill.amountRupees}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {loadingBills && (
            <div className="flex items-center justify-center gap-2 text-slate-400 py-4">
              <Loader size={16} className="animate-spin" />
              <span className="text-sm font-medium">{lang === 'en' ? 'Checking bills...' : 'बिल जांच रहे हैं...'}</span>
            </div>
          )}

          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 text-center space-y-6">
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto text-blue-600">
              <Receipt size={32} />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">{lang === 'en' ? 'Consumer Number' : 'उपभोक्ता नंबर'}</label>
              <div className={`h-20 flex items-center justify-center text-4xl font-mono font-bold tracking-widest border-b-2 ${error ? 'border-red-500 text-red-600' : 'border-slate-200 text-slate-800'}`}>
                {consumerId || <span className="text-slate-200">___________</span>}
              </div>
              {error && <p className="text-red-500 text-xs font-bold mt-2 animate-pulse">{error}</p>}
            </div>
            <button onClick={handleFetchBill} disabled={loading}
              className="w-full py-5 rounded-xl bg-[#1e3a8a] text-white font-bold text-lg shadow-lg active:scale-95 disabled:opacity-70 transition-all flex items-center justify-center gap-3">
              {loading ? (<><Loader size={20} className="animate-spin" /><span className="animate-pulse">{lang === 'en' ? 'Fetching...' : 'प्राप्त हो रहा...'}</span></>) : (<><Search size={20} /> {lang === 'en' ? 'Fetch Bill' : 'बिल प्राप्त करें'}</>)}
            </button>
          </div>
        </div>

        <div className="flex-1 max-w-md mx-auto w-full">
          <div className="grid grid-cols-3 gap-4 h-full max-h-[400px]">
            {keys.map((key) => (
              <button key={key} onClick={() => handleKeyPress(key)} disabled={loading}
                className={`rounded-2xl text-2xl font-bold shadow-sm border border-slate-200 active:scale-90 transition-all disabled:opacity-50 ${key === 'C' ? 'text-red-500 bg-white' : 'bg-white text-slate-700 hover:bg-slate-50'}`}>
                {key}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WaterBillPayment;

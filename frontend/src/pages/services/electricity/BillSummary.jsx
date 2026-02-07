import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, CreditCard, Download, ShieldCheck } from 'lucide-react';

const BillSummary = () => {
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(false);

  // Dummy Bill Data (In real app, this comes from the backend)
  const billDetails = {
    consumerName: "Rahul S. Deshmukh",
    consumerId: "1234 5678 9012",
    billDate: "05 Feb 2026",
    dueDate: "20 Feb 2026",
    units: "145 Units",
    amount: "1,450.00",
    address: "Flat 402, Sai Heights, Kothrud, Pune - 411038"
  };

  const handlePay = () => {
    setProcessing(true);
    // Simulate Payment Processing
    setTimeout(() => {
      navigate('/service/electricity/success'); // We will build this next
    }, 2000);
  };

  return (
    <div className="h-full flex flex-col relative z-10 max-w-2xl mx-auto">
      
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button 
          onClick={() => navigate(-1)}
          className="p-2 bg-white rounded-full border border-slate-200 text-slate-500 hover:bg-slate-50"
        >
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-xl font-black text-[#1A365D]">Bill Summary</h1>
      </div>

      {/* THE DIGITAL BILL CARD */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-200"
      >
        {/* Top Strip */}
        <div className="bg-[#1A365D] p-6 text-white flex justify-between items-center">
          <div>
            <h2 className="text-lg font-bold">MSEDCL Electricity Bill</h2>
            <p className="text-blue-200 text-xs">Maharashtra State Electricity Distribution Co. Ltd.</p>
          </div>
          <div className="text-right">
            <p className="text-xs font-medium opacity-70">Bill Month</p>
            <p className="font-bold">Jan 2026</p>
          </div>
        </div>

        {/* Bill Details */}
        <div className="p-8 space-y-6">
          
          <div className="flex justify-between border-b border-slate-100 pb-4">
            <div>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Consumer Name</p>
              <p className="text-lg font-bold text-slate-800">{billDetails.consumerName}</p>
            </div>
            <div className="text-right">
               <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Consumer No.</p>
               <p className="text-lg font-mono font-bold text-slate-600">{billDetails.consumerId}</p>
            </div>
          </div>

          <div>
             <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Billing Address</p>
             <p className="text-sm font-medium text-slate-600">{billDetails.address}</p>
          </div>

          <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl">
             <div>
                <p className="text-xs text-slate-400 font-bold">Bill Date</p>
                <p className="font-semibold text-slate-700">{billDetails.billDate}</p>
             </div>
             <div>
                <p className="text-xs text-slate-400 font-bold">Due Date</p>
                <p className="font-semibold text-red-600">{billDetails.dueDate}</p>
             </div>
             <div>
                <p className="text-xs text-slate-400 font-bold">Units Consumed</p>
                <p className="font-semibold text-slate-700">{billDetails.units}</p>
             </div>
             <div>
                <p className="text-xs text-slate-400 font-bold">Tariff</p>
                <p className="font-semibold text-slate-700">LT-1 Residential</p>
             </div>
          </div>

          {/* Total Amount */}
          <div className="flex justify-between items-center pt-2">
            <span className="text-xl font-bold text-slate-800">Total Payable</span>
            <span className="text-4xl font-black text-[#1A365D]">₹ {billDetails.amount}</span>
          </div>

        </div>

        {/* Action Button */}
        <div className="p-6 bg-slate-50 border-t border-slate-100">
          <button 
            onClick={handlePay}
            disabled={processing}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-green-600 to-emerald-700 text-white font-bold text-lg shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            {processing ? (
              <span className="animate-pulse">Processing Payment...</span>
            ) : (
              <>
                <CreditCard size={20} /> Pay Bill Now
              </>
            )}
          </button>
          <p className="text-center text-xs text-slate-400 mt-3 flex items-center justify-center gap-1">
            <ShieldCheck size={12} /> Secure Transaction via Stripe/UPI
          </p>
        </div>

      </motion.div>
    </div>
  );
};

export default BillSummary;
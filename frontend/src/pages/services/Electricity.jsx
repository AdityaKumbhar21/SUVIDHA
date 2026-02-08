import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Receipt, PlusCircle, AlertTriangle, ZapOff, Settings2, ChevronLeft, ArrowRight } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const Electricity = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const services = [
    { id: 'pay-bill', name: t('billPayment'), sub: t('billPaymentSub'), icon: <Receipt size={28} />, path: '/service/electricity/pay' },
    { id: 'outage', name: t('powerOutage'), sub: t('powerOutageSub'), icon: <ZapOff size={28} />, path: '/service/electricity/outage' },
    { id: 'new-conn', name: t('newConnection'), sub: t('newConnectionSub'), icon: <PlusCircle size={28} />, path: '/service/electricity/new' },
    { id: 'meter-issue', name: t('meterIssue'), sub: t('meterIssueSub'), icon: <AlertTriangle size={28} />, path: '/service/electricity/meter' },
    { id: 'load-change', name: t('loadChange'), sub: t('loadChangeSub'), icon: <Settings2 size={28} />, path: '/service/electricity/load' },
  ];

  return (
    <div className="h-full flex flex-col">
      
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => navigate('/dashboard')} className="p-3 bg-white rounded-xl border-2 border-slate-200 text-slate-400 hover:border-[#1e3a8a] hover:text-[#1e3a8a] transition-all active:scale-95">
          <ChevronLeft size={22} />
        </button>
        <div>
          <h1 className="text-2xl font-black text-slate-800 uppercase tracking-tight">{t('electricityServices')}</h1>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t('deptOfPower')}</p>
        </div>
      </div>

      {/* Service List */}
      <div className="space-y-3 flex-1">
        {services.map((service, idx) => (
          <motion.button
            key={service.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.05 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate(service.path)}
            className="w-full flex items-center gap-4 bg-white p-5 rounded-2xl border-2 border-slate-200 hover:border-[#1e3a8a] hover:shadow-md transition-all text-left active:bg-slate-50"
          >
            <div className="w-14 h-14 rounded-xl bg-[#1e3a8a] flex items-center justify-center text-white shrink-0">
              {service.icon}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-black text-slate-800 truncate">{service.name}</h3>
              <p className="text-xs font-medium text-slate-400 truncate">{service.sub}</p>
            </div>
            <ArrowRight size={18} className="text-slate-300 shrink-0" />
          </motion.button>
        ))}
      </div>

      {/* Emergency Info */}
      <div className="mt-4 bg-red-50 border-2 border-red-200 p-4 rounded-2xl flex items-center gap-3">
        <AlertTriangle size={20} className="text-red-500 shrink-0" />
        <div>
          <p className="text-xs font-black text-red-700 uppercase">{t('emergencyHelpline')}</p>
          <p className="text-[10px] font-bold text-red-500">{t('emergencyHelplineDesc')}</p>
        </div>
      </div>
    </div>
  );
};

export default Electricity;
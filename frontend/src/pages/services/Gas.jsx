import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Flame, Truck, ShieldAlert, FileText, ChevronLeft, ArrowRight } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const Gas = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const services = [
    { id: 'book-cylinder', name: t('bookCylinder'), sub: t('bookCylinderSub'), icon: <Truck size={28} />, path: '/service/gas/book' },
    { id: 'report-leak', name: t('reportGasLeak'), sub: t('reportGasLeakSub'), icon: <ShieldAlert size={28} />, path: '/service/gas/leakage', emergency: true },
    { id: 'new-connection', name: t('gasNewConnection'), sub: t('gasNewConnectionSub'), icon: <Flame size={28} />, path: '/service/gas/new' },
    { id: 'cylinder-issue', name: t('cylinderIssue'), sub: t('cylinderIssueSub'), icon: <FileText size={28} />, path: '/service/gas/cylinder-issue' },
  ];

  return (
    <div className="h-full flex flex-col">
      
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => navigate('/dashboard')} className="p-3 bg-white rounded-xl border-2 border-slate-200 text-slate-400 hover:border-[#1e3a8a] hover:text-[#1e3a8a] transition-all active:scale-95">
          <ChevronLeft size={22} />
        </button>
        <div>
          <h1 className="text-2xl font-black text-slate-800 uppercase tracking-tight">{t('gasServicesTitle')}</h1>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t('gasDept')}</p>
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
            className={`w-full flex items-center gap-4 bg-white p-5 rounded-2xl border-2 transition-all text-left active:bg-slate-50 ${
              service.emergency ? 'border-red-300 hover:border-red-500' : 'border-slate-200 hover:border-[#1e3a8a] hover:shadow-md'
            }`}
          >
            <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-white shrink-0 ${
              service.emergency ? 'bg-red-600' : 'bg-[#1e3a8a]'
            }`}>
              {service.icon}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className={`text-base font-black truncate ${service.emergency ? 'text-red-700' : 'text-slate-800'}`}>{service.name}</h3>
              <p className="text-xs font-medium text-slate-400 truncate">{service.sub}</p>
            </div>
            <ArrowRight size={18} className={`shrink-0 ${service.emergency ? 'text-red-400' : 'text-slate-300'}`} />
          </motion.button>
        ))}
      </div>

      {/* Emergency Warning */}
      <div className="mt-4 bg-red-600 border-2 border-red-700 p-4 rounded-2xl flex items-center gap-3 text-white">
        <ShieldAlert size={22} className="shrink-0 animate-pulse" />
        <div>
          <p className="text-xs font-black uppercase">{t('gasEmergencyHelpline')}</p>
          <p className="text-[10px] font-bold text-red-200">{t('gasEmergencyWarning')}</p>
        </div>
      </div>
    </div>
  );
};

export default Gas;

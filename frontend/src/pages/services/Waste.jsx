import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trash2, AlertTriangle, Package, ChevronLeft, ArrowRight } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const Waste = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const services = [
    { id: 'missed-pickup', name: t('missedPickup'), sub: t('missedPickupSub'), icon: <Trash2 size={28} />, path: '/service/waste/missed-pickup' },
    { id: 'overflow', name: t('overflowingBin'), sub: t('overflowingBinSub'), icon: <AlertTriangle size={28} />, path: '/service/waste/overflow' },
    { id: 'bulk-pickup', name: t('bulkPickup'), sub: t('bulkPickupSub'), icon: <Package size={28} />, path: '/service/waste/bulk-pickup' },
  ];

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => navigate('/dashboard')} className="p-3 bg-white rounded-xl border-2 border-slate-200 text-slate-400 hover:border-[#1e3a8a] hover:text-[#1e3a8a] transition-all active:scale-95">
          <ChevronLeft size={22} />
        </button>
        <div>
          <h1 className="text-2xl font-black text-slate-800 uppercase tracking-tight">{t('wasteManagement')}</h1>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t('wasteDept')}</p>
        </div>
      </div>

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
    </div>
  );
};

export default Waste;
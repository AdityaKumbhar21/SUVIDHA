import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Zap, Droplet, Flame, Trash2, Building2, Star } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const Dashboard = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const services = [
    { id: 'electricity', name: t('electricity'), sub: t('electricitySub'), icon: <Zap size={40} strokeWidth={2.5} />, color: '#f59e0b', path: '/service/electricity' },
    { id: 'water', name: t('water'), sub: t('waterSub'), icon: <Droplet size={40} strokeWidth={2.5} />, color: '#3b82f6', path: '/service/water' },
    { id: 'gas', name: t('gas'), sub: t('gasSub'), icon: <Flame size={40} strokeWidth={2.5} />, color: '#f97316', path: '/service/gas' },
    { id: 'waste', name: t('waste'), sub: t('wasteSub'), icon: <Trash2 size={40} strokeWidth={2.5} />, color: '#10b981', path: '/service/waste' },
    { id: 'municipal', name: t('municipal'), sub: t('municipalSub'), icon: <Building2 size={40} strokeWidth={2.5} />, color: '#8b5cf6', path: '/service/municipal' },
    { id: 'feedback', name: t('feedback') || 'Feedback', sub: t('feedbackSub') || 'Rate our services', icon: <Star size={40} strokeWidth={2.5} />, color: '#ec4899', path: '/service/feedback' },
  ];

  return (
    <div className="h-full flex flex-col justify-center">
      
      {/* Kiosk Welcome */}
      <div className="text-center mb-8">
        <p className="text-[10px] font-black text-[#1e3a8a] tracking-[0.3em] uppercase mb-2">
          {t('officialPortal') || 'Official Portal'}
        </p>
        <h1 className="text-3xl font-black text-slate-800 uppercase tracking-tight leading-tight">
          {t('heroTitle1') || 'Select a'}{' '}
          <span className="text-[#1e3a8a]">{t('heroTitle2') || 'Service'}</span>
        </h1>
      </div>

      {/* Service Grid — Big Touch Targets */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-3xl mx-auto w-full">
        {services.map((service, idx) => (
          <motion.button
            key={service.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.06 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(service.path)}
            className="bg-white rounded-2xl border-2 border-slate-200 p-6 flex flex-col items-center justify-center gap-3 shadow-sm hover:shadow-lg hover:border-[#1e3a8a] transition-all active:bg-slate-50 min-h-[140px]"
          >
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-md" style={{ backgroundColor: service.color }}>
              {service.icon}
            </div>
            <div className="text-center">
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-tight">{service.name}</h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">{service.sub}</p>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Bottom Info */}
      <div className="text-center mt-8">
        <p className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">
          {t('kioskInitiatives') || 'Touch any service to begin'}
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
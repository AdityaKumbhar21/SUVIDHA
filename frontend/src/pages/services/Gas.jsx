import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Flame, Truck, ShieldAlert, FileText, 
  ChevronLeft, ArrowRight, Gauge, AlertCircle
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const Gas = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const gasServices = [
    {
      id: 'book-cylinder',
      name: t('bookCylinder'),
      sub: t('bookCylinderSub'),
      icon: <Truck size={32} />,
      gradient: 'from-orange-500 to-red-600',
      path: '/service/gas/book'
    },
    {
      id: 'report-leak',
      name: t('reportGasLeak'),
      sub: t('reportGasLeakSub'),
      icon: <ShieldAlert size={32} />,
      gradient: 'from-red-600 to-rose-700',
      path: '/service/gas/leakage' 
    },
    {
      id: 'new-connection',
      name: t('gasNewConnection'),
      sub: t('gasNewConnectionSub'),
      icon: <Flame size={32} />,
      gradient: 'from-amber-500 to-orange-600',
      path: '/service/gas/new'
    },
    {
      id: 'check-subsidy',
      name: t('checkSubsidy'),
      sub: t('checkSubsidySub'),
      icon: <FileText size={32} />,
      gradient: 'from-orange-400 to-pink-600',
      path: '/service/gas/subsidy'
    }
  ];

  return (
    <div className="h-full flex flex-col relative z-10">
      
      {/* Header */}
      <div className="mb-10 flex items-center gap-6">
        <button 
          onClick={() => navigate('/dashboard')}
          className="p-3 bg-white rounded-2xl shadow-sm border border-slate-200 text-slate-400 hover:text-orange-600 hover:border-orange-600 transition-all active:scale-90"
        >
          <ChevronLeft size={24} />
        </button>
        <div>
          <h1 className="text-3xl font-black text-[#1A365D] tracking-tight uppercase">
            {t('gasServicesTitle')}
          </h1>
          <p className="text-slate-500 font-medium">
            {t('gasDept')}
          </p>
        </div>
      </div>

      {/* Service Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-12">
        {gasServices.map((service, idx) => (
          <motion.button
            key={service.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            onClick={() => navigate(service.path)}
            className={`group flex items-center gap-6 bg-white p-6 rounded-3xl border transition-all text-left ${
              service.id === 'report-leak' 
                ? 'border-red-100 shadow-red-50 hover:shadow-red-100 hover:border-red-200' 
                : 'border-slate-100 shadow-sm hover:shadow-xl hover:border-orange-100'
            }`}
          >
            {/* Icon Box */}
            <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${service.gradient} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform relative`}>
              {service.icon}
              {service.id === 'report-leak' && (
                <span className="absolute -top-2 -right-2 bg-white text-red-600 p-1 rounded-full border-2 border-red-600 animate-bounce">
                  <AlertCircle size={14} />
                </span>
              )}
            </div>

            {/* Text */}
            <div className="flex-1">
              <h3 className={`text-xl font-black transition-colors ${
                service.id === 'report-leak' ? 'text-red-700' : 'text-slate-800 group-hover:text-orange-600'
              }`}>
                {service.name}
              </h3>
              <p className="text-slate-500 font-medium text-sm mt-0.5">
                {service.sub}
              </p>
            </div>

            {/* Arrow */}
            <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
              service.id === 'report-leak' 
                ? 'bg-red-50 text-red-600 group-hover:bg-red-600 group-hover:text-white' 
                : 'bg-slate-50 text-slate-300 group-hover:bg-orange-50 group-hover:text-orange-600'
            }`}>
              <ArrowRight size={20} />
            </div>
          </motion.button>
        ))}
      </div>

      {/* Safety Footer (Standardized for Govt. Kiosks) [cite: 29, 30] */}
      <div className="mt-auto bg-red-600 border border-red-700 p-6 rounded-3xl flex items-center gap-6 text-white shadow-2xl">
        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-red-600 shadow-inner">
          <ShieldAlert size={32} className="animate-pulse" />
        </div>
        <div>
          <h4 className="font-black text-xl uppercase tracking-tighter">
            {t('gasEmergencyHelpline')}
          </h4>
          <p className="text-red-100 text-sm font-bold opacity-90">
            {t('gasEmergencyWarning')}
          </p>
        </div>
      </div>

    </div>
  );
};

export default Gas;
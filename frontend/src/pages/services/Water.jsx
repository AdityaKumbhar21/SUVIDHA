import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Droplet, Wrench, FileText, 
  AlertCircle, ChevronLeft, ArrowRight 
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const Water = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const waterServices = [
    {
      id: 'pay-bill',
      name: t('payWaterBill'),
      sub: t('payWaterBillSub'),
      icon: <FileText size={32} />,
      gradient: 'from-blue-500 to-cyan-600',
      path: '/service/water/pay'
    },
    {
      id: 'no-supply',
      name: t('noWaterSupply'),
      sub: t('noWaterSupplySub'),
      icon: <Droplet size={32} />,
      gradient: 'from-sky-500 to-indigo-600',
      path: '/service/water/complaint'
    },
    {
      id: 'leakage',
      name: t('reportLeakage'),
      sub: t('reportLeakageSub'),
      icon: <Wrench size={32} />,
      gradient: 'from-teal-500 to-emerald-600',
      path: '/service/water/leakage'
    },
    {
      id: 'quality',
      name: t('waterQuality'),
      sub: t('waterQualitySub'),
      icon: <AlertCircle size={32} />,
      gradient: 'from-indigo-500 to-purple-600',
      path: '/service/water/quality'
    }
  ];

  return (
    <div className="h-full flex flex-col relative z-10">
      
      {/* Header */}
      <div className="mb-10 flex items-center gap-6">
        <button 
          onClick={() => navigate('/dashboard')}
          className="p-3 bg-white rounded-2xl shadow-sm border border-slate-200 text-slate-400 hover:text-blue-800 hover:border-blue-800 transition-all active:scale-90"
        >
          <ChevronLeft size={24} />
        </button>
        <div>
          <h1 className="text-3xl font-black text-[#1A365D] tracking-tight uppercase">
            {t('waterServices')}
          </h1>
          <p className="text-slate-500 font-medium">{t('waterDept')}</p>
        </div>
      </div>

      {/* Service Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-12">
        {waterServices.map((service, idx) => (
          <motion.button
            key={service.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            onClick={() => navigate(service.path)}
            className="group flex items-center gap-6 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:border-blue-100 transition-all text-left"
          >
            <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${service.gradient} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform`}>
              {service.icon}
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-black text-slate-800 group-hover:text-blue-600 transition-colors">
                {service.name}
              </h3>
              <p className="text-slate-500 font-medium text-sm mt-0.5">
                {service.sub}
              </p>
            </div>
            <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-blue-50 group-hover:text-blue-600 transition-all">
              <ArrowRight size={20} />
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default Water;
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trash2, Truck, Calendar, Recycle, ChevronLeft, ArrowRight } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const Waste = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const wasteServices = [
    {
      id: 'track-van',
      name: t('trackVan'),
      sub: t('trackVanSub'),
      icon: <Truck size={32} />,
      gradient: 'from-emerald-500 to-green-600',
      path: '/service/waste/track'
    },
    {
      id: 'schedule-pickup',
      name: t('schedulePickup'),
      sub: t('schedulePickupSub'),
      icon: <Calendar size={32} />,
      gradient: 'from-green-600 to-teal-600',
      path: '/service/waste/schedule'
    },
    {
      id: 'recycle',
      name: t('recyclingCenters'),
      sub: t('recyclingCentersSub'),
      icon: <Recycle size={32} />,
      gradient: 'from-lime-500 to-green-600',
      path: '/service/waste/recycle'
    }
  ];

  return (
    <div className="h-full flex flex-col">
      <div className="mb-10 flex items-center gap-6">
        <button onClick={() => navigate('/dashboard')} className="p-3 bg-white rounded-2xl shadow-sm border border-slate-200 hover:bg-slate-50">
          <ChevronLeft size={24} />
        </button>
        <div>
          <h1 className="text-3xl font-black text-[#1A365D] uppercase">{t('wasteManagement')}</h1>
          <p className="text-slate-500 font-medium">{t('wasteDept')}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {wasteServices.map((service, idx) => (
          <motion.button
            key={service.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            onClick={() => navigate(service.path)}
            className="group flex items-center gap-6 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl text-left"
          >
            <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${service.gradient} flex items-center justify-center text-white shadow-lg`}>
              {service.icon}
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-800">{service.name}</h3>
              <p className="text-slate-500 text-sm">{service.sub}</p>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default Waste;
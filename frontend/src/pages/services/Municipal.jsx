import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Building2, FileText, Landmark, Award, 
  ChevronLeft, ArrowRight, ShieldCheck 
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const Municipal = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const muniServices = [
    {
      id: 'property-tax',
      name: t('propertyTax'),
      sub: t('propertyTaxSub'),
      icon: <Landmark size={30} />,
      gradient: 'from-purple-500 to-indigo-600',
      path: '/service/municipal/tax'
    },
    {
      id: 'certificates',
      name: t('certificates'),
      sub: t('certificatesSub'),
      icon: <Award size={30} />,
      gradient: 'from-indigo-500 to-blue-600',
      path: '/service/municipal/certificate'
    },
    {
      id: 'trade-license',
      name: t('tradeLicense'),
      sub: t('tradeLicenseSub'),
      icon: <FileText size={30} />,
      gradient: 'from-violet-500 to-purple-700',
      path: '/service/municipal/trade'
    }
  ];

  return (
    <div className="h-full flex flex-col p-8 relative z-10 bg-white min-h-screen">
      
      {/* Header with Navigation */}
      <div className="mb-10 flex items-center gap-6">
        <button 
          onClick={() => navigate('/dashboard')}
          className="p-3 bg-white rounded-2xl shadow-sm border border-slate-200 text-slate-400 hover:text-purple-600 hover:border-purple-600 transition-all active:scale-95"
        >
          <ChevronLeft size={24} />
        </button>
        <div>
          <h1 className="text-3xl font-black text-[#1e3a8a] uppercase tracking-tight">
            {t('municipalServices')}
          </h1>
          <p className="text-slate-500 font-medium">{t('municipalDept')}</p>
        </div>
      </div>

      {/* Municipal Service Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {muniServices.map((service, idx) => (
          <motion.button
            key={service.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            onClick={() => navigate(service.path)}
            className="group bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-2xl hover:border-purple-100 transition-all text-left flex flex-col h-full"
          >
            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${service.gradient} flex items-center justify-center text-white mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
              {service.icon}
            </div>
            
            <div className="flex-1">
              <h3 className="text-xl font-black text-slate-800 group-hover:text-purple-600 transition-colors">
                {service.name}
              </h3>
              <p className="text-slate-400 text-xs font-bold mt-2 uppercase tracking-widest leading-relaxed">
                {service.sub}
              </p>
            </div>
            
            <div className="mt-8 pt-6 border-t border-slate-50 flex items-center justify-between text-[#1e3a8a] font-black text-[10px] uppercase tracking-[0.2em]">
               <span>{t('proceed')}</span>
               <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-purple-50 group-hover:text-purple-600 transition-all">
                 <ArrowRight size={18} />
               </div>
            </div>
          </motion.button>
        ))}
      </div>

      {/* AI Compliance Section */}
      <div className="mt-auto pt-12">
        <div className="p-6 bg-purple-50 rounded-3xl border border-purple-100 flex items-center gap-6">
          <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-purple-600 shadow-sm">
            <ShieldCheck size={32} />
          </div>
          <div>
            <h4 className="text-purple-900 font-black text-sm uppercase tracking-tight">
              {t('docAIVerification')}
            </h4>
            <p className="text-purple-700 text-xs font-bold opacity-80 mt-1">
              {t('docAIVerificationDesc')}
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Municipal;
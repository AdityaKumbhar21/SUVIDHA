import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Receipt, PlusCircle, AlertTriangle, 
  ZapOff, Settings2, ChevronLeft, ArrowRight 
} from 'lucide-react';

const Electricity = () => {
  const navigate = useNavigate();

  const electricityServices = [
    {
      id: 'pay-bill',
      name: 'Bill Payment',
      sub: 'Pay your monthly bill instantly',
      icon: <Receipt size={32} />,
      gradient: 'from-amber-400 to-orange-600',
      path: '/service/electricity/pay'
    },
    {
      id: 'outage',
      name: 'Power Outage',
      sub: 'Report a blackout in your area',
      icon: <ZapOff size={32} />,
      gradient: 'from-red-500 to-rose-700',
      path: '/service/electricity/outage'
    },
    {
      id: 'new-conn',
      name: 'New Connection',
      sub: 'Apply for a new domestic meter',
      icon: <PlusCircle size={32} />,
      gradient: 'from-blue-500 to-indigo-700',
      path: '/service/electricity/new'
    },
    {
      id: 'meter-issue',
      name: 'Meter Issue',
      sub: 'Report faulty or fast meters',
      icon: <AlertTriangle size={32} />,
      gradient: 'from-orange-500 to-red-600',
      path: '/service/electricity/meter'
    },
    {
      id: 'load-change',
      name: 'Load Change',
      sub: 'Increase or decrease sanctioned load',
      icon: <Settings2 size={32} />,
      gradient: 'from-slate-600 to-slate-800',
      path: '/service/electricity/load'
    }
  ];

  return (
    <div className="h-full flex flex-col relative z-10">
      
      {/* Navigation & Header */}
      <div className="mb-10 flex items-center gap-6">
        <button 
          onClick={() => navigate('/dashboard')}
          className="p-3 bg-white rounded-2xl shadow-sm border border-slate-200 text-slate-400 hover:text-[#1A365D] hover:border-[#1A365D] transition-all active:scale-90"
        >
          <ChevronLeft size={24} />
        </button>
        <div>
          <h1 className="text-3xl font-black text-[#1A365D] tracking-tight uppercase">Electricity Services</h1>
          <p className="text-slate-500 font-medium">Department of Power • Govt. of India</p>
        </div>
      </div>

      {/* Service List (Horizontal/Vertical Mix) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-12">
        {electricityServices.map((service, idx) => (
          <motion.button
            key={service.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            onClick={() => navigate(service.path)}
            className="group flex items-center gap-6 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:border-blue-100 transition-all text-left"
          >
            {/* Service Icon */}
            <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${service.gradient} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform`}>
              {service.icon}
            </div>

            {/* Service Text */}
            <div className="flex-1">
              <h3 className="text-xl font-black text-slate-800 group-hover:text-blue-700 transition-colors">
                {service.name}
              </h3>
              <p className="text-slate-500 font-medium text-sm mt-0.5">
                {service.sub}
              </p>
            </div>

            {/* Action Arrow */}
            <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-blue-50 group-hover:text-blue-600 transition-all">
              <ArrowRight size={20} />
            </div>
          </motion.button>
        ))}
      </div>

      {/* Quick Info Box */}
      <div className="mt-auto bg-blue-50/50 border border-blue-100 p-6 rounded-3xl flex items-center gap-4">
        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
          <AlertTriangle size={24} />
        </div>
        <div>
          <h4 className="font-bold text-blue-900 text-sm">Emergency Helpline: 1912</h4>
          <p className="text-blue-700 text-xs font-medium">Available 24/7 for electrical emergencies and safety reports.</p>
        </div>
      </div>

    </div>
  );
};

export default Electricity;
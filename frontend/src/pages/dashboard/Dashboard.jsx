import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Zap, Droplet, Flame, Trash2, Building2 } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const Dashboard = () => {
  const navigate = useNavigate();
  const { lang } = useLanguage();

  // Unified Services Configuration to match Master Feature List [cite: 27, 36]
  const services = [
    {
      id: 'electricity',
      name: lang === 'en' ? 'Electricity' : 'बिजली',
      sub: lang === 'en' ? 'Bill Pay & Outage Reports' : 'बिल भुगतान एवं कटौती रिपोर्ट',
      icon: <Zap size={36} />,
      color: 'bg-[#10b981]',
      hoverBorder: 'hover:border-green-300',
      path: '/service/electricity'
    },
    {
      id: 'water',
      name: lang === 'en' ? 'Water Supply' : 'पानी आपूर्ति',
      sub: lang === 'en' ? 'Supply Status & Billing' : 'आपूर्ति स्थिति एवं बिलिंग',
      icon: <Droplet size={36} />,
      color: 'bg-[#1e3a8a]',
      hoverBorder: 'hover:border-blue-400',
      path: '/service/water'
    },
    {
      id: 'gas',
      name: lang === 'en' ? 'Gas Services' : 'गैस सेवाएं',
      sub: lang === 'en' ? 'Book Cylinder & Safety' : 'सिलेंडर बुकिंग एवं सुरक्षा',
      icon: <Flame size={36} />,
      color: 'bg-[#f97316]',
      hoverBorder: 'hover:border-orange-300',
      path: '/service/gas'
    },
    {
      id: 'waste',
      name: lang === 'en' ? 'Waste Mgmt.' : 'कचरा प्रबंधन',
      sub: lang === 'en' ? 'Track Van & Pickup' : 'वाहन ट्रैकिंग एवं पिकअप',
      icon: <Trash2 size={36} />,
      color: 'bg-[#0d9488]',
      hoverBorder: 'hover:border-teal-300',
      path: '/service/waste'
    },
    // ADDED: Municipal Services Module [cite: 41, 213]
    {
      id: 'municipal',
      name: lang === 'en' ? 'Municipal' : 'नगर निगम',
      sub: lang === 'en' ? 'Tax & Certificates' : 'कर एवं प्रमाण पत्र',
      icon: <Building2 size={36} />,
      color: 'bg-[#7c3aed]', // Purple theme for Municipal
      hoverBorder: 'hover:border-purple-300',
      path: '/service/municipal'
    }
  ];

  return (
    <div className="flex flex-col">
      
      {/* --- HERO SECTION --- */}
      <section className="bg-[#f8fafc] pt-16 pb-24 px-6 border-b border-slate-200 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-orange-500 via-white to-green-600"></div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left: Headline & Search */}
          <div className="text-left z-10">
            <div className="inline-block bg-blue-100 text-[#1e3a8a] text-[10px] font-black px-3 py-1 rounded-md uppercase tracking-wider mb-6">
              Official Citizen Portal
            </div>
            <h1 className="text-5xl md:text-6xl font-black text-[#1e3a8a] leading-[1.1] mb-6 uppercase tracking-tighter">
              One Nation, One Portal <br />
              <span className="text-orange-600">for Citizen Services</span>
            </h1>
            
            {/* Search Bar - Intent Detection Ready [cite: 265, 266] */}
            <div className="flex items-center bg-white p-2 rounded-xl shadow-xl border border-slate-200 max-w-lg group focus-within:ring-4 focus-within:ring-blue-50 transition-all mb-10">
               <div className="pl-4 text-slate-400">
                 <Search size={22} />
               </div>
               <input 
                 type="text" 
                 placeholder={lang === 'en' ? "Search 'Pay Bill', 'Trade License'..." : "शोधा 'बिल भरा', 'व्यापार परवाना'..."}
                 className="flex-1 p-4 text-slate-700 font-medium outline-none text-base"
               />
               <button className="bg-[#1e3a8a] text-white px-8 py-3 rounded-lg font-bold text-sm tracking-wide">
                 {lang === 'en' ? 'SEARCH' : 'शोधा'}
               </button>
            </div>
          </div>

          {/* Right: Department Grid [cite: 36] */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {services.map((service) => (
              <motion.button
                key={service.id}
                whileHover={{ y: -5, scale: 1.02 }}
                onClick={() => navigate(service.path)}
                className={`${service.color} p-6 rounded-2xl shadow-lg text-white text-left flex flex-col justify-between h-48 group border-2 border-transparent ${service.hoverBorder} transition-all`}
              >
                <div className="mb-4 text-white/90">
                  {service.icon}
                </div>
                <div>
                  <h3 className="text-xl font-black mb-1 uppercase tracking-tight">{service.name}</h3>
                  <p className="text-white/80 text-[10px] font-bold uppercase tracking-widest leading-tight">
                    {service.sub}
                  </p>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* --- INITIATIVES SECTION [cite: 391, 403] --- */}
      <section className="bg-white py-20 px-6">
         <div className="max-w-6xl mx-auto text-center">
            <p className="text-orange-600 font-bold tracking-[0.2em] uppercase text-[10px] mb-3">Kiosk Initiatives</p>
            <h2 className="text-3xl font-black text-[#1e3a8a] mb-16 uppercase">Digital Governance Standard</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
               {[
                 { num: '1', title: 'Transparent Process', desc: 'Track every step of your application in real-time with zero manual intervention.' },
                 { num: '2', title: 'Direct Benefit Transfer', desc: 'Subsidies are transferred directly to your Aadhaar-linked bank account.' },
                 { num: '3', title: '24/7 Citizen Support', desc: 'AI assistant Suvidha is available around the clock to resolve your queries.' }
               ].map((item, idx) => (
                 <div key={idx} className="p-8 border border-slate-100 rounded-3xl shadow-sm hover:shadow-xl transition-all bg-slate-50 text-left">
                    <div className="w-12 h-12 bg-[#1e3a8a] rounded-xl flex items-center justify-center mb-6 text-white font-black text-lg shadow-lg">{item.num}</div>
                    <h4 className="font-black text-lg text-slate-800 mb-3 uppercase tracking-tight">{item.title}</h4>
                    <p className="text-sm text-slate-500 leading-relaxed font-medium">{item.desc}</p>
                 </div>
               ))}
            </div>
         </div>
      </section>

    </div>
  );
};

export default Dashboard;
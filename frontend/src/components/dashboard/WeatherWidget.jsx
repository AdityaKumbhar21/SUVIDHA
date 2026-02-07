import React from 'react';
import { CloudSun, Wind, MapPin } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const WeatherWidget = () => {
  const { t } = useLanguage();

  return (
    <div className="bg-gradient-to-br from-sky-400 to-blue-600 rounded-3xl p-6 text-white shadow-lg flex flex-col justify-between relative overflow-hidden h-full min-h-[160px]">
      
      {/* Background Decor */}
      <CloudSun className="absolute -right-4 -top-4 text-white opacity-20" size={120} />
      
      {/* Top Row: Location */}
      <div className="flex justify-between items-start z-10">
        <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold">
          <MapPin size={12} /> Pune, MH
        </div>
        <div className="text-right">
          <p className="text-xs font-medium opacity-90">{new Date().toDateString()}</p>
        </div>
      </div>

      {/* Middle: Temp */}
      <div className="z-10 mt-2">
        <h2 className="text-4xl font-black">28°C</h2>
        <p className="text-sm font-medium opacity-90">Partly Cloudy</p>
      </div>

      {/* Bottom: AQI */}
      <div className="flex items-center gap-3 mt-4 z-10">
        <div className="flex items-center gap-2 bg-emerald-500/30 backdrop-blur-md px-3 py-1.5 rounded-xl border border-emerald-400/50">
          <Wind size={16} />
          <span className="text-sm font-bold">AQI 45 (Good)</span>
        </div>
      </div>

    </div>
  );
};

export default WeatherWidget;
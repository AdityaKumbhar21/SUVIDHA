import React, { useState, useEffect, useCallback } from 'react';
import { MapPin, Loader2, ChevronDown, Search } from 'lucide-react';

// ─── Indian States ───
const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
  'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Chandigarh', 'Puducherry',
];

const HINDI_STATES = {
  'Andhra Pradesh': 'आंध्र प्रदेश', 'Arunachal Pradesh': 'अरुणाचल प्रदेश',
  'Assam': 'असम', 'Bihar': 'बिहार', 'Chhattisgarh': 'छत्तीसगढ़',
  'Goa': 'गोवा', 'Gujarat': 'गुजरात', 'Haryana': 'हरियाणा',
  'Himachal Pradesh': 'हिमाचल प्रदेश', 'Jharkhand': 'झारखंड',
  'Karnataka': 'कर्नाटक', 'Kerala': 'केरल', 'Madhya Pradesh': 'मध्य प्रदेश',
  'Maharashtra': 'महाराष्ट्र', 'Manipur': 'मणिपुर', 'Meghalaya': 'मेघालय',
  'Mizoram': 'मिज़ोरम', 'Nagaland': 'नागालैंड', 'Odisha': 'ओडिशा',
  'Punjab': 'पंजाब', 'Rajasthan': 'राजस्थान', 'Sikkim': 'सिक्किम',
  'Tamil Nadu': 'तमिलनाडु', 'Telangana': 'तेलंगाना', 'Tripura': 'त्रिपुरा',
  'Uttar Pradesh': 'उत्तर प्रदेश', 'Uttarakhand': 'उत्तराखंड',
  'West Bengal': 'पश्चिम बंगाल', 'Delhi': 'दिल्ली',
  'Jammu and Kashmir': 'जम्मू और कश्मीर', 'Ladakh': 'लद्दाख',
  'Chandigarh': 'चंडीगढ़', 'Puducherry': 'पुडुचेरी',
};

// ─── Common Pincodes by state (fallback when API is unavailable) ───
const COMMON_PINCODES = {
  'Maharashtra': ['411001', '411002', '411004', '411014', '411033', '411044', '400001', '400050', '400070', '421301', '440001'],
  'Delhi': ['110001', '110002', '110003', '110011', '110020', '110025', '110044', '110051', '110085', '110092'],
  'Karnataka': ['560001', '560002', '560004', '560008', '560011', '560034', '560037', '560043', '560050', '560100'],
  'Tamil Nadu': ['600001', '600002', '600006', '600010', '600017', '600020', '600028', '600040', '641001', '625001'],
  'Gujarat': ['380001', '380006', '380009', '380013', '380015', '395001', '390001', '360001', '370001', '388001'],
  'Uttar Pradesh': ['201301', '201001', '208001', '226001', '221001', '250001', '282001', '211001', '273001', '243001'],
  'Rajasthan': ['302001', '302004', '302012', '302015', '302017', '302020', '313001', '342001', '324001', '305001'],
  'West Bengal': ['700001', '700006', '700012', '700019', '700020', '700029', '700032', '700064', '700091', '711101'],
  'Telangana': ['500001', '500003', '500008', '500012', '500016', '500018', '500020', '500028', '500032', '500034'],
  'Kerala': ['682001', '682016', '682018', '682024', '695001', '673001', '680001', '686001', '678001', '670001'],
};

const selectClass =
  'w-full bg-slate-50 border-2 border-slate-200 rounded-xl p-3.5 text-base font-medium focus:border-[#1e3a8a] focus:outline-none disabled:opacity-50 appearance-none cursor-pointer';

const LocationPicker = ({ value, onChange, disabled = false, lang = 'en', label, mode = 'full' }) => {
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [pincode, setPincode] = useState('');
  const [cities, setCities] = useState([]);
  const [pincodes, setPincodes] = useState([]);
  const [loadingCities, setLoadingCities] = useState(false);
  const [loadingPincodes, setLoadingPincodes] = useState(false);

  const txt = useCallback((en, hi) => (lang === 'en' ? en : hi), [lang]);

  // Build the combined location string whenever selections change
  useEffect(() => {
    const parts = [];
    if (city) parts.push(city);
    if (state) parts.push(state);
    if (pincode) parts.push(pincode);
    const loc = parts.join(', ');
    if (loc && loc !== value) {
      onChange(loc);
    }
  }, [state, city, pincode]);

  // Fetch cities when state changes (using India Post API by common pincodes)
  useEffect(() => {
    if (!state) {
      setCities([]);
      setCity('');
      setPincodes([]);
      setPincode('');
      return;
    }

    const fetchCities = async () => {
      setLoadingCities(true);
      setCities([]);
      setCity('');
      setPincodes([]);
      setPincode('');

      try {
        // Use common pincodes for the state to discover cities via India Post API
        const statePincodes = COMMON_PINCODES[state] || [];
        const citySet = new Set();

        if (statePincodes.length > 0) {
          // Fetch a few pincodes to get city/district names
          const fetches = statePincodes.slice(0, 4).map(async (pin) => {
            try {
              const res = await fetch(`https://api.postalpincode.in/pincode/${pin}`);
              const data = await res.json();
              if (data[0]?.Status === 'Success') {
                data[0].PostOffice.forEach((po) => {
                  if (po.District) citySet.add(po.District);
                });
              }
            } catch { /* ignore individual failures */ }
          });
          await Promise.all(fetches);
        }

        // If we didn't get results from the API, use state capital as fallback
        if (citySet.size === 0) {
          const fallbackCities = {
            'Maharashtra': ['Pune', 'Mumbai', 'Nagpur', 'Nashik', 'Aurangabad', 'Thane', 'Solapur', 'Kolhapur'],
            'Delhi': ['New Delhi', 'Central Delhi', 'South Delhi', 'North Delhi', 'East Delhi', 'West Delhi'],
            'Karnataka': ['Bengaluru', 'Mysuru', 'Hubli', 'Mangalore', 'Belgaum', 'Davangere'],
            'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai', 'Salem', 'Tiruchirappalli', 'Tirunelveli'],
            'Gujarat': ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Bhavnagar', 'Jamnagar'],
            'Uttar Pradesh': ['Lucknow', 'Noida', 'Ghaziabad', 'Agra', 'Varanasi', 'Kanpur', 'Prayagraj'],
            'Rajasthan': ['Jaipur', 'Jodhpur', 'Udaipur', 'Kota', 'Ajmer', 'Bikaner'],
            'West Bengal': ['Kolkata', 'Howrah', 'Durgapur', 'Siliguri', 'Asansol'],
            'Telangana': ['Hyderabad', 'Warangal', 'Nizamabad', 'Karimnagar', 'Khammam'],
            'Kerala': ['Kochi', 'Thiruvananthapuram', 'Kozhikode', 'Thrissur', 'Kollam'],
            'Haryana': ['Gurugram', 'Faridabad', 'Karnal', 'Ambala', 'Hisar', 'Panipat'],
            'Punjab': ['Chandigarh', 'Ludhiana', 'Amritsar', 'Jalandhar', 'Patiala', 'Bathinda'],
            'Bihar': ['Patna', 'Gaya', 'Bhagalpur', 'Muzaffarpur', 'Darbhanga'],
            'Madhya Pradesh': ['Bhopal', 'Indore', 'Jabalpur', 'Gwalior', 'Ujjain'],
            'Chhattisgarh': ['Raipur', 'Bhilai', 'Bilaspur', 'Korba', 'Durg'],
            'Jharkhand': ['Ranchi', 'Jamshedpur', 'Dhanbad', 'Bokaro', 'Hazaribagh'],
            'Odisha': ['Bhubaneswar', 'Cuttack', 'Rourkela', 'Berhampur', 'Sambalpur'],
            'Assam': ['Guwahati', 'Silchar', 'Dibrugarh', 'Jorhat', 'Nagaon'],
            'Goa': ['Panaji', 'Margao', 'Vasco da Gama', 'Mapusa', 'Ponda'],
            'Himachal Pradesh': ['Shimla', 'Manali', 'Dharamshala', 'Solan', 'Mandi'],
            'Uttarakhand': ['Dehradun', 'Haridwar', 'Rishikesh', 'Nainital', 'Haldwani'],
          };
          (fallbackCities[state] || [state]).forEach((c) => citySet.add(c));
        }

        setCities([...citySet].sort());
      } catch {
        setCities([state]);
      } finally {
        setLoadingCities(false);
      }
    };

    fetchCities();
  }, [state]);

  // Fetch pincodes when city changes
  useEffect(() => {
    if (!city || !state) {
      setPincodes([]);
      setPincode('');
      return;
    }

    const fetchPincodes = async () => {
      setLoadingPincodes(true);
      setPincodes([]);
      setPincode('');

      try {
        const res = await fetch(`https://api.postalpincode.in/postoffice/${encodeURIComponent(city)}`);
        const data = await res.json();

        if (data[0]?.Status === 'Success') {
          const pinSet = new Set();
          data[0].PostOffice.forEach((po) => {
            if (po.State === state || !state) {
              pinSet.add(po.Pincode);
            }
          });
          // If filtering by state returns nothing, include all
          if (pinSet.size === 0) {
            data[0].PostOffice.forEach((po) => pinSet.add(po.Pincode));
          }
          setPincodes([...pinSet].sort());
        } else {
          // Fallback — try searching by district name
          const statePins = COMMON_PINCODES[state] || [];
          const pinSet = new Set();
          for (const pin of statePins.slice(0, 3)) {
            try {
              const r = await fetch(`https://api.postalpincode.in/pincode/${pin}`);
              const d = await r.json();
              if (d[0]?.Status === 'Success') {
                d[0].PostOffice.forEach((po) => {
                  if (po.District === city) pinSet.add(po.Pincode);
                });
              }
            } catch { /* ignore */ }
          }
          setPincodes([...pinSet].sort());
        }
      } catch {
        // Use state common pincodes as fallback
        setPincodes(COMMON_PINCODES[state]?.slice(0, 5) || []);
      } finally {
        setLoadingPincodes(false);
      }
    };

    fetchPincodes();
  }, [city, state]);

  return (
    <div className="space-y-3">
      {label && (
        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
          <MapPin size={14} />
          {label}
        </label>
      )}

      {/* State Dropdown */}
      <div className="relative">
        <select
          value={state}
          onChange={(e) => setState(e.target.value)}
          disabled={disabled}
          className={selectClass}
        >
          <option value="">{txt('-- Select State --', '-- राज्य चुनें --')}</option>
          {INDIAN_STATES.map((s) => (
            <option key={s} value={s}>
              {lang === 'hi' && HINDI_STATES[s] ? `${HINDI_STATES[s]} (${s})` : s}
            </option>
          ))}
        </select>
        <ChevronDown size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
      </div>

      {/* City Dropdown */}
      <div className="relative">
        {loadingCities && (
          <Loader2 size={16} className="absolute right-9 top-1/2 -translate-y-1/2 text-blue-500 animate-spin" />
        )}
        <select
          value={city}
          onChange={(e) => setCity(e.target.value)}
          disabled={disabled || !state || loadingCities}
          className={selectClass}
        >
          <option value="">
            {loadingCities
              ? txt('Loading cities...', 'शहर लोड हो रहे हैं...')
              : txt('-- Select City / District --', '-- शहर / जिला चुनें --')}
          </option>
          {cities.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <ChevronDown size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
      </div>

      {/* Pincode Dropdown */}
      <div className="relative">
        {loadingPincodes && (
          <Loader2 size={16} className="absolute right-9 top-1/2 -translate-y-1/2 text-blue-500 animate-spin" />
        )}
        <select
          value={pincode}
          onChange={(e) => setPincode(e.target.value)}
          disabled={disabled || !city || loadingPincodes}
          className={selectClass}
        >
          <option value="">
            {loadingPincodes
              ? txt('Loading pincodes...', 'पिनकोड लोड हो रहे हैं...')
              : txt('-- Select Pincode --', '-- पिनकोड चुनें --')}
          </option>
          {pincodes.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
        <ChevronDown size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
      </div>

      {/* Show combined value */}
      {value && (
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 flex items-center gap-2">
          <MapPin size={14} className="text-blue-500 flex-shrink-0" />
          <span className="text-sm font-medium text-blue-700 truncate">{value}</span>
        </div>
      )}
    </div>
  );
};

export default LocationPicker;

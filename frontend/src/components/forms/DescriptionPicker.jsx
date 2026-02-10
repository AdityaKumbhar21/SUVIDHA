import React from 'react';
import { ChevronDown } from 'lucide-react';

const selectClass =
  'w-full bg-slate-50 border-2 border-slate-200 rounded-xl p-3.5 text-base font-medium focus:border-[#1e3a8a] focus:outline-none disabled:opacity-50 appearance-none cursor-pointer';

/**
 * Reusable kiosk-friendly dropdown for descriptions/reasons.
 *
 * @param {object}   props
 * @param {string}   props.value        Current selected value
 * @param {function} props.onChange      Called with the new value
 * @param {Array}    props.options       [{ value: string, label: string }]
 * @param {string}   [props.placeholder] Placeholder text for the dropdown
 * @param {string}   [props.label]       Label text above dropdown
 * @param {boolean}  [props.disabled]    Whether the dropdown is disabled
 * @param {React.ReactNode} [props.icon] Optional icon to show in label
 */
const DescriptionPicker = ({ value, onChange, options = [], placeholder, label, disabled = false, icon: Icon }) => {
  return (
    <div>
      {label && (
        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
          {Icon && <Icon size={14} />}
          {label}
        </label>
      )}
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className={selectClass}
        >
          <option value="">{placeholder || '-- Select --'}</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
      </div>
    </div>
  );
};

export default DescriptionPicker;

import React from 'react';
import { useLms } from '../context/LmsContext';
import { Sun, Moon } from 'lucide-react';

interface ThemeToggleProps {
  className?: string;
  showTooltip?: boolean;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ className = '', showTooltip = true }) => {
  const { theme, toggleTheme } = useLms();
  const isDark = theme === 'dark';

  return (
    <div className={`relative inline-flex items-center group ${className}`}>
      <button
        id="theme-toggle-btn"
        type="button"
        onClick={toggleTheme}
        aria-label={isDark ? 'Gunakan tema terang' : 'Gunakan tema gelap'}
        title={isDark ? 'Gunakan tema terang' : 'Gunakan tema gelap'}
        className={`relative inline-flex items-center h-9 w-[68px] rounded-full transition-all duration-300 p-1 cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500/40 select-none ${
          isDark
            ? 'bg-[#0b1d19] border border-[#1b3b33] shadow-inner'
            : 'bg-[#dcfce7] border border-[#bbf7d0] shadow-sm'
        }`}
      >
        {/* Sliding Indicator Knob */}
        <span
          className={`absolute flex items-center justify-center w-7 h-7 rounded-full shadow-md transition-all duration-300 transform ${
            isDark
              ? 'translate-x-[32px] bg-[#142d27] border border-[#234e44] text-[#34d399]'
              : 'translate-x-0 bg-white text-emerald-600 border border-emerald-100'
          }`}
        >
          {isDark ? (
            <Moon className="w-3.5 h-3.5 fill-[#34d399]/20" />
          ) : (
            <Sun className="w-4 h-4 fill-amber-400/20 text-amber-500" />
          )}
        </span>

        {/* Background Icons */}
        <div className="w-full flex items-center justify-between px-1.5 pointer-events-none">
          <Sun
            className={`w-3.5 h-3.5 transition-opacity duration-200 ${
              isDark ? 'opacity-30 text-emerald-300' : 'opacity-0'
            }`}
          />
          <Moon
            className={`w-3.5 h-3.5 transition-opacity duration-200 ${
              isDark ? 'opacity-0' : 'opacity-30 text-emerald-700'
            }`}
          />
        </div>
      </button>

      {/* Tooltip Badge on hover matching the screenshot */}
      {showTooltip && (
        <div className="pointer-events-none absolute -bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-50">
          <div className="px-2.5 py-1 text-[11px] font-semibold rounded-md shadow-lg whitespace-nowrap bg-slate-900 text-white dark:bg-slate-800 dark:text-slate-100 border border-slate-700">
            {isDark ? 'Gunakan tema terang' : 'Gunakan tema gelap'}
          </div>
        </div>
      )}
    </div>
  );
};

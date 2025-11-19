import React from 'react';

type ToggleSwitchProps = {
  label: string;
  enabled: boolean;
  onChange: (enabled: boolean) => void;
  labelClassName?: string;
  disabled?: boolean;
};

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ label, enabled, onChange, labelClassName = 'text-white/90', disabled = false }) => {
  return (
    <div className={`flex items-center ${disabled ? 'opacity-50' : ''}`}>
      <button
        type="button"
        className={`${
          enabled ? 'bg-ivolve-bright-green' : 'bg-gray-400'
        } relative inline-flex h-6 w-11 flex-shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
        role="switch"
        aria-checked={enabled}
        onClick={() => !disabled && onChange(!enabled)}
        disabled={disabled}
      >
        <span
          aria-hidden="true"
          className={`${
            enabled ? 'translate-x-5' : 'translate-x-0'
          } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
        />
      </button>
      <span className={`ml-3 text-sm font-medium ${labelClassName}`}>{label}</span>
    </div>
  );
};

export default ToggleSwitch;
import { useRef, useEffect } from 'react';

const PRESET_COLORS = [
  '#233667',
  '#4a90d9',
  '#10b981',
  '#f59e0b',
  '#ef4444',
  '#8b5cf6',
  '#ec4899',
  '#6b7280',
];

function ColorPicker({ color, onChange, onClose }) {
  const ref = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        onClose();
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  return (
    <div
      ref={ref}
      className="absolute z-20 top-full mt-2 start-0 rounded-xl border border-gray-200 bg-white p-3 shadow-lg"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="grid grid-cols-4 gap-2">
        {PRESET_COLORS.map((preset) => (
          <button
            key={preset}
            type="button"
            aria-label={`צבע ${preset}`}
            onClick={() => {
              onChange(preset);
              onClose();
            }}
            className={`h-7 w-7 rounded-full border-2 transition-transform hover:scale-110 ${
              color === preset ? 'border-gray-900' : 'border-transparent'
            }`}
            style={{ backgroundColor: preset }}
          />
        ))}
      </div>
      <label className="mt-3 flex items-center gap-2 text-xs text-gray-500">
        צבע מותאם
        <input
          type="color"
          value={color}
          onChange={(e) => onChange(e.target.value)}
          className="h-7 w-10 cursor-pointer rounded border border-gray-200"
        />
      </label>
    </div>
  );
}

export default ColorPicker;

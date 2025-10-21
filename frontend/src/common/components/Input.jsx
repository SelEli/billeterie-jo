// src/common/components/Input.jsx
export default function Input({ type, label, placeholder, value, onChange, options }) {
  return (
    <div>
      <label className="block font-medium mb-1">{label}</label>
      {type === 'select' ? (
        <select
          className="border rounded p-2 w-full"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        >
          {options.map(opt => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          placeholder={placeholder}
          className="border rounded p-2 w-full"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </div>
  );
}

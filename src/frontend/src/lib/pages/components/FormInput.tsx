import React from 'react';

interface FormInputProps {
  label: string;
  id: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}

const FormInput: React.FC<FormInputProps> = ({ label, id, value, onChange, required = false }) => {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">{label}</label>
      <input
        type="text"
        id={id}
        value={value}
        onChange={onChange}
        required={required}
        className="mt-1 text-sm py-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 p-1 border"
      />
    </div>
  );
};

export default FormInput;

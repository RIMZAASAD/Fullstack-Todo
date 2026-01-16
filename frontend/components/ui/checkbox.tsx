import React from 'react';

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

const Checkbox: React.FC<CheckboxProps> = ({ checked, onCheckedChange, ...props }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onCheckedChange) {
      onCheckedChange(e.target.checked);
    }
    if (props.onChange) {
      props.onChange(e);
    }
  };

  return (
    <input
      type="checkbox"
      checked={checked}
      onChange={handleChange}
      className="h-4 w-4 text-indigo-500 focus:ring-indigo-500 border-slate-600 rounded bg-slate-700"
      {...props}
    />
  );
};

export { Checkbox };
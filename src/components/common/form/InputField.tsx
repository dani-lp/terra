import React from 'react';

import { 
  FieldWrapper, 
  type FieldWrapperPassThroughProps 
} from './FieldWrapper';

type InputFieldProps = FieldWrapperPassThroughProps & React.InputHTMLAttributes<HTMLInputElement> & {
  className?: string;
  wrapperClassName?: string;
  children?: React.ReactNode;
};

export const InputField = (
  {
    id,
    type = 'text',
    label,
    name,
    value,
    required = false,
    disabled = false,
    onChange,
    className,
    wrapperClassName,
    placeholder = '',
    autoFocus = false,
    children
  }: InputFieldProps) => {
  return (
    <FieldWrapper label={label} className={wrapperClassName}>
      <input
        id={id}
        type={type}
        className={`my-0 mb-2 block h-9 w-full rounded-lg border border-neutral-300 py-2 px-3 text-sm placeholder:text-neutral-400 hover:border-neutral-400 focus:border-neutral-300 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-1 ${className}`}
        name={name}
        value={value}
        required={required}
        disabled={disabled}
        placeholder={placeholder}
        onChange={onChange}
        autoFocus={autoFocus}
      />
      {children}
    </FieldWrapper>
  );
};

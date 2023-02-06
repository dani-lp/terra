import React from 'react';

import { 
  FieldWrapper, 
  type FieldWrapperPassThroughProps 
} from './FieldWrapper';

type TextareaFieldProps = FieldWrapperPassThroughProps & React.InputHTMLAttributes<HTMLTextAreaElement> & {
  className?: string;
  wrapperClassName?: string;
  rows?: number;
  children?: React.ReactNode;
};

export const TextareaField = (
  {
    id,
    label,
    name,
    value,
    rows = 5,
    required = false,
    disabled = false,
    onChange,
    className,
    wrapperClassName,
    placeholder = '',
    autoFocus = false,
    children
  }: TextareaFieldProps) => {
  return (
    <FieldWrapper label={label} className={wrapperClassName}>
      <textarea
        id={id}
        rows={rows}
        className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm ${className}`}
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

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
    rows = 5,
    className,
    wrapperClassName,
    children,
    ...props
  }: TextareaFieldProps) => {
  return (
    <FieldWrapper label={label} className={wrapperClassName}>
      <textarea
        id={id}
        rows={rows}
        className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm ${className}`}
        {...props}
      />
      {children}
    </FieldWrapper>
  );
};

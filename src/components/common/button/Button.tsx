import { classNames } from '@/const';
import React from 'react';

const ButtonSpinner = () => (
  <svg
    className="h-5 w-5 animate-spin text-white"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    ></circle>
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    ></path>
  </svg>
);

const variants = {
  primary:
    'bg-black text-white border-transparent hover:bg-neutral-800 disabled:hover:bg-neutral-700',
  inverse:
    'bg-transparent text-black border-neutral-300 hover:bg-black hover:text-white disabled:hover:bg-transparent disabled:hover:text-neutral-800 hover:border-transparent',
  primaryRed: 'bg-red-500 text-white border-transparent hover:bg-red-600 disabled:hover:bg-red-500',
  inverseRed:
    'bg-transparent text-red-500 hover:bg-red-100 disabled:hover:bg-transparent disabled:hover:text-red-500',
  inverseBlack:
    'bg-transparent text-black border-black hover:bg-black hover:text-white disabled:hover:bg-transparent disabled:hover:text-black',
};

const sizes = {
  xs: 'py-0.5 px-1 text-xs',
  sm: 'py-1 px-2 text-sm',
  md: 'py-1 px-4 text-md',
  lg: 'py-3 px-8 text-xl',
};

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  thinBorder?: boolean;
  noBorder?: boolean;
  loading?: boolean;
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      type = 'button',
      className = '',
      variant = 'primary',
      size = 'md',
      thinBorder = false,
      noBorder = false,
      loading = false,
      ...props
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        type={type}
        className={classNames(
          'flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none disabled:cursor-not-allowed disabled:opacity-70',
          thinBorder ? 'border' : 'border-2',
          noBorder ? 'border-transparent' : '',
          variants[variant],
          sizes[size],
          className,
        )}
        {...props}
      >
        <span className="mx-2 flex items-center justify-center">
          {loading ? <ButtonSpinner /> : props.children}
        </span>
      </button>
    );
  },
);

Button.displayName = 'Button';

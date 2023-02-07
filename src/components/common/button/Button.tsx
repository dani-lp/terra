import { classNames } from '@/const';
import React from 'react';

const variants = {
  primary: 'bg-black text-white border-transparent hover:bg-neutral-800 disabled:hover:bg-neutral-700',
  inverse: 'bg-transparent text-black border-neutral-300 hover:bg-black hover:text-white disabled:hover:bg-transparent disabled:hover:text-neutral-800 hover:border-transparent',
  primaryRed: 'bg-red-500 text-white border-transparent hover:bg-red-600 disabled:hover:bg-red-500',
  inverseRed: 'bg-transparent text-red-500 border-red-500 hover:bg-red-500 hover:text-white disabled:hover:bg-transparent disabled:hover:text-red-500',
  inverseBlack: 'bg-transparent text-black border-black hover:bg-black hover:text-white disabled:hover:bg-transparent disabled:hover:text-black',
}

const sizes = {
  xs: 'py-0.5 px-1 text-xs',
  sm: 'py-1 px-2 text-sm',
  md: 'py-1 px-4 text-md',
  lg: 'py-3 px-8 text-xl',
}

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  thinBorder?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      type = 'button',
      className = '',
      variant = 'primary',
      size = 'md',
      thinBorder = false,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        type={type}
        className={classNames(
          'flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none disabled:cursor-not-allowed disabled:opacity-70',
          thinBorder ? 'border' : 'border-2',
          variants[variant],
          sizes[size],
          className,
        )}
        {...props}
      >
        <span className='mx-2 flex items-center justify-center'>{props.children}</span>
      </button>
    );
  }
);

Button.displayName = 'Button';
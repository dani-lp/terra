import { classNames } from '@/const';

type Props = {
  label: string;
  className?: string;
  dotColor?: string;
  onCloseClick?: () => void;
  onCloseLabel?: string;
};

export const Chip = ({ label, className = '', dotColor, onCloseClick, onCloseLabel }: Props) => {
  return (
    <div
      className={classNames(
        'inline-flex items-center rounded-full px-3 py-0.5 text-xs font-medium sm:text-sm',
        className ? className : 'bg-green-100 text-green-800',
      )}
    >
      {dotColor && <div className={classNames('mr-1 h-1.5 w-1.5 rounded-full', dotColor)} />}
      {label}
      {onCloseClick && (
        <button
          type="button"
          className="group relative ml-1 -mr-1 h-3.5 w-3.5 rounded-full hover:bg-neutral-600/20"
          onClick={onCloseClick}
          aria-label={onCloseLabel}
        >
          <svg
            viewBox="0 0 14 14"
            className="h-3.5 w-3.5 stroke-neutral-700/50 group-hover:stroke-neutral-700/75"
          >
            <path d="M4 4l6 6m0-6l-6 6" />
          </svg>
          <span className="absolute -inset-1" />
        </button>
      )}
    </div>
  );
};

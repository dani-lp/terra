import { classNames } from '@/const';

type Props = {
  label: string;
  className?: string;
  withDot?: boolean;
  dotColor?: string;
};

export const Chip = ({ label, className = '', withDot = false, dotColor }: Props) => {
  return (
    <div
      className={classNames(
        'inline-flex items-center rounded-full px-3 py-0.5 text-xs font-medium sm:text-sm',
        className ? className : 'bg-green-100 text-green-800',
      )}
    >
      {withDot && <div className={classNames('mr-1 h-1.5 w-1.5 rounded-full', dotColor)} />}
      {label}
    </div>
  );
};

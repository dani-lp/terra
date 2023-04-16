import { classNames } from '@/const';

type Props = {
  label: string;
  className?: string;
};

export const Chip = ({ label, className = '' }: Props) => {
  return (
    <div
      className={classNames(
        'inline-flex items-center rounded-full px-3 py-0.5 text-sm font-medium',
        className ? className : 'bg-green-100 text-green-800',
      )}
    >
      {label}
    </div>
  );
};

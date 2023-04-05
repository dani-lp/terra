import { classNames } from '@/const';

type Props = {
  className: `h-${number} w-${number}`;
};

export const Skeleton = ({ className }: Props) => {
  return (
    <div className={classNames('animate-pulse rounded-lg bg-neutral-200', className)} />
  );
};

import { classNames } from '@/const';

type Props = {
  className?: string;
};

export const Skeleton = ({ className }: Props) => {
  return (
    <div className={classNames(
      'animate-pulse bg-neutral-200 rounded-lg w-4 h-4',
      className
    )} />
  );
};
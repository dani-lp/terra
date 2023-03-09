import { classNames } from '@/const';

type Props = {
  whiteBackground?: boolean;
  className?: string;
};

export const Skeleton = ({ whiteBackground = false, className }: Props) => {
  return (
    <div className={classNames(
      'animate-pulse rounded-lg w-full h-full',
      whiteBackground ? 'bg-neutral-100' : 'bg-neutral-200',
      className
    )} />
  );
};
import { classNames } from '@/const';

type Props = {
  className?:
    | `h-${number}`
    | `w-${number}`
    | `h-[${number}px]`
    | `w-[${number}px]`
    | `h-${number} w-${number}`
    | `h-[${number}px] w-[${number}px]`
    | `h-${number} w-[${number}px]`
    | `h-[${number}px] w-${number}`;
  heightFull?: boolean;
  widthFull?: boolean;
};

export const Skeleton = ({ className, heightFull, widthFull }: Props) => {
  return (
    <div
      className={classNames(
        'animate-pulse rounded-lg bg-neutral-200',
        className,
        heightFull ? 'h-full' : '',
        widthFull ? 'w-full' : '',
      )}
    />
  );
};

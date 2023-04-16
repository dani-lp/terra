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
  rounded?: boolean;
};

export const Skeleton = ({ className, heightFull, widthFull, rounded }: Props) => {
  return (
    <div
      className={classNames(
        'animate-pulse bg-neutral-300',
        className,
        rounded ? 'rounded-full' : 'rounded-lg',
        heightFull ? 'h-full' : '',
        widthFull ? 'w-full' : '',
      )}
    />
  );
};

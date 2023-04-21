import { classNames } from '@/const';
import { GlobeEuropeAfricaIcon } from '@heroicons/react/20/solid';
import Image from 'next/image';

type Props = {
  position: number;
  image: string;
  name: string;
  username: string;
  score: number;
  onClick?: () => void;
};

export const LeaderBoardListRow = ({ position, image, name, username, score, onClick }: Props) => {
  // TODO link to user profile
  return (
    <li
      onClick={onClick}
      className={classNames(
        'grid h-14 grid-cols-9 items-center justify-between rounded-full px-4 transition-colors hover:bg-gray-200',
        onClick ? 'cursor-pointer' : '',
      )}
    >
      <span className="col-span-1 text-sm font-medium">{position}.</span>
      <div className="col-span-6 flex items-center gap-3">
        <Image src={image} alt="User avatar" height={40} width={40} className="rounded-full" />

        <div className="flex flex-col">
          <span className="text-sm font-medium">{name}</span>
          <span className="text-xs text-gray-600">@{username}</span>
        </div>
      </div>

      <div className="col-span-2 flex items-center justify-start">
        <GlobeEuropeAfricaIcon className="mr-2 h-5 w-5" />
        <span className="text-sm font-medium">{score}</span>
      </div>
    </li>
  );
};

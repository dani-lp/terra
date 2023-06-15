import type { Participation } from '@prisma/client';
import { useTranslation } from 'next-i18next';
import Image from 'next/image';

type Props = {
  participation: Participation;
  image: string;
  name: string | null;
  username: string | null;
  onUsernameClick?: () => void;
  checked: boolean;
  setChecked: (enabled: boolean) => void;
  disabled?: boolean;
};

export const ParticipationListRow = ({
  participation,
  image,
  name,
  username,
  onUsernameClick,
  checked,
  setChecked,
  disabled,
}: Props) => {
  const { t } = useTranslation('challenges');

  const usernameString = username ? `@${username}` : name ? name : t('challenges.details.unknown');

  return (
    <li className="flex h-14 items-center justify-between rounded-full px-4 transition-colors hover:bg-gray-200">
      <div className="flex items-center gap-3">
        <Image src={image} alt="User avatar" height={40} width={40} className="rounded-full" />

        <div className="flex flex-col gap-0.5">
          <span
            onClick={onUsernameClick}
            className="cursor-pointer text-sm text-gray-600 hover:underline"
          >
            {usernameString}
          </span>
          <a
            href={participation.proofUrl ?? ''}
            target="_blank"
            rel="noreferrer"
            className="text-xs underline"
          >
            {t('challenges.details.proof')}
          </a>
        </div>

        <span className="ml-4 text-sm text-gray-600">
          {participation.date.toISOString().substring(0, 10)}
        </span>
      </div>

      <div className="flex items-center justify-start">
        <label className="flex items-center text-sm text-gray-800">
          {t('challenges.details.valid')}:
          <input
            id="candidates"
            aria-describedby="candidates-description"
            name="candidates"
            type="checkbox"
            className="ml-2 h-4 w-4 rounded border-gray-300 text-black focus:ring-black disabled:opacity-50"
            disabled={disabled}
            checked={checked}
            onChange={() => setChecked(!checked)}
          />
        </label>
      </div>
    </li>
  );
};

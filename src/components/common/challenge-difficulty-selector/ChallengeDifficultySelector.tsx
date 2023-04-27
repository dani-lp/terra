import { classNames } from '@/const';
import { RadioGroup } from '@headlessui/react';
import type { ChallengeDifficulty } from '@prisma/client';
import { useTranslation } from 'next-i18next';

type DifficultyListEntry = {
  checkedClassName: string;
  ringClassName: string;
};

const difficultyLookup: Record<ChallengeDifficulty, DifficultyListEntry> = {
  EASY: {
    checkedClassName: 'bg-green-300',
    ringClassName: 'ring-green-300',
  },
  MEDIUM: {
    checkedClassName: 'bg-yellow-300',
    ringClassName: 'ring-yellow-300',
  },
  HARD: {
    checkedClassName: 'bg-red-300',
    ringClassName: 'ring-red-300',
  },
};

const difficulties: ChallengeDifficulty[] = ['EASY', 'MEDIUM', 'HARD'];
type Props = {
  difficulty: ChallengeDifficulty;
  setDifficulty: (value: ChallengeDifficulty) => void;
};

export const ChallengeDifficultySelector = ({ difficulty, setDifficulty }: Props) => {
  const { t } = useTranslation('challenges');

  return (
    <div>
      <p className="text-sm font-medium leading-6 text-gray-900">
        {t('challenges.creation.difficulty')}
        <span className="text-red-500"> *</span>
      </p>

      <RadioGroup value={difficulty} onChange={setDifficulty} className="mt-1">
        <RadioGroup.Label className="sr-only">
          {t('challenges.creation.difficultySrMsg')}
        </RadioGroup.Label>
        <div className="flex flex-col items-center justify-between gap-2 min-[550px]:flex-row">
          {difficulties.map((option) => (
            <RadioGroup.Option
              key={option}
              value={option}
              className={({ active, checked }) =>
                classNames(
                  active ? `ring-2 ring-offset-2 ${difficultyLookup[option].ringClassName}` : '',
                  checked
                    ? difficultyLookup[option].checkedClassName
                    : 'bg-white text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50',
                  'flex w-full flex-1 cursor-pointer items-center justify-center rounded-md p-3 text-sm font-semibold uppercase focus:outline-none',
                )
              }
            >
              <RadioGroup.Label as="span">
                {t(`challenges.creation.difficulties.${option.toLocaleLowerCase()}`)}
              </RadioGroup.Label>
            </RadioGroup.Option>
          ))}
        </div>
      </RadioGroup>
    </div>
  );
};

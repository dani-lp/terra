import { Combobox } from '@headlessui/react';
import { ChevronUpDownIcon } from '@heroicons/react/20/solid';
import { ChallengeTag } from '@prisma/client';
import * as React from 'react';

import { Chip } from '@/components/common/chip';
import { classNames, tagColors, tagDotColors } from '@/const';
import { useTranslation } from 'next-i18next';

type Props = {
  selectedTags: ChallengeTag[];
  setSelectedTags: (tags: ChallengeTag[]) => void;
};

const allTags = Object.values(ChallengeTag);

export const ChallengeTagSelector = ({ selectedTags, setSelectedTags }: Props) => {
  const [queryString, setQueryString] = React.useState<string>('');
  const { t } = useTranslation('challenges');

  const filteredTags = allTags.filter((tag) => !selectedTags.includes(tag)).filter(Boolean);
  const displayTags =
    queryString === ''
      ? filteredTags
      : filteredTags.filter((tag) =>
          t(`challenges.tags.${tag}`).toLowerCase().includes(queryString.toLowerCase()),
        );

  const handleAddTag = (tag: ChallengeTag) => {
    setSelectedTags([...selectedTags, tag].filter(Boolean));
    setQueryString('');
  };

  return (
    <div>
      <Combobox as="div" onChange={handleAddTag}>
        <Combobox.Label className="block text-sm font-medium leading-6 text-gray-900">
          {t('challenges.creation.tags')}
          <span className="text-red-500"> *</span>
        </Combobox.Label>
        <div className="relative mt-2">
          <Combobox.Input
            className="w-full rounded-md border-0 bg-white py-1.5 pl-3 pr-12 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm sm:leading-6"
            onChange={(event) => setQueryString(event.target.value)}
            placeholder={t('challenges.creation.addTags')}
            displayValue={() => ''}
          />
          <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
            <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </Combobox.Button>

          {displayTags.length > 0 && (
            <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
              {displayTags.map((tag) => (
                <Combobox.Option
                  key={tag}
                  value={tag}
                  className={({ active }) =>
                    classNames(
                      'relative cursor-default select-none py-2 pl-3 pr-9',
                      active ? 'bg-black text-white' : 'text-gray-900',
                    )
                  }
                >
                  <div className="flex items-center">
                    <span
                      className={classNames(
                        'inline-block h-2 w-2 shrink-0 rounded-full bg-gray-200',
                        tagDotColors[tag],
                      )}
                      aria-hidden="true"
                    />
                    <span className="ml-3 truncate">{t(`challenges.tags.${tag}`)}</span>
                  </div>
                </Combobox.Option>
              ))}
            </Combobox.Options>
          )}
        </div>
      </Combobox>

      <li className="mt-2 flex flex-wrap gap-2">
        {selectedTags.map((tag) => (
          <Chip
            key={tag}
            label={t(`challenges.tags.${tag}`)}
            className={tagColors[tag]}
            onCloseClick={() => setSelectedTags(selectedTags.filter((t) => t !== tag))}
          />
        ))}
      </li>
    </div>
  );
};

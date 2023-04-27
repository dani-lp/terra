import { Dialog, RadioGroup } from '@headlessui/react';
import { MapPinIcon, QuestionMarkCircleIcon } from '@heroicons/react/20/solid';
import { XMarkIcon } from '@heroicons/react/24/outline';
import * as React from 'react';

import { Alert, ChallengeTagSelector } from '@/components/common';
import { classNames, config } from '@/const';
import { trpc } from '@/utils/trpc';
import type { ChallengeDifficulty, ChallengeTag } from '@prisma/client';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import { Button, DateInputWithIcon } from '../common';
import { SlideOver } from '../common/layout/SlideOver';

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

type DifficultyRadioButtonsProps = {
  difficulty: ChallengeDifficulty;
  setDifficulty: (value: ChallengeDifficulty) => void;
};

const DifficultyRadioButtons = ({ difficulty, setDifficulty }: DifficultyRadioButtonsProps) => {
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

type FormValues = {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  location: string;
  privacy: 'public' | 'private';
  tags: ChallengeTag[];
  difficulty: ChallengeDifficulty;
};

export const NewChallengeSlideOver = () => {
  const utils = trpc.useContext();
  const newChallengeMutation = trpc.challenges.create.useMutation({
    onSuccess: async () => {
      await utils.challenges.available.invalidate();
      await utils.challenges.created.invalidate();
    },
  });
  const [errors, setErrors] = React.useState<string[]>([]);

  const { t } = useTranslation('challenges');
  const { t: tCommon } = useTranslation('common');
  const [open, setOpen] = React.useState(false);
  const [formValues, setFormValues] = React.useState<FormValues>({
    name: '',
    description: '',
    startDate: new Date().toISOString().substring(0, 10),
    endDate: '',
    location: '',
    privacy: 'public',
    tags: [],
    difficulty: 'EASY',
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { name, difficulty, tags, description, startDate, endDate, location } = formValues;

    const newErrors: string[] = [];

    if (!name) {
      newErrors.push(t('challenges.creation.errors.missingName'));
    } else if (name.length < 5) {
      newErrors.push(t('challenges.creation.errors.shortName'));
    }
    if (!difficulty) {
      newErrors.push(t('challenges.creation.errors.missingDifficulty'));
    }
    if (!tags || tags.length === 0) {
      newErrors.push(t('challenges.creation.errors.missingTags'));
    }
    if (!description) {
      newErrors.push(t('challenges.creation.errors.missingDescription'));
    }
    if (!startDate) {
      newErrors.push(t('challenges.creation.errors.missingStartDate'));
    }
    if (!endDate) {
      newErrors.push(t('challenges.creation.errors.missingEndDate'));
    }
    if (new Date(startDate) > new Date(endDate)) {
      newErrors.push(t('challenges.creation.errors.invalidDateRange'));
    }
    if (new Date(endDate) < new Date()) {
      newErrors.push(t('challenges.creation.errors.invalidEndDate'));
    }
    if (location.length === 1) {
      newErrors.push(t('challenges.creation.errors.shortLocation'));
    }

    setErrors(newErrors);

    if (newErrors.length > 0) {
      return;
    }

    const result = await newChallengeMutation.mutateAsync(formValues);

    if (result) {
      setOpen(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setErrors([]);
    setFormValues({
      ...formValues,
      [e.target.name]: e.target.value,
    });
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrors([]);
    setFormValues({
      ...formValues,
      [e.target.name]: new Date(e.target.value).toISOString().substring(0, 10),
    });
  };

  const handleDifficultyChange = (value: ChallengeDifficulty) => {
    setErrors([]);
    setFormValues({
      ...formValues,
      difficulty: value,
    });
  };

  const handleTagsChange = (value: ChallengeTag[]) => {
    setErrors([]);
    setFormValues({
      ...formValues,
      tags: value,
    });
  };

  return (
    <>
      <Button size="sm" onClick={() => setOpen(!open)} className="xl:h-10">
        {t('challenges.creation.new')}
      </Button>

      <SlideOver open={open} setOpen={setOpen} withShadow>
        <form
          className="flex h-full flex-col divide-y divide-gray-200 bg-white shadow-xl"
          onSubmit={handleSubmit}
        >
          <div className="h-0 flex-1 overflow-y-auto">
            <div className="bg-black py-6 px-4 sm:px-6">
              <div className="flex items-center justify-between">
                <Dialog.Title className="text-base font-semibold leading-6 text-white">
                  {t('challenges.new.title')}
                </Dialog.Title>
                <div className="ml-3 flex h-7 items-center">
                  <button
                    type="button"
                    className="rounded-md text-neutral-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                    onClick={() => setOpen(false)}
                  >
                    <span className="sr-only">{tCommon('a11y.closePanel')}</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
              </div>
              <div className="mt-1">
                <p className="text-sm text-neutral-200">{t('challenges.new.description')}</p>
              </div>
            </div>
            <div className="flex flex-1 flex-col justify-between">
              <div className="divide-y divide-gray-200 px-4 sm:px-6">
                <div className="space-y-6 pt-6 pb-5">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-900">
                      {t('challenges.creation.name')}
                      <span className="text-red-500"> *</span>
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="name"
                        id="name"
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm"
                        value={formValues.name}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <DifficultyRadioButtons
                    difficulty={formValues.difficulty}
                    setDifficulty={(newDifficulty) => handleDifficultyChange(newDifficulty)}
                  />

                  <ChallengeTagSelector
                    selectedTags={formValues.tags}
                    setSelectedTags={handleTagsChange}
                    requiredField
                  />
                </div>
                <div className="space-y-6 pt-4 pb-5">
                  <div>
                    <label
                      htmlFor="description"
                      className="block text-sm font-medium text-gray-900"
                    >
                      {t('challenges.creation.description')}
                      <span className="text-red-500"> *</span>
                    </label>
                    <div className="mt-1">
                      <textarea
                        id="description"
                        name="description"
                        rows={4}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm"
                        value={formValues.description}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="flex w-full flex-col items-center justify-between gap-4 sm:flex-row">
                    <DateInputWithIcon
                      label={t('challenges.creation.startDate')}
                      name="startDate"
                      value={formValues.startDate}
                      handleInputChange={handleDateChange}
                      required
                    />

                    <DateInputWithIcon
                      label={t('challenges.creation.endDate')}
                      name="endDate"
                      value={formValues.endDate}
                      handleInputChange={handleDateChange}
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="location"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      {t('challenges.creation.location')}
                    </label>
                    <div className="relative mt-1 rounded-md shadow-sm">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <MapPinIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                      </div>
                      <input
                        type="text"
                        name="location"
                        id="location"
                        className="block w-full rounded-md border-0 py-1.5 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm sm:leading-6"
                        value={formValues.location}
                        onChange={handleChange}
                        placeholder={t('challenges.creation.locationPlaceholder') as string}
                      />
                    </div>
                  </div>
                </div>
                <div className="space-y-6 pt-4 pb-5">
                  <fieldset>
                    <legend className="text-sm font-medium text-gray-900">
                      {t('challenges.creation.privacy')}
                    </legend>
                    <div className="mt-2 space-y-5">
                      <div className="relative flex items-start">
                        <div className="absolute flex h-5 items-center">
                          <input
                            id="privacy-public"
                            name="privacy"
                            aria-describedby="privacy-public-description"
                            type="radio"
                            className="h-4 w-4 border-gray-300 text-black focus:ring-black"
                            defaultChecked
                          />
                        </div>
                        <div className="pl-7 text-sm">
                          <label htmlFor="privacy-public" className="font-medium text-gray-900">
                            {t('challenges.creation.publicAccess.title')}
                          </label>
                          <p id="privacy-public-description" className="text-gray-500">
                            {t('challenges.creation.publicAccess.description')}
                          </p>
                        </div>
                      </div>
                      {config.privateChallengesEnabled && (
                        <div>
                          <div className="relative flex items-start">
                            <div className="absolute flex h-5 items-center">
                              <input
                                id="privacy-private-to-project"
                                name="privacy"
                                aria-describedby="privacy-private-to-project-description"
                                type="radio"
                                className="h-4 w-4 border-gray-300 text-black focus:ring-black"
                              />
                            </div>
                            <div className="pl-7 text-sm">
                              <label
                                htmlFor="privacy-private-to-project"
                                className="font-medium text-gray-900"
                              >
                                {t('challenges.creation.protectedAccess.title')}
                              </label>
                              <p
                                id="privacy-private-to-project-description"
                                className="text-gray-500"
                              >
                                {t('challenges.creation.protectedAccess.description')}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                      {config.challengeDraftsEnabled && (
                        <div>
                          <div className="relative flex items-start">
                            <div className="absolute flex h-5 items-center">
                              <input
                                id="privacy-private"
                                name="privacy"
                                aria-describedby="privacy-private-to-project-description"
                                type="radio"
                                className="h-4 w-4 border-gray-300 text-black focus:ring-black"
                              />
                            </div>
                            <div className="pl-7 text-sm">
                              <label
                                htmlFor="privacy-private"
                                className="font-medium text-gray-900"
                              >
                                {t('challenges.creation.draftAccess.title')}
                              </label>
                              <p id="privacy-private-description" className="text-gray-500">
                                {t('challenges.creation.draftAccess.description')}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </fieldset>
                </div>
                <div className="pt-4 pb-6">
                  <div className="flex text-sm">
                    <Link
                      href="/about"
                      className="group inline-flex items-center text-gray-500 hover:text-gray-900"
                    >
                      <QuestionMarkCircleIcon
                        className="h-5 w-5 text-gray-400 group-hover:text-gray-500"
                        aria-hidden="true"
                      />
                      <span className="ml-2">{t('challenges.editSlideOver.learnAbout')}</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-4 p-4">
            <Alert
              shown={errors.length > 0}
              content={{
                type: 'error',
                title: `${t('challenges.creation.errors.title')}:`,
                errors,
              }}
            />
            <div className="flex shrink-0 justify-end gap-4">
              <Button
                disabled={newChallengeMutation.isLoading}
                type="button"
                variant="inverse"
                onClick={() => setOpen(false)}
              >
                {t('challenges.creation.cancel')}
              </Button>
              <Button disabled={newChallengeMutation.isLoading} type="submit">
                {t('challenges.creation.create')}
              </Button>
            </div>
          </div>
        </form>
      </SlideOver>
    </>
  );
};

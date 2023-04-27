import {
  Alert,
  Button,
  ChallengeDifficultySelector,
  ChallengeTagSelector,
  DateInputWithIcon,
} from '@/components/common';
import { trpc } from '@/utils/trpc';
import { Dialog, Transition } from '@headlessui/react';
import { MapPinIcon, QuestionMarkCircleIcon } from '@heroicons/react/20/solid';
import { XMarkIcon } from '@heroicons/react/24/outline';
import type { Challenge, ChallengeDifficulty, ChallengeTag } from '@prisma/client';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import * as React from 'react';

type FormValues = {
  name: string;
  difficulty: ChallengeDifficulty;
  tags: ChallengeTag[];
  description: string;
  startDate: string;
  endDate: string;
  location: string;
};

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  challenge: Challenge;
  challengeTags: ChallengeTag[];
};

export const EditChallengeSlideOver = ({ open, setOpen, challenge, challengeTags }: Props) => {
  const { t } = useTranslation('challenges');
  const utils = trpc.useContext();
  const editChallengeMutation = trpc.challenges.edit.useMutation({
    onSuccess: async () => {
      await utils.challenges.invalidate();
    },
  });
  const [errors, setErrors] = React.useState<string[]>([]);

  const [formValues, setFormValues] = React.useState<FormValues>({
    name: challenge.name,
    difficulty: challenge.difficulty,
    tags: challengeTags,
    description: challenge.description,
    startDate: challenge.startDate.toISOString().substring(0, 10),
    endDate: challenge.endDate.toISOString().substring(0, 10),
    location: challenge.location ?? '',
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setErrors([]);
    const { name, value } = event.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setErrors([]);
    const { name, value } = event.target;
    const newDate = new Date(value).toISOString().substring(0, 10);
    setFormValues({ ...formValues, [name]: newDate });
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { name, difficulty, tags, description, startDate, endDate, location } = formValues;

    const newErrors: string[] = [];

    if (!name) {
      newErrors.push(t('challenges.errors.missingName'));
    } else if (name.length < 5) {
      newErrors.push(t('challenges.errors.shortName'));
    }
    if (!difficulty) {
      newErrors.push(t('challenges.errors.missingDifficulty'));
    }
    if (!tags || tags.length === 0) {
      newErrors.push(t('challenges.errors.missingTags'));
    }
    if (!description) {
      newErrors.push(t('challenges.errors.missingDescription'));
    }
    if (!startDate) {
      newErrors.push(t('challenges.errors.missingStartDate'));
    }
    if (!endDate) {
      newErrors.push(t('challenges.errors.missingEndDate'));
    }
    if (new Date(startDate) > new Date(endDate)) {
      newErrors.push(t('challenges.errors.invalidDateRange'));
    }
    if (new Date(endDate) < new Date()) {
      newErrors.push(t('challenges.errors.invalidEndDate'));
    }
    if (location.length === 1) {
      newErrors.push(t('challenges.errors.shortLocation'));
    }

    setErrors(newErrors);

    if (newErrors.length > 0) {
      return;
    }

    const result = await editChallengeMutation.mutateAsync({
      id: challenge.id,
      name,
      difficulty,
      tags, 
      description,
      startDate,
      endDate,
      location,
    });

    if (result) {
      setOpen(false);
    }
  };

  return (
    <Transition.Root show={open} as={React.Fragment}>
      <Dialog as="div" className="relative z-30" onClose={setOpen}>
        <Transition.Child
          as={React.Fragment}
          enter="ease-in-out duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500/75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0" />

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16">
              <Transition.Child
                as={React.Fragment}
                enter="transform transition ease-in-out duration-500"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                  <form
                    onSubmit={handleSubmit}
                    className="flex h-full flex-col divide-y divide-gray-200 bg-white shadow-xl"
                  >
                    <div className="h-0 flex-1 overflow-y-auto">
                      <div className="bg-black p-4 sm:px-6">
                        <div className="flex items-center justify-between">
                          <Dialog.Title className="text-base font-semibold leading-6 text-white">
                            {t('challenges.editSlideOver.title')}
                          </Dialog.Title>
                          <div className="ml-3 flex h-7 items-center">
                            <button
                              type="button"
                              className="rounded-md bg-black text-neutral-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                              onClick={() => setOpen(false)}
                            >
                              <span className="sr-only">
                                {t('challenges.editSlideOver.other.closePanel')}
                              </span>
                              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-1 flex-col justify-between">
                        <div className="divide-y divide-gray-200 px-4 sm:px-6">
                          <div className="space-y-6 pb-5 pt-6">
                            <div>
                              <label
                                htmlFor="name"
                                className="block text-sm font-medium leading-6 text-gray-900"
                              >
                                {t('challenges.editSlideOver.name')}
                                <span className="text-red-500"> *</span>
                              </label>
                              <div className="mt-1">
                                <input
                                  type="text"
                                  name="name"
                                  id="name"
                                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm sm:leading-6"
                                  value={formValues.name}
                                  onChange={handleChange}
                                />
                              </div>
                            </div>

                            <ChallengeDifficultySelector
                              difficulty={formValues.difficulty}
                              setDifficulty={handleDifficultyChange}
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
                                className="block text-sm font-medium leading-6 text-gray-900"
                              >
                                {t('challenges.editSlideOver.description')}
                                <span className="text-red-500"> *</span>
                              </label>
                              <div className="mt-1">
                                <textarea
                                  id="description"
                                  name="description"
                                  rows={4}
                                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm sm:leading-6"
                                  defaultValue={formValues.description}
                                  onChange={handleChange}
                                />
                              </div>
                            </div>

                            <DateInputWithIcon
                              label={t('challenges.editSlideOver.startDate')}
                              name="startDate"
                              value={formValues.startDate}
                              handleInputChange={handleDateChange}
                              required
                            />

                            <DateInputWithIcon
                              label={t('challenges.editSlideOver.endDate')}
                              name="endDate"
                              value={formValues.endDate}
                              handleInputChange={handleDateChange}
                              required
                            />

                            <div>
                              <label
                                htmlFor="challenge-location"
                                className="block text-sm font-medium leading-6 text-gray-900"
                              >
                                {t('challenges.editSlideOver.location')}
                              </label>
                              <div className="relative mt-1">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                  <MapPinIcon
                                    className="h-5 w-5 text-gray-400"
                                    aria-hidden="true"
                                  />
                                </div>
                                <input
                                  type="text"
                                  name="location"
                                  id="location"
                                  className="block w-full rounded-md border-0 py-1.5 pl-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm sm:leading-6"
                                  value={formValues.location ?? ''}
                                  onChange={handleChange}
                                />
                              </div>
                            </div>
                          </div>
                          <div className="pb-6 pt-4">
                            <div className="flex text-sm">
                              <Link
                                href="/about"
                                className="group inline-flex items-center text-gray-500 hover:text-gray-900"
                              >
                                <QuestionMarkCircleIcon
                                  className="h-5 w-5 text-gray-400 group-hover:text-gray-500"
                                  aria-hidden="true"
                                />
                                <span className="ml-2">
                                  {t('challenges.editSlideOver.learnAbout')}
                                </span>
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
                          title: `${t('challenges.errors.title')}:`,
                          errors,
                        }}
                      />
                      <div className="flex shrink-0 justify-end gap-4">
                        <Button
                          disabled={editChallengeMutation.isLoading}
                          type="button"
                          variant="inverse"
                          onClick={() => setOpen(false)}
                        >
                          {t('challenges.participationSlideOver.cancel')}
                        </Button>
                        <Button disabled={editChallengeMutation.isLoading} type="submit">
                          {t('challenges.participationSlideOver.addParticipation')}
                        </Button>
                      </div>
                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

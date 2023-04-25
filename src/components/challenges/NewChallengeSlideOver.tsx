import { Dialog } from '@headlessui/react';
import { MapPinIcon, QuestionMarkCircleIcon } from '@heroicons/react/20/solid';
import { XMarkIcon } from '@heroicons/react/24/outline';
import * as React from 'react';

import { config } from '@/const';
import { trpc } from '@/utils/trpc';
import type { ChallengeDifficulty, ChallengeTag } from '@prisma/client';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import { Button, DateInputWithIcon } from '../common';
import { SlideOver } from '../common/layout/SlideOver';

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

  const { t } = useTranslation('challenges');
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

    // TODO validation
    const result = await newChallengeMutation.mutateAsync(formValues);

    if (result) {
      setOpen(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormValues({
      ...formValues,
      [e.target.name]: e.target.value,
    });
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValues({
      ...formValues,
      [e.target.name]: new Date(e.target.value).toISOString().substring(0, 10),
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
                    <span className="sr-only">{t('a11y.closePanel')}</span>
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

                  <div className="flex w-full items-center justify-between gap-4">
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
          <div className="flex shrink-0 justify-end gap-2 p-4">
            <Button type="button" variant="inverse" onClick={() => setOpen(false)}>
              {t('challenges.creation.cancel')}
            </Button>
            <Button type="submit">{t('challenges.creation.create')}</Button>
          </div>
        </form>
      </SlideOver>
    </>
  );
};

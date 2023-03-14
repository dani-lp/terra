import * as React from 'react';
import { Dialog } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { LinkIcon, QuestionMarkCircleIcon } from '@heroicons/react/20/solid';

import { SlideOver } from '../common/layout/SlideOver';
import { Button } from '../common';
import { useTranslation } from 'react-i18next';
import { trpc } from '@/utils/trpc';


export const NewChallengeSlideOver = () => {
  const utils = trpc.useContext();
  const newChallengeMutation = trpc.challenges.create.useMutation({
    onSuccess: () => {
      utils.challenges.available.invalidate();
      utils.challenges.created.invalidate();
    },
  });

  const { t } = useTranslation('challenges');
  const [open, setOpen] = React.useState(false);
  const [newChallengeName, setNewChallengeName] = React.useState<string>('');
  const [newChallengeDescription, setNewChallengeDescription] = React.useState<string>('');

  // TODO use a TRPC mutation
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    newChallengeMutation.mutate({
      name: newChallengeName,
      description: newChallengeDescription,
    });

    setOpen(false);
  };

  return (
    <>
      <Button size="sm" onClick={() => setOpen(!open)} className="xl:h-10">
        New
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
                    <label
                      htmlFor="project-name"
                      className="block text-sm font-medium text-gray-900"
                    >
                      Challenge name
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="project-name"
                        id="project-name"
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm"
                        value={newChallengeName}
                        onChange={(e) => setNewChallengeName(e.currentTarget.value)}
                      />
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="description"
                      className="block text-sm font-medium text-gray-900"
                    >
                      Description
                    </label>
                    <div className="mt-1">
                      <textarea
                        id="description"
                        name="description"
                        rows={4}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm"
                        value={newChallengeDescription}
                        onChange={(e) => setNewChallengeDescription(e.currentTarget.value)}
                      />
                    </div>
                  </div>
                  <fieldset>
                    <legend className="text-sm font-medium text-gray-900">Privacy</legend>
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
                            Public access
                          </label>
                          <p id="privacy-public-description" className="text-gray-500">
                            Everyone will be able to take part in the challenge.
                          </p>
                        </div>
                      </div>
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
                              Private to organization members
                            </label>
                            <p
                              id="privacy-private-to-project-description"
                              className="text-gray-500"
                            >
                              Only members of your organization will be able to participate.
                            </p>
                          </div>
                        </div>
                      </div>
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
                            <label htmlFor="privacy-private" className="font-medium text-gray-900">
                              Private to you
                            </label>
                            <p id="privacy-private-description" className="text-gray-500">
                              Create a draft version of the challenge.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </fieldset>
                </div>
                <div className="pt-4 pb-6">
                  <div className="flex text-sm">
                    <a
                      href="#"
                      className="group inline-flex items-center font-medium text-neutral-600 hover:text-neutral-900"
                    >
                      <LinkIcon
                        className="h-5 w-5 text-neutral-600 group-hover:text-neutral-900"
                        aria-hidden="true"
                      />
                      <span className="ml-2">Copy link</span>
                    </a>
                  </div>
                  <div className="mt-4 flex text-sm">
                    <a
                      href="#"
                      className="group inline-flex items-center text-gray-500 hover:text-gray-900"
                    >
                      <QuestionMarkCircleIcon
                        className="h-5 w-5 text-gray-400 group-hover:text-gray-500"
                        aria-hidden="true"
                      />
                      <span className="ml-2">Learn more about challenges</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex shrink-0 justify-end gap-2 p-4">
            <Button type="button" variant="inverse" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Create challenge</Button>
          </div>
        </form>
      </SlideOver>
    </>
  );
};

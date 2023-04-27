import { Alert, Button } from '@/components/common';
import { trpc } from '@/utils/trpc';
import { Dialog, Transition } from '@headlessui/react';
import { CalendarDaysIcon, CalendarIcon, QuestionMarkCircleIcon } from '@heroicons/react/20/solid';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { PhotoIcon } from '@heroicons/react/24/solid';
import type { Challenge } from '@prisma/client';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import * as React from 'react';

type ExternalInputProps = {
  handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

const DateInputWithIcon = ({ handleInputChange }: ExternalInputProps) => {
  const { t } = useTranslation('challenges');

  return (
    <div>
      <label htmlFor="date" className="block text-sm font-medium leading-6 text-gray-900">
        {t('challenges.participationSlideOver.dateField')}
      </label>
      <div className="relative mt-2 rounded-md shadow-sm">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <CalendarDaysIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
        </div>
        <input
          type="date"
          name="date"
          id="date"
          className="block w-full rounded-md border-0 py-1.5 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm sm:leading-6"
          onChange={handleInputChange}
        />
      </div>
    </div>
  );
};

const FileInput = () => {
  const { t } = useTranslation('challenges');
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleContainerClick = () => {
    inputRef.current?.click();
  };

  return (
    <div className="col-span-full">
      <label htmlFor="cover-photo" className="block text-sm font-medium leading-6 text-gray-900">
        {t('challenges.participationSlideOver.proof')}
      </label>
      <div
        onClick={handleContainerClick}
        className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10"
      >
        <div className="text-center">
          <PhotoIcon className="mx-auto h-12 w-12 text-gray-300" aria-hidden="true" />
          <div className="mt-4 text-sm leading-6 text-gray-600">
            <label
              htmlFor="file-upload"
              className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
            >
              <span>{t('challenges.participationSlideOver.uploadFile')}</span>
              <input
                id="file-upload"
                name="file-upload"
                type="file"
                className="sr-only"
                ref={inputRef}
              />
            </label>
          </div>
          <p className="text-xs leading-5 text-gray-600">PNG, JPG, GIF</p>
        </div>
      </div>
    </div>
  );
};

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  challenge: Challenge;
};

export const AddParticipationSlideOver = ({ open, setOpen, challenge }: Props) => {
  const { t } = useTranslation('challenges');
  const utils = trpc.useContext();
  const registerParticipationMutation = trpc.participation.register.useMutation({
    onSuccess: async () => {
      await Promise.all([
        utils.challenges.get.invalidate,
        utils.participation.getByChallenge.invalidate,
        utils.user.getPlayerOverviewData.invalidate,
      ]);
    },
  });

  const [date, setDate] = React.useState<Date>(new Date());
  const [comments, setComments] = React.useState<string>('');
  const [errors, setErrors] = React.useState<string[]>([]);

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setErrors([]);
    setDate(new Date(event.target.value));
  };

  const handleCommentsChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setComments(event.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const isDateValid = date > challenge.startDate && date < challenge.endDate;

    if (!date || !isDateValid) {
      setErrors([t('challenges.participationSlideOver.errors.date')]);
      return;
    }

    // TODO upload file proof to S3 separately
    const mutationData = {
      challengeId: challenge.id,
      date,
      comments,
    };

    const result = await registerParticipationMutation.mutateAsync(mutationData);

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
                      <div className="bg-black px-4 py-6 sm:px-6">
                        <div className="flex items-center justify-between">
                          <Dialog.Title className="text-base font-semibold leading-6 text-white">
                            {challenge.name}
                          </Dialog.Title>
                          <div className="ml-3 flex h-7 items-center">
                            <button
                              type="button"
                              className="rounded-md bg-black text-neutral-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                              onClick={() => setOpen(false)}
                            >
                              <span className="sr-only">
                                {t('challenges.participationSlideOver.other.closePanel')}
                              </span>
                              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                            </button>
                          </div>
                        </div>
                        <div className="mt-1">
                          <p className="text-sm text-neutral-300">{challenge.description}</p>
                        </div>

                        <div className="mt-3 flex items-center text-sm text-neutral-200">
                          <CalendarIcon
                            className="mr-1.5 h-5 w-5 shrink-0 text-gray-300"
                            aria-hidden="true"
                          />
                          {challenge.startDate.toLocaleDateString()} &ndash;{' '}
                          {challenge.endDate.toLocaleDateString()}
                        </div>
                      </div>
                      <div className="flex flex-1 flex-col justify-between">
                        <div className="divide-y divide-gray-200 px-4 sm:px-6">
                          <div className="space-y-6 pb-5 pt-6">
                            <DateInputWithIcon handleInputChange={handleDateChange} />

                            <div>
                              <label
                                htmlFor="comments"
                                className="block text-sm font-medium leading-6 text-gray-900"
                              >
                                {t('challenges.participationSlideOver.commentsField')}
                              </label>
                              <div className="mt-2">
                                <textarea
                                  id="comments"
                                  name="comments"
                                  rows={4}
                                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm sm:leading-6"
                                  defaultValue={''}
                                  onChange={handleCommentsChange}
                                />
                              </div>
                            </div>

                            <FileInput />
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
                                  {/* TODO add to "about" page */}
                                  {t('challenges.participationSlideOver.learnAbout')}
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
                          title: `${t('challenges.participationSlideOver.errors.title')}:`,
                          errors,
                        }}
                      />
                      <div className="flex shrink-0 justify-end gap-4">
                        <Button
                          disabled={registerParticipationMutation.isLoading}
                          type="button"
                          variant="inverse"
                          onClick={() => setOpen(false)}
                        >
                          {t('challenges.participationSlideOver.cancel')}
                        </Button>
                        <Button disabled={registerParticipationMutation.isLoading} type="submit">
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

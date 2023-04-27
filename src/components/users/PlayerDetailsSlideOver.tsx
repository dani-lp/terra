import { Dialog, Transition } from '@headlessui/react';
import { FlagIcon } from '@heroicons/react/20/solid';
import { XMarkIcon } from '@heroicons/react/24/outline';
import type { Achievement } from '@prisma/client';
import { useTranslation } from 'next-i18next';
import Image, { type StaticImageData } from 'next/image';
import * as React from 'react';

import { PlayerLevel } from '@/components/common';
import { AchievementCardSmall, PlayerDetailsSlideOverContentSkeleton } from '@/components/users';
import { trpc } from '@/utils/trpc';

import pfp1 from '../../../public/img/profile_bgs/profileBg1.jpg';
import pfp2 from '../../../public/img/profile_bgs/profileBg2.jpg';
import pfp3 from '../../../public/img/profile_bgs/profileBg3.jpg';

const coverImageUrls = [pfp1, pfp2, pfp3];

const tempAchievements: Achievement[] = [
  {
    id: '1',
    tier: 'BRONZE',
    challengeTag: 'COMMUNITY_INVOLVEMENT',
    playerDataId: 'id',
  },
  {
    id: '2',
    tier: 'SILVER',
    challengeTag: 'WELLNESS',
    playerDataId: 'id',
  },
  {
    id: '3',
    tier: 'GOLD',
    challengeTag: 'FITNESS',
    playerDataId: 'id',
  },
  {
    id: '4',
    tier: 'BRONZE',
    challengeTag: 'ENVIRONMENT_CLEANING',
    playerDataId: 'id',
  },
];

type Props = {
  playerId: string | null;
  open: boolean;
  setOpen: (open: boolean) => void;
};

export const PlayerDetailsSlideOver = ({ playerId, open, setOpen }: Props) => {
  const { data, isLoading, isError, error } = trpc.user.getPlayerOverviewData.useQuery({
    playerId,
  });
  const { t } = useTranslation('common');

  if (isError) {
    console.error(error);
    return null;
  }

  const coverImageUrl = coverImageUrls[(playerId ?? '0').charCodeAt(0) % 3] as StaticImageData;

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

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={React.Fragment}
                enter="transform transition ease-in-out duration-500"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto relative w-screen max-w-md">
                  <Transition.Child
                    as={React.Fragment}
                    enter="ease-in-out duration-500"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-500"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <div className="absolute left-0 top-0 -ml-8 flex pr-2 pt-4 sm:-ml-10 sm:pr-4">
                      <button
                        type="button"
                        className="rounded-md text-gray-100 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                        onClick={() => setOpen(false)}
                      >
                        <span className="sr-only">Close panel</span>
                        <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                      </button>
                    </div>
                  </Transition.Child>
                  <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                    <div className="relative flex-1">
                      <div>
                        <div>
                          <Image
                            className="h-32 w-full object-cover lg:h-48"
                            src={coverImageUrl}
                            alt=""
                          />
                        </div>
                        {isLoading && <PlayerDetailsSlideOverContentSkeleton />}
                        {!isLoading && data && (
                          <div className="mx-auto max-w-5xl px-6 sm:px-8 lg:px-10">
                            <div className="-mt-6 flex items-center gap-4 sm:-mt-10 sm:space-x-2">
                              <Image
                                className="h-24 w-24 rounded-full ring-4 ring-white sm:h-32 sm:w-32"
                                height={96}
                                width={96}
                                src={data.image ?? ''} // TODO placeholder profile image
                                alt=""
                              />
                              <div className="-mb-6 flex flex-col">
                                <div className="min-w-0 flex-1">
                                  <Dialog.Title
                                    as="h2"
                                    className="truncate text-2xl font-bold text-gray-900"
                                  >
                                    {data.name}
                                  </Dialog.Title>
                                </div>

                                <p className="text-sm text-neutral-500">@{data.username}</p>
                              </div>
                            </div>
                            <div className="mt-2 divide-y divide-gray-200">
                              <div>
                                <div className="mt-4 mb-2">
                                  <PlayerLevel points={data.experiencePoints} />
                                </div>

                                <div className="mt-2 mb-4 flex flex-col">
                                  <div className="mt-2 flex items-center text-sm text-gray-500">
                                    <FlagIcon
                                      className="mr-1.5 h-5 w-5 shrink-0 text-gray-400"
                                      aria-hidden="true"
                                    />
                                    {t('users.participatingChallenges', {
                                      count: data.challengeEnrollmentCount,
                                    })}
                                  </div>
                                </div>
                              </div>
                              <div>
                                {data.about && (
                                  <div className="py-2">
                                    <h6 className="mb-1 font-semibold leading-6 text-gray-900">
                                      {t('users.about')}
                                    </h6>
                                    <p>{data.about}</p>
                                  </div>
                                )}
                                {tempAchievements.length > 0 && (
                                  <div className="py-2">
                                    <h6 className="mb-1 font-semibold leading-6 text-gray-900">
                                      {t('users.achievements')}
                                    </h6>
                                    <li className="grid grid-cols-1 gap-2 py-2">
                                      {tempAchievements.map((achievement) => (
                                        <AchievementCardSmall
                                          key={achievement.id}
                                          tag={achievement.challengeTag}
                                          tier={achievement.tier}
                                          entries={6} // TODO use real value
                                        />
                                      ))}
                                    </li>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

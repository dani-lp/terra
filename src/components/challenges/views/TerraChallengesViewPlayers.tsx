import { useTranslation } from 'next-i18next';
import * as React from 'react';

import {
  ChallengeDetailsModal,
  ChallengeListRow,
  ChallengeRowSkeleton,
  ChallengesFilterGroup,
  ChallengesViewTopBar,
  SmallFilterGroup,
} from '@/components/challenges';
import { useAvailableChallenges, useEnrolledChallenges } from '@/components/challenges/hooks/';
import { Button } from '@/components/common';
import { classNames } from '@/const';
import { QUERY_PARAM_CHALLENGES_TAB } from '@/const/queryParams';
import { useQueryParams } from '@/hooks/useQueryParams';

export const TerraChallengesViewPlayers = () => {
  const { t } = useTranslation('challenges');
  const { getParamValue, setParam } = useQueryParams();
  const [modalChallengeId, setModalChallengeId] = React.useState<string>('');
  const activeTab = getParamValue(QUERY_PARAM_CHALLENGES_TAB) ?? 'available';

  const {
    challenges: availableChallenges,
    isLoading: availableChallengesLoading,
    isError: isAvailableChallengesError,
    error: availableChallengesError,
  } = useAvailableChallenges();

  const {
    challenges: enrolledChallenges,
    isLoading: enrolledChallengesLoading,
    isError: isEnrolledChallengesError,
    error: enrolledChallengesError,
  } = useEnrolledChallenges();

  if (isAvailableChallengesError) {
    console.error(availableChallengesError?.message);
    throw new Error(availableChallengesError?.message);
  }

  if (isEnrolledChallengesError) {
    console.error(enrolledChallengesError?.message);
    throw new Error(enrolledChallengesError?.message);
  }

  const isLoading = availableChallengesLoading || enrolledChallengesLoading;
  const isError = isAvailableChallengesError || isEnrolledChallengesError;

  const tabs = [
    { id: 'available', label: t('challenges.overview.tabs.available') },
    { id: 'joined', label: t('challenges.overview.tabs.joined') },
  ] as const;

  const handleTabChange = async (tabId: typeof tabs[number]['id']) => {
    if (tabId === 'available') {
      await setParam(QUERY_PARAM_CHALLENGES_TAB, 'available');
    } else {
      await setParam(QUERY_PARAM_CHALLENGES_TAB, 'joined');
    }
  };

  const challenges = activeTab === 'joined' ? enrolledChallenges : availableChallenges;

  const showEmptyState = !isLoading && !isError && challenges.length === 0;
  const showChallenges = !isLoading && !isError && challenges.length > 0;

  return (
    <>
      <div className="mb-2 flex flex-col items-center justify-center px-4 pb-16 lg:pb-0">
        <div className="w-full max-w-6xl">
          {/* Mobile tabs */}
          <div className="mb-2 flex w-full items-center justify-center lg:hidden">
            <div className="flex w-full justify-start border-b border-gray-200">
              <nav className="-mb-px flex w-full space-x-2" aria-label="Tabs">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    className={classNames(
                      activeTab === tab.id
                        ? 'border-black text-black'
                        : 'border-transparent text-gray-500 hover:border-gray-200 hover:text-gray-700',
                      'flex w-full justify-center whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium',
                    )}
                    onClick={() => handleTabChange(tab.id)}
                    aria-current={activeTab === tab.id ? 'page' : undefined}
                  >
                    {tab.label}
                    <span
                      className={classNames(
                        activeTab === tab.id
                          ? 'bg-black text-gray-50'
                          : 'bg-gray-300 text-gray-900',
                        'ml-3 rounded-full py-0.5 px-2.5 text-xs font-medium',
                      )}
                    >
                      {tab.id === 'available'
                        ? availableChallenges.length
                        : enrolledChallenges.length}
                    </span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Desktop tabs */}
          <div className="mt-2 hidden w-full items-center justify-between lg:flex">
            <nav className="flex space-x-4" aria-label="Tabs">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  className={classNames(
                    activeTab === tab.id
                      ? 'bg-gray-200 text-gray-800'
                      : 'text-gray-600 hover:text-gray-800',
                    'rounded-md px-3 py-2 text-sm font-medium',
                  )}
                  onClick={() => handleTabChange(tab.id)}
                  aria-current={activeTab === tab.id ? 'page' : undefined}
                >
                  {tab.label}
                  <span
                    className={classNames(
                      activeTab === tab.id ? 'bg-black text-gray-50' : 'bg-gray-300 text-gray-800',
                      'ml-3 rounded-full py-0.5 px-2.5 text-xs font-medium',
                    )}
                  >
                    {tab.id === 'available'
                      ? availableChallenges.length
                      : enrolledChallenges.length}
                  </span>
                </button>
              ))}
            </nav>

            {/* <div className="flex items-center gap-4 text-sm">
              <p>
                Showing 1 to 10 of 20 results
              </p>
              <Button variant="inverse">Prev</Button>
              <Button variant="inverse">Next</Button>
            </div> */}
          </div>

          <div className="lg:grid lg:grid-cols-7 lg:gap-4 lg:pt-2">
            <div className="min-w-[250px] lg:col-span-2 lg:px-0">
              <div className="my-2 flex flex-col items-center justify-between lg:hidden">
                <SmallFilterGroup />
              </div>
              <div className="hidden lg:block">
                <ChallengesFilterGroup showTitle />
              </div>
            </div>
            {!showEmptyState && (
              <div className="w-full lg:col-span-5">
                <ChallengesViewTopBar className="mb-2 items-start px-0" />
                <ul
                  role="list"
                  className="divide-y divide-gray-200 overflow-hidden rounded-md bg-white shadow"
                >
                  {isLoading && [...Array(3)].map((_, i) => <ChallengeRowSkeleton key={i} />)}
                  {showChallenges &&
                    challenges.map((challenge) => (
                      <ChallengeListRow
                        key={challenge.id}
                        challenge={challenge}
                        onClick={() => setModalChallengeId(challenge.id)}
                      />
                    ))}
                </ul>
              </div>
            )}
            {showEmptyState && (
              <div className="flex h-96 w-full flex-col items-center justify-center lg:col-span-5">
                <p className="text-center text-neutral-500">
                  {t('challenges.overview.noChallengesFound')}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 flex h-16 w-screen items-center justify-between gap-2 border-t-2 border-neutral-200 bg-neutral-100 p-3 shadow lg:hidden">
        <Button variant="inverse">Prev</Button>
        <p className="text-xs">
          {/* TODO remove placeholder */}
          Showing 1 to 10 of 20 results
        </p>
        <Button variant="inverse">Next</Button>
      </div>

      <ChallengeDetailsModal
        challengeId={modalChallengeId}
        onExit={() => setModalChallengeId('')}
        isAlreadyEnrolled={activeTab === 'joined'}
      />
    </>
  );
};

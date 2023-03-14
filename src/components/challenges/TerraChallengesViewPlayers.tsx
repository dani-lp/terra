import * as React from 'react';
import { Button } from '@/components/common';
import { ChallengeDetailsModal } from '@/components/challenges/ChallengeDetailsModal';
import { ChallengeListEntry, ChallengesFilterGroup } from '@/components/challenges';
import { classNames } from '@/const';
import { ChallengeRowSkeleton } from '@/components/challenges/ChallengeRowSkeleton';
import { SmallFilterGroup } from '@/components/challenges/SmallFilterGroup';
import { ChallengesViewTopBar } from '@/components/challenges/ChallengesViewTopBar';
import { useChallenges } from '@/components/challenges/hooks/useChallenges';
import { trpc } from '@/utils/trpc';

// TODO translations
const tabs = [
  { id: 'available-tab', label: 'Available challenges', count: 235 },
  { id: 'active-tab', label: 'Active challenges', count: 12 },
] as const;

export const TerraChallengesViewPlayers = () => {
  const [activeTab, setActiveTab] = React.useState<typeof tabs[number]['id']>(tabs[0].id);
  const { filteredChallenges, isLoading, isError, error } = useChallenges(
    trpc.challenges.available,
  );

  if (error) {
    console.error(error.message);
    throw new Error(error.message);
  }

  return (
    <>
      <ChallengesViewTopBar />

      <div className="flex flex-col items-center justify-center px-4">
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
                    onClick={() => setActiveTab(tab.id)}
                    aria-current={activeTab === tab.id ? 'page' : undefined}
                  >
                    {tab.label}
                    {/* {tab.count ? (
                    <span
                      className={classNames(
                        activeTab === tab.id ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-900',
                        'ml-3 rounded-full py-0.5 px-2.5 text-xs font-medium'
                      )}
                    >
                      {tab.count}
                    </span>
                  ) : null} */}
                  </button>
                ))}
              </nav>
            </div>
          </div>

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
                  onClick={() => setActiveTab(tab.id)}
                  aria-current={activeTab === tab.id ? 'page' : undefined}
                >
                  {tab.label}
                </button>
              ))}
            </nav>

            <div className="flex items-center gap-4 text-sm">
              <p>
                {/* TODO remove placeholder */}
                Showing 1 to 10 of 20 results
              </p>
              <Button variant="inverse">Prev</Button>
              <Button variant="inverse">Next</Button>
            </div>
          </div>

          <div className="flex flex-col xl:flex-row xl:gap-4 xl:pt-2">
            <div className="min-w-[250px] xl:px-0">
              <div className="my-2 flex flex-col items-center justify-between xl:hidden">
                <SmallFilterGroup />
              </div>
              <div className="hidden xl:block">
                <ChallengesFilterGroup showTitle />
              </div>
            </div>
            <div className="w-full">
              <ul
                role="list"
                className="divide-y divide-gray-200 overflow-hidden rounded-md bg-white shadow"
              >
                {isLoading && [...Array(3)].map((_, i) => <ChallengeRowSkeleton key={i} />)}
                {!isLoading &&
                  !isError &&
                  filteredChallenges.map((challenge) => (
                    <ChallengeListEntry key={challenge.id} challenge={challenge} />
                  ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 flex h-16 w-screen items-center justify-between gap-2 border-t-2 border-neutral-200 p-3 shadow lg:hidden">
        <Button variant="inverse">Prev</Button>
        <p className="text-xs">
          {/* TODO remove placeholder */}
          Showing 1 to 10 of 20 results
        </p>
        <Button variant="inverse">Next</Button>
      </div>

      <ChallengeDetailsModal />
    </>
  );
};

import * as React from 'react';
import { Button } from '@/components/common';
import { SearchBar } from '@/components/common/form/SearchBar';
import { ChallengeDetailsModal } from '@/components/challenges/ChallengeDetailsModal';
import { ChallengeListEntry, type Challenge, ChallengesFilterGroup } from '@/components/challenges';
import {
  useChallengeSearch,
  useChallengeSearchActions,
  useChallengeSearchPlayerNumber,
  useChallengeSearchStatus,
} from '@/store/useChallengeSearchStore';
import { classNames } from '@/const';


const tempChallenges: Challenge[] = [
  { id: 1, name: 'Beach cleaning', players: 256, date: '2021-01-01', status: 'open' },
  { id: 2, name: 'Daily running', players: 2, date: '2021-08-02', status: 'ended' },
  { id: 3, name: 'Use sustainable transporting means', players: 5918270, date: '2022-08-02', status: 'open' },
  { id: 4, name: 'Cleaning litter inside campus', players: 270, date: '2022-08-02', status: 'open' },
];


// TODO extract
const SmallFilterGroup = () => {
  const search = useChallengeSearch();
  const { setSearchString } = useChallengeSearchActions();
  const [filtersOpen, setFiltersOpen] = React.useState(false);

  return (
    <>
      <SearchBar
        value={search}
        onChange={(e) => setSearchString(e.currentTarget.value)}
        placeholder="Search your challenges..." // TODO i18n
        className="mb-0"
        withButton
        squaredBottom={filtersOpen}
        buttonText="Filters"
        buttonVariant={filtersOpen ? 'primary' : 'inverse'}
        onClick={() => setFiltersOpen(!filtersOpen)}
      />
      {filtersOpen && <ChallengesFilterGroup className="w-full rounded-t-none" />}
    </>
  )
};


// TODO translations
const tabs = [
  { id: 'available-tab', label: 'Available challenges', count: 235 },
  { id: 'active-tab', label: 'Active challenges', count: 12 },
] as const;

export const TerraChallengesViewPlayers = () => {
  const [challenges] = React.useState<Challenge[]>(tempChallenges);
  const search = useChallengeSearch();
  const playerNumber = useChallengeSearchPlayerNumber();
  const challengeStatus = useChallengeSearchStatus();
  const { setSearchString } = useChallengeSearchActions();

  const [activeTab, setActiveTab] = React.useState<typeof tabs[number]['id']>(tabs[0].id);

  const filteredChallenges = challenges
    .filter((challenge) => !search ? challenges : challenge.name.toLowerCase().includes(search.toLowerCase()))
    .filter((challenge) => {
      switch (challengeStatus.id) {
        case 'open':
          return challenge.status === 'open';
        case 'ended':
          return challenge.status === 'ended';
        default:
          return true;
      }
    })
    .filter((challenge) => challenge.players > playerNumber);

  return (
    <>
      {/* Top bar */}
      <div className="sticky top-0 z-10 hidden h-16 w-full justify-center bg-white px-4 shadow xl:flex">
        <div className="flex h-full w-full max-w-6xl items-center justify-between gap-2">
          <SearchBar
            value={search}
            onChange={(e) => setSearchString(e.currentTarget.value)}
            placeholder="Search your challenges..." // TODO i18n
            className="mb-0 h-10"
          />
        </div>
      </div>

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
                      'flex justify-center whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium w-full'
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
                    activeTab === tab.id ? 'bg-gray-200 text-gray-800' : 'text-gray-600 hover:text-gray-800',
                    'rounded-md px-3 py-2 text-sm font-medium'
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
              <Button variant="inverse">
                Prev
              </Button>
              <Button variant="inverse">
                Next
              </Button>
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
              <ul role="list" className="divide-y divide-gray-200 overflow-hidden rounded-md bg-white shadow">
                {filteredChallenges.map((challenge) => <ChallengeListEntry key={challenge.id} challenge={challenge} />)}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 flex h-16 w-screen items-center justify-between gap-2 border-t-2 border-neutral-200 p-3 shadow lg:hidden">
        <Button variant="inverse">
          Prev
        </Button>
        <p className="text-xs">
          {/* TODO remove placeholder */}
          Showing 1 to 10 of 20 results
        </p>
        <Button variant="inverse">
          Next
        </Button>
      </div>

      <ChallengeDetailsModal />
    </>
  );
};
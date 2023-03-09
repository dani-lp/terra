import * as React from 'react';
import { Button } from '@/components/common';
import { SearchBar } from '@/components/common/form/SearchBar';
import { ChallengeDetailsModal } from '@/components/challenges/ChallengeDetailsModal';
import {
  ChallengeListEntry,
  ChallengesFilterGroup,
  NewChallengeSlideOver,
} from '@/components/challenges';
import {
  useChallengeSearch,
  useChallengeSearchActions,
  useChallengeSearchPlayerNumber,
  useChallengeSearchStatus,
} from '@/store/useChallengeSearchStore';
import { trpc } from '@/utils/trpc';
import type { DisplayChallenge } from '@/types';
import { ChallengeRowSkeleton } from '@/components/challenges/ChallengeRowSkeleton';

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
  );
};

export const TerraChallengesViewOrgs = () => {
  const { data, isLoading, isError, error } = trpc.challenges.all.useQuery();
  const search = useChallengeSearch();
  const playerNumber = useChallengeSearchPlayerNumber();
  const challengeStatus = useChallengeSearchStatus();
  const { setSearchString } = useChallengeSearchActions();

  const challenges: DisplayChallenge[] =
    data?.map((challenge) => ({
      ...challenge,
      startDate: challenge.startDate.toLocaleDateString(),
      endDate: challenge.endDate.toLocaleDateString(),
      players: Math.random() * 10_000,
      status: Math.random() > 0.5 ? 'open' : 'ended',
    })) ?? [];

  const filteredChallenges = challenges
    .filter((challenge) =>
      !search ? challenges : challenge.name.toLowerCase().includes(search.toLowerCase()),
    )
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

  if (error) {
    console.error(error);
    throw new Error(error.message);
  }

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
          <NewChallengeSlideOver />
        </div>
      </div>

      {/* Main content */}
      <div className="flex items-center justify-center px-4">
        <div className="w-full max-w-6xl">
          <div className="flex flex-col xl:flex-row xl:gap-4 xl:pt-4">
            <div className="min-w-[250px] xl:px-0">
              <div className="mt-2 mb-3 flex flex-row items-center justify-between gap-2 xl:hidden xl:flex-col xl:items-start">
                <h1 className="text-2xl font-bold">Your challenges</h1>
                <Button size="sm" className="xl:w-full">
                  New
                </Button>
              </div>
              <div className="mb-2 flex flex-col items-center justify-between xl:hidden">
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

      <ChallengeDetailsModal />
    </>
  );
};

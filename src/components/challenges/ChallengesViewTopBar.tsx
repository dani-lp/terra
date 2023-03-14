import { NewChallengeSlideOver } from '@/components/challenges/NewChallengeSlideOver';
import { SearchBar } from '@/components/common/form/SearchBar';
import { useChallengeSearch, useChallengeSearchActions } from '@/store/useChallengeSearchStore';

type Props = {
  showNewChallengeButton?: boolean;
};

export const ChallengesViewTopBar = ({ showNewChallengeButton = false }: Props) => {
  const search = useChallengeSearch();
  const { setSearchString } = useChallengeSearchActions();

  return (
    <div className="sticky top-0 z-10 hidden h-16 w-full justify-center bg-white px-4 shadow xl:flex">
      <div className="flex h-full w-full max-w-6xl items-center justify-between gap-2">
        <SearchBar
          value={search}
          onChange={(e) => setSearchString(e.currentTarget.value)}
          placeholder="Search your challenges..." // TODO i18n
          className="mb-0 h-10"
        />
        {showNewChallengeButton && <NewChallengeSlideOver />}
      </div>
    </div>
  );
};

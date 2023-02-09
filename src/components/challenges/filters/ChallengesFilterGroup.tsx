import { classNames } from '@/const';
import { PlayersFilter } from './PlayersFilter';
import { StatusFilter } from './StatusFilter';
import { Button } from '@/components/common';
import { useChallengeSearchActions } from '@/store/useChallengeSearchStore';

type Props = {
  className?: string;
  showTitle?: boolean;
}

export const ChallengesFilterGroup = ({ className, showTitle = true}: Props) => {
  const { clearFilters } = useChallengeSearchActions();

  return (
    <div className={classNames('flex flex-col gap-4 rounded-lg bg-white p-4 shadow', className)}>
      <div className="flex items-center justify-between">
        {showTitle && <h2 className="text-lg font-medium">Filters</h2>}
        <Button size="sm" variant="inverse" onClick={clearFilters}>
          Clear filters
        </Button>
      </div>
      <div className="flex flex-col gap-4">
        <PlayersFilter />
        <StatusFilter />
      </div>
    </div>
  );
};
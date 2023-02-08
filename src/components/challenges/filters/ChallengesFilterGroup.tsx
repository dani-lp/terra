import { PlayersFilter } from './PlayersFilter';

export const ChallengesFilterGroup = () => {
  return (
    <div className="flex flex-col rounded-lg bg-white p-4 shadow">
      <PlayersFilter />
    </div>
  );
};
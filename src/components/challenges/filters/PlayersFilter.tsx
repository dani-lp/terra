import { InputField } from '@/components/common';
import { useChallengeSearchPlayerNumber, useChallengeSearchActions } from '@/store/useChallengeSearchStore';

// TODO completely change this, use a slider
export const PlayersFilter = () => {
  const { setPlayerNumber } = useChallengeSearchActions();
  const playerNumber = useChallengeSearchPlayerNumber();

  return (
    <InputField
      type="number"
      label="Players"
      value={playerNumber}
      onChange={(e) => setPlayerNumber(Number(e.currentTarget.value))}
      placeholder="Min number of players..."
    />
  );
};
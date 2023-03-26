import { InputField } from '@/components/common';
import {
  useChallengeSearchPlayerNumber,
  useChallengeSearchActions,
} from '@/store/useChallengeSearchStore';

// TODO completely change this, use a slider
export const PlayersFilter = () => {
  const { setPlayerNumber } = useChallengeSearchActions();
  const playerNumber = useChallengeSearchPlayerNumber();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const newValue = Number(inputValue);

    if (!Number.isNaN(newValue)) {
      if (newValue >= 0) {
        setPlayerNumber(newValue);
      } else {
        setPlayerNumber(0);
      }
    }
  };

  const handleBlur = () => {
    if (!playerNumber || playerNumber === 0) {
      setPlayerNumber('');
    }
  };

  return (
    <InputField
      type="number"
      label="Players"
      value={playerNumber}
      onChange={handleChange}
      onBlur={handleBlur}
      placeholder={playerNumber === 0 ? '0' : 'Min number of players...'}
    />
  );
};

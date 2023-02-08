import { InputField } from '@/components/common';

// TODO completely change this, use a slider
export const PlayersFilter = () => {
  return (
    <div className="">
      <InputField
        label="Players"
        placeholder="Min number of players..."
      />
    </div>
  );
};
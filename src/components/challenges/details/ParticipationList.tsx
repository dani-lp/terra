import { ParticipationListRow } from '@/components/challenges/details/ParticipationListRow';
import { Button, Toggle } from '@/components/common';
import { PlayerDetailsSlideOver } from '@/components/users';
import { trpc } from '@/utils/trpc';
import { useTranslation } from 'next-i18next';
import * as React from 'react';

type Props = {
  challengeId: string;
};

export const ParticipationList = ({ challengeId }: Props) => {
  const { t } = useTranslation('challenges');
  const [editEnabled, setEditEnabled] = React.useState(false);
  const [checkedStates, setCheckedStates] = React.useState<{ [key: string]: boolean }>({});
  const [overviewPlayerId, setOverviewPlayerId] = React.useState<string | null>(null);
  const { data } = trpc.participation.getAllByChallenge.useQuery({
    challengeId,
  });
  const utils = trpc.useContext();
  const updateParticipationValidityMutation = trpc.participation.updateValidityOfMany.useMutation({
    onSuccess: async () => {
      await utils.participation.getAllByChallenge.invalidate();
    },
  });

  const participations = React.useMemo(() => data ?? [], [data]);

  React.useEffect(() => {
    setCheckedStates(
      participations.reduce((acc: typeof checkedStates, curr) => {
        acc[curr.participation.id] = curr.participation.isValid;
        return acc;
      }, {}),
    );
  }, [participations]);

  const handleSave = async () => {
    const participationsToUpdate = participations
      .filter((entry) => checkedStates[entry.participation.id] !== entry.participation.isValid)
      .map((entry) => ({
        id: entry.participation.id,
        isValid: checkedStates[entry.participation.id] ?? false,
      }));

    await updateParticipationValidityMutation.mutateAsync({
      participations: participationsToUpdate,
    });

    setEditEnabled(false);
  };

  return (
    <>
      <div>
        <div className="mt-1 mb-2 flex items-center justify-between px-4">
          <div className="flex items-center justify-center gap-4">
            <span className="cursor-pointer" onClick={() => setEditEnabled(!editEnabled)}>
              {t('challenges.details.enableEdition')}
            </span>
            <Toggle
              enabled={editEnabled}
              setEnabled={setEditEnabled}
              disabled={updateParticipationValidityMutation.isLoading}
            />
          </div>
          <Button
            size="sm"
            onClick={handleSave}
            disabled={!editEnabled || updateParticipationValidityMutation.isLoading}
          >
            {t('challenges.details.save')}
          </Button>
        </div>
        <ul>
          {participations.map((entry) => (
            <ParticipationListRow
              key={entry.participation.id}
              participation={entry.participation}
              image={entry.playerData.image ?? ''}
              name={entry.playerData.name}
              username={entry.playerData.username}
              onUsernameClick={() => setOverviewPlayerId(entry.playerData.id)}
              disabled={!editEnabled}
              checked={checkedStates[entry.participation.id] ?? false}
              setChecked={(enabled) => {
                setCheckedStates((prev) => ({
                  ...prev,
                  [entry.participation.id]: enabled,
                }));
              }}
            />
          ))}
        </ul>
      </div>
      <PlayerDetailsSlideOver
        open={overviewPlayerId !== null}
        setOpen={() => setOverviewPlayerId(null)}
        playerId={overviewPlayerId}
      />
    </>
  );
};

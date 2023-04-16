type Props = {
  challengeId: string | string[] | undefined;
};

export const ChallengeDetailsView = ({ challengeId }: Props) => {
  if (!challengeId || Array.isArray(challengeId)) {
    // TODO error page
    return null;
  }

  return <h1>Challenge placeholder - {challengeId}</h1>;
};

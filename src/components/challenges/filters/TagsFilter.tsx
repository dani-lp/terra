import { ChallengeTagSelector } from '@/components/common';
import { useChallengeSearchActions, useChallengeSearchTags } from '@/store/useChallengeSearchStore';

export const TagsFilter = () => {
  const tags = useChallengeSearchTags();
  const { setTags } = useChallengeSearchActions();

  return (
    <ChallengeTagSelector selectedTags={tags} setSelectedTags={setTags} />
  );
};
const pointsPerLevel = (level: number) => {
  switch (level) {
    case 1:
      return 0;
    case 2:
      return 10;
    case 3:
      return 25;
    case 4:
      return 45;
    case 5:
      return 75;
    case 6:
      return 125;
    case 7:
      return 205;
    case 8:
      return 355;
    case 9:
      return 655;
    case 10:
      return 1305;
    default:
      return 0;
  }
};

export const getLevelProgression = (xpPoints: number) => {
  let level = 1;

  while (xpPoints >= pointsPerLevel(level + 1) && level <= 10) {
    level++;
  }

  if (level >= 10) {
    return { level: 10, currentPoints: 0 };
  }

  return { level, currentPoints: xpPoints - pointsPerLevel(level) };
};

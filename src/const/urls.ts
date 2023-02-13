export const commonUrls = {
  HOME: '/',
  CHALLENGES: '/challenges',
} as const;

export const playerUrls = {
  ...commonUrls,
  ORGANIZATIONS: '/organizations',
} as const;

export const orgUrls = {
  ...commonUrls,
  DRAFTS: '/drafts',
} as const;

export const adminUrls = {
  ...commonUrls,
  ORGANIZATIONS: '/organizations',
} as const;

export const urls = {
  ...commonUrls,
  ...playerUrls,
  ...orgUrls,
  ...adminUrls,
  PROFILE: '/profile',
  DEVELOPMENT: '/dev',
} as const;
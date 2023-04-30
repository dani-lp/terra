import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(...inputs));

export const sanitizeWebsite = (website: string) => {
  if (!website.startsWith('http://') && !website.startsWith('https://')) {
    website = `https://${website}`;
  }
  return website;
};

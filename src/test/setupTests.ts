import matchers from '@testing-library/jest-dom/matchers';
import { expect, vitest } from 'vitest';

expect.extend(matchers);

vitest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: {
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      changeLanguage: () => new Promise(() => {}),
    },
  }),
}));
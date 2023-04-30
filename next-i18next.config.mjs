import path from 'path';

const config = {
  debug: false,
  reloadOnPrerender: process.env.NODE_ENV === 'development',
  i18n: {
    locales: ['en'],
    defaultLocale: 'en',
  },
  localePath: path.resolve('./public/locales'),
};

export default config;
import path from 'path';

const config = {
  debug: process.env.NODE_ENV === 'development',
  reloadOnPrerender: process.env.NODE_ENV === 'development',
  i18n: {
    locales: ['en'],
    defaultLocale: 'en',
    ns: ['common', 'navigation', 'challenges']
  },
  localePath: path.resolve('./public/locales'),
};

export default config;
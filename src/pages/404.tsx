import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import nextI18nConfig from '@/../next-i18next.config.mjs';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';

const Custom404 = () => {
  const router = useRouter();
  const { t } = useTranslation('errorPages');

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => { 
    e.preventDefault();
    router.back();
  };

  return (
    <>
      <Head>
        <html className="h-full" />
        <body className="h-full" />
        <title>{t('404.tabTitle')}</title>
      </Head>
      <main className="grid min-h-full place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8">
        <div className="text-center">
          <p className="text-base font-semibold text-indigo-600">404</p>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            {t('404.pageNotFound')}
          </h1>
          <p className="mt-6 text-base leading-7 text-gray-600">{t('404.msg')}</p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <a href="#" onClick={handleClick} className="text-sm font-semibold text-gray-900">
              <span className="mr-2" aria-hidden="true">&larr;</span>
              {t('404.back')}
            </a>
            <Link
              href="/"
              className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              {t('404.home')}
            </Link>
          </div>
        </div>
      </main>
    </>
  );
};

export default Custom404;

export const getStaticProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['errorPages'], nextI18nConfig, ['en'])),
  },
});

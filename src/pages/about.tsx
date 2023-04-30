import { CheckCircleIcon } from '@heroicons/react/20/solid';
import type { GetServerSidePropsContext } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';

import nextI18nConfig from '@/../next-i18next.config.mjs';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import type { NextPageWithLayout } from './_app';

const About: NextPageWithLayout = () => {
  const { t } = useTranslation('about');
  const { data: session, status } = useSession();

  const isLoading = status === 'loading';

  return (
    <>
      <Head>
        <title>{t('title')}</title>
      </Head>
      <div className="bg-white px-6 py-32 lg:px-8">
        <header className="absolute inset-x-0 top-0 z-50">
          <nav
            className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8"
            aria-label="Global"
          >
            <div className="flex lg:flex-1">
              <Link href="/" className="-m-1.5 p-1.5">
                <span className="sr-only">Terra</span>
                <Image className="h-8 w-auto" height={32} width={32} src="/logo.png" alt="" />
              </Link>
            </div>
            {!isLoading && (
              <div className="flex flex-1 justify-end">
                <Link
                  href={session ? '/' : '/auth/signin'}
                  className="text-sm font-semibold leading-6 text-gray-900"
                >
                  {session ? t('home') : t('signIn')} <span aria-hidden="true">&rarr;</span>
                </Link>
              </div>
            )}
          </nav>
        </header>
        <div className="mx-auto max-w-3xl text-base leading-7 text-gray-700">
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            {t('header')}
          </h1>
          <p className="mt-6 text-xl leading-8">{t('subtitle')}</p>
          <div className="mt-10 max-w-2xl">
            <p>{t('introduction.first')}</p>
            <ul role="list" className="mt-8 max-w-xl space-y-8 text-gray-600">
              <li className="flex gap-x-3">
                <CheckCircleIcon
                  className="mt-1 h-5 w-5 flex-none text-indigo-600"
                  aria-hidden="true"
                />
                <span>
                  <strong className="font-semibold text-gray-900">
                    {t('introduction.challengesLabel')}.
                  </strong>
                  {t('introduction.challenges')}
                </span>
              </li>
              <li className="flex gap-x-3">
                <CheckCircleIcon
                  className="mt-1 h-5 w-5 flex-none text-indigo-600"
                  aria-hidden="true"
                />
                <span>
                  <strong className="font-semibold text-gray-900">
                    {t('introduction.securityLabel')}.
                  </strong>
                  {t('introduction.security')}
                </span>
              </li>
              <li className="flex gap-x-3">
                <CheckCircleIcon
                  className="mt-1 h-5 w-5 flex-none text-indigo-600"
                  aria-hidden="true"
                />
                <span>
                  <strong className="font-semibold text-gray-900">
                    {t('introduction.constantUpdatesLabel')}.
                  </strong>
                  {t('introduction.constantUpdates')}
                </span>
              </li>
            </ul>
            <p className="mt-8">{t('introduction.motivation')}</p>
            <h2 className="mt-16 text-2xl font-bold tracking-tight text-gray-900">
              {t('players.title')}
            </h2>
            <p className="mt-6">{t('players.text')}</p>
          </div>
          <div className="mt-16 max-w-2xl">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">{t('orgs.title')}</h2>
            <p className="mt-6">{t('orgs.text')}</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default About;

export const getStaticProps = async (context: GetServerSidePropsContext) => ({
  props: {
    ...(await serverSideTranslations(context.locale ?? '', ['about'], nextI18nConfig, ['en'])),
  },
});

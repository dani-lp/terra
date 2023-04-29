import { ChevronLeftIcon } from '@heroicons/react/20/solid';
import type { GetServerSidePropsContext, NextPage } from 'next';
import { getSession, signIn } from 'next-auth/react';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { Inter } from 'next/font/google';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';

import nextI18nConfig from '@/../next-i18next.config.mjs';
import googleLogo from '@/../public/google-logo.png';
import { Button } from '@/components/common/';
import { classNames } from '@/const';

const inter = Inter({ subsets: ['latin'] });

const SignInOrgs: NextPage = () => {
  const { t } = useTranslation('auth');

  return (
    <>
      <Head>
        <title>{t('title')}</title>
      </Head>
      <main
        className={classNames(
          'flex min-h-screen w-full items-center justify-center px-4 pt-16',
          inter.className,
        )}
      >
        <Link
          href="/"
          className="absolute top-4 left-1 inline-flex h-10 items-center justify-center rounded-lg bg-transparent py-2 px-4 text-sm font-medium transition-colors hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=open]:bg-transparent sm:left-4 md:top-8 md:left-8"
        >
          <ChevronLeftIcon className="h-5 w-5" />
          {t('back')}
        </Link>
        <div className="-mt-28 flex w-full max-w-xs flex-col items-center justify-center text-center">
          <Link href="/">
            <Image src="/logo.png" alt="logo" width={60} height={60} className="mb-4" />
          </Link>
          <h1 className="mb-2 text-4xl font-bold">{t('messagesOrgs.requestAccess')}</h1>
          <span className="text-neutral-500">{t('messagesOrgs.orgRegistrationConfirm')}</span>
          <Link
            href="/about"
            className="mt-1 mb-4 font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
          >
            {t('messagesOrgs.readTerms')}
          </Link>

          <Button
            type="button"
            variant="inverse"
            onClick={() => signIn('google', { callbackUrl: '/organizations/new' })}
            className="mb-4 w-full"
          >
            <div className="mr-2 flex items-center justify-center rounded-full bg-white p-1">
              <Image src={googleLogo} alt="Google" height={20} width={20} />
            </div>
            Google
          </Button>
          <p className="text-sm text-neutral-500">{t('messages.moreProviders')}</p>

          <div className="mt-4 w-full border-t border-neutral-200"></div>
          <p className="mt-6 text-center text-sm text-gray-500">
            {t('messages.isPlayer')}{' '}
            <Link
              href="/auth/signin"
              className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
            >
              {t('messages.linkToOrg')}
            </Link>
          </p>
        </div>
      </main>
    </>
  );
};

export default SignInOrgs;

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const session = await getSession(context);

  if (session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  return {
    props: {
      ...(await serverSideTranslations(context.locale ?? '', ['auth'], nextI18nConfig, ['en'])),
    },
  };
};

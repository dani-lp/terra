import { ChevronLeftIcon } from '@heroicons/react/20/solid';
import type { NextPage } from 'next';
import { signIn, signOut, useSession } from 'next-auth/react';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { Inter } from 'next/font/google';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';

import nextI18nConfig from '@/../next-i18next.config.mjs';
import googleLogo from '@/../public/google-logo.png';
import { Button, InputField } from '@/components/common/';
import { classNames } from '@/const';

const inter = Inter({ subsets: ['latin'] });

const SignIn: NextPage = () => {
  const { t } = useTranslation('auth');
  const { data: session, status } = useSession();

  return (
    <>
      <Head>
        <title>Sign in to Terra</title>
      </Head>
      <main
        className={classNames(
          'flex min-h-screen w-full items-center justify-center pt-16',
          inter.className,
        )}
      >
        <Link
          href="/"
          className="absolute top-4 left-4 inline-flex h-10 items-center justify-center rounded-lg bg-transparent py-2 px-4 text-sm font-medium transition-colors hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=open]:bg-transparent md:top-8 md:left-8"
        >
          <ChevronLeftIcon className="h-5 w-5" />
          {t('auth.actions.back')}
        </Link>
        <div className="-mt-28 flex w-full max-w-xs flex-col items-center justify-center">
          <Link href="/">
            <Image src="/logo.png" alt="logo" width={60} height={60} className="mb-4" />
          </Link>
          <h1 className="mb-2 text-4xl font-bold">{t('auth.messages.welcomeBack')}</h1>
          <span className="mb-2 text-neutral-500">{t('auth.messages.enterEmail')}</span>
          <span className="mb-4 text-neutral-400">Your current status is: {status}</span>
          <InputField placeholder="email@example.com" disabled wrapperClassName="w-full mb-2" />
          <Button className="w-full" disabled>
            {t('auth.messages.signInWithEmail')}
          </Button>
          <div className="my-4 w-full border-t-2 border-neutral-200"></div>
          <Button
            type="button"
            variant="inverse"
            onClick={() => signIn('google', { callbackUrl: '/dev' })}
            className="mb-4 w-full"
          >
            <div className="mr-2 flex items-center justify-center rounded-full bg-white p-1">
              <Image src={googleLogo} alt="Google" height={20} width={20} />
            </div>
            Google
          </Button>
          {session?.user?.name && (
            <>
              <span className="mb-2">Welcome, {session?.user?.name}</span>
              <Button onClick={() => signOut({ callbackUrl: '/dev' })}>
                {t('auth.messages.signOut')}
              </Button>
            </>
          )}
        </div>
      </main>
    </>
  );
};

export default SignIn;

export const getServerSideProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['auth'], nextI18nConfig, ['en'])),
  },
});

import { classNames } from '@/const';
import type { NextPage } from 'next';
import { Inter } from '@next/font/google';
import Image from 'next/image';
import { Button, InputField } from '@/components/common/';
import { signIn, signOut, useSession } from 'next-auth/react';

import googleLogo from '@/../public/google-logo.png';
import Head from 'next/head';

const inter = Inter();

const SignIn: NextPage = () => {
  const { data: session, status } = useSession();

  return (
    <>
      <Head>
        <title>Sign in to Terra</title>
      </Head>
      <main className={classNames(
        'w-full flex items-center justify-center pt-16',
        inter.className,
      )}>
        <div className="flex w-full max-w-xs flex-col items-center justify-center">
          <Image src="/logo.png" alt="logo" width={60} height={60} className="mb-4" />
          <h1 className="mb-2 text-4xl font-bold">Welcome back!</h1>
          <span className="mb-2 text-neutral-500">Enter you email to sign in to your account</span>
          <span className="mb-4 text-neutral-400">Your current status is: {status}</span>
          <InputField placeholder='email@example.com' disabled wrapperClassName="w-full mb-2" />
          <Button className="w-full" disabled>Sign in with Email</Button>
          <div className="my-4 w-full border-t-2 border-neutral-200"></div>
          <Button
            type="button"
            variant="inverse"
            onClick={() => signIn('google', { callbackUrl: '/dev' })}
            className="mb-4 w-full"
          >
            <div className="mr-2 flex items-center justify-center rounded-full bg-white p-1">
              <Image
                src={googleLogo}
                alt="Google"
                height={20}
                width={20}
              />
            </div>
            Google
          </Button>
          {session?.user?.name && (
            <>
              <span className="mb-2">Welcome, {session?.user?.name}</span>
              <Button onClick={() => signOut({ callbackUrl: '/dev' })}>Sign out</Button>
            </>
          )}
        </div>
      </main>
    </>
  );
};

export default SignIn;
import { classNames } from '@/const';
import type { NextPage } from 'next';
import { Inter } from '@next/font/google';
import Image from 'next/image';
import { Button, InputField } from '@/components/common/';
import { signIn, signOut, useSession } from 'next-auth/react';

import googleLogo from '@/../public/google-logo.png';

const inter = Inter();

const SignIn: NextPage = () => {
  const { data: session, status } = useSession();

  return (
    <main className={classNames(
      'w-full flex items-center justify-center pt-16',
      inter.className,
    )}>
      <div className="flex flex-col items-center justify-center max-w-xs w-full">
        <Image src="/logo.png" alt="logo" width={60} height={60} className="mb-4" />
        <h1 className="font-bold text-4xl mb-2">Welcome back!</h1>
        <span className="text-neutral-500 mb-2">Enter you email to sign in to your account</span>
        <span className="text-neutral-400 mb-4">Your current status is: {status}</span>
        <InputField placeholder='email@example.com' disabled wrapperClassName="w-full" />
        <Button className="w-full" disabled>Sign in with Email</Button>
        <div className="w-full border-t-2 border-neutral-200 my-4"></div>
        <Button
          type="button"
          variant="inverse"
          onClick={() => signIn('google', { callbackUrl: '/dev' })}
          className="w-full mb-4"
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
  );
};

export default SignIn;
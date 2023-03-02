import * as React from 'react';
import {
  Button,
  MainLayout,
  SelectField,
  type SelectOption
} from '@/components/common';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';
import Link from 'next/link';
import { trpc } from '@/utils/trpc';

import type { NextPageWithLayout } from '../_app';
import nextI18nConfig from '@/../next-i18next.config.mjs';
import { Role } from '@prisma/client';
import { useSession } from 'next-auth/react';

const selectOptions: SelectOption[] = [
  {
    id: Role.ADMIN,
    label: 'Administrator',
  },
  {
    id: Role.ORGANIZATION,
    label: 'Organization',
  },
  {
    id: Role.PLAYER,
    label: 'Player',
  },
];

const Dev: NextPageWithLayout = () => {
  const { data: session, status } = useSession();
  const [selectedRoleOption, setSelectedRoleOption] = React.useState<SelectOption>(
    selectOptions.find((option) => option.id === session?.user?.role) ??
    { id: 'ADMIN', label: 'Admin' }
  );
  const roleMutation = trpc.dev.changeRole.useMutation();

  const handleRoleChange = () => {
    roleMutation.mutate({ role: selectedRoleOption.id as Role });
  };

  React.useEffect(() => {
    if (status === 'authenticated') {
      setSelectedRoleOption(
        selectOptions.find((option) => option.id === session?.user?.role) ??
        { id: 'ADMIN', label: 'Admin' }
      );
    }
  }, [status, session?.user?.role]);

  return (
    <>
      <Head>
        <title>Development - Terra</title>
      </Head>
      <div className='mb-4 flex h-full w-full flex-col items-start justify-start gap-4 p-2'>
        {status === 'unauthenticated' && (
          <Link href="/auth/signin">
            <Button>Sign in</Button>
          </Link>
        )}
        {status === 'authenticated' && (
          <div className="mt-4">
            <SelectField
              options={selectOptions}
              selected={selectedRoleOption}
              setSelected={setSelectedRoleOption}
              className="mb-2"
            />
            <Button onClick={handleRoleChange}>Change role</Button>
          </div>
        )}
      </div>
    </>
  );
};

export default Dev;

Dev.getLayout = (page) => {
  return (
    <MainLayout>
      {page}
    </MainLayout>
  );
};

export const getServerSideProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await serverSideTranslations(
      locale,
      ['common', 'navigation'],
      nextI18nConfig,
      ['en']
    )),
  },
});
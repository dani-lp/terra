import { Button, MainLayout, SelectField, type SelectOption } from '@/components/common';
import { trpc } from '@/utils/trpc';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';
import Link from 'next/link';
import * as React from 'react';

import nextI18nConfig from '@/../next-i18next.config.mjs';
import { QUERY_PARAM_CALLBACK_URL } from '@/const/queryParams';
import { Role } from '@prisma/client';
import type { GetServerSidePropsContext } from 'next';
import { getSession, useSession } from 'next-auth/react';
import type { NextPageWithLayout } from '../_app';

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
    selectOptions.find((option) => option.id === session?.user?.role) ?? {
      id: 'ADMIN',
      label: 'Admin',
    },
  );
  const roleMutation = trpc.dev.changeRole.useMutation({
    onSuccess: () => {
      window.location.reload();
    },
  });

  React.useEffect(() => {
    if (status === 'authenticated') {
      setSelectedRoleOption(
        selectOptions.find((option) => option.id === session?.user?.role) ?? {
          id: 'ADMIN',
          label: 'Admin',
        },
      );
    }
  }, [status, session?.user?.role]);

  const handleRoleChange = () => {
    roleMutation.mutate({ role: selectedRoleOption.id as Role });
  };

  if (process.env.NODE_ENV !== 'development') {
    return <div>Not available</div>;
  }

  return (
    <>
      <Head>
        <title>Development - Terra</title>
      </Head>
      <div className="mb-4 flex h-full w-full flex-col items-start justify-start gap-4 p-2">
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
            <Button onClick={handleRoleChange} disabled={roleMutation.isLoading}>
              Change role
            </Button>
          </div>
        )}
      </div>
    </>
  );
};

export default Dev;

Dev.getLayout = (page) => {
  return <MainLayout>{page}</MainLayout>;
};

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: `/auth/signin?${QUERY_PARAM_CALLBACK_URL}=${context.resolvedUrl}`,
        permanent: false,
      },
    };
  }

  return {
    props: {
      ...(await serverSideTranslations(
        context.locale ?? '',
        ['common', 'navigation'],
        nextI18nConfig,
        ['en'],
      )),
    },
  };
};

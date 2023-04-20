import {
  OrgDetailsHeader,
  OrgDetailsMobileContent,
  OrgsDetailsHeaderSkeleton,
} from '@/components/organizations/details';
import { trpc } from '@/utils/trpc';
import Head from 'next/head';

type Props = {
  orgDetailsId: string | undefined;
};

export const OrgDetailsView = ({ orgDetailsId }: Props) => {
  const { data, isLoading, isError, error } = trpc.user.getOrgDetails.useQuery({
    orgDetailsId: orgDetailsId ?? '',
  });

  if (isError) {
    // TODO error page
    console.error(error);
    return null;
  }

  return (
    <>
      <Head>
        <title>Organization{data ? ` - ${data.orgDetails.name}` : ''}</title>
      </Head>
      <div className="overflow-hidden">
        <div className="md:grid md:grid-cols-2 md:gap-4 md:p-4 lg:gap-8">
          <div className="flex flex-col gap-2 md:col-span-1 md:max-w-md">
            {isLoading && <OrgsDetailsHeaderSkeleton />}
            {!isLoading && data !== null && (
              <OrgDetailsHeader
                org={data.orgDetails}
                about={data.about}
                challengeCount={data.challengeCount}
              />
            )}
          </div>

          {/* <div className="hidden rounded-lg bg-white px-4 py-6 shadow md:col-span-1 md:block">
            <h3 className="mb-2 ml-3 text-lg font-semibold leading-5 text-gray-900">Leaderboard</h3>
            <LeaderBoardList loading={isLoading} />
          </div> */}
        </div>

        <OrgDetailsMobileContent orgDetailsId={orgDetailsId ?? ''} />
      </div>
    </>
  );
};

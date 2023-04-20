import Image from 'next/image';
import Link from 'next/link';

import { AllOrgsListSkeleton } from '@/components/organizations/AllOrgsListSkeleton';
import { trpc } from '@/utils/trpc';
import type { OrganizationData } from '@prisma/client';

type Props = {
  searchString: string;
};

type OrganizationGrouping = Record<string, OrganizationData[]>;

const filterOrgs = (record: OrganizationGrouping, searchString: string): OrganizationGrouping => {
  const filteredRecord: OrganizationGrouping = {};

  for (const [key, orgDataArray] of Object.entries(record)) {
    const filteredOrgDataArray = orgDataArray.filter((orgData) =>
      orgData.name.toLowerCase().includes(searchString.toLowerCase()),
    );

    if (filteredOrgDataArray.length > 0) {
      filteredRecord[key] = filteredOrgDataArray;
    }
  }

  return filteredRecord;
};

export const AllOrgsList = ({ searchString }: Props) => {
  const { data, isLoading, isError, error } = trpc.user.getAllOrgsData.useQuery();

  if (isLoading) {
    return <AllOrgsListSkeleton />;
  }

  if (isError) {
    // TODO
    console.error(error);
    return null;
  }

  const unfilteredOrgs: NonNullable<typeof data> = data ?? {};

  // filter orgs by search string; remove keys with no orgs inside
  const orgs = filterOrgs(unfilteredOrgs, searchString);

  return (
    <nav className="h-full w-full overflow-y-auto" aria-label="Directory">
      {orgs &&
        Object.keys(orgs).map((letter) => (
          <div key={letter} className="relative">
            <div className="sticky top-0 z-10 border-y border-b-gray-200 border-t-gray-100 bg-white px-3 py-1.5 text-sm font-semibold leading-6 text-gray-900 md:rounded-lg md:shadow-sm">
              <h3>{letter}</h3>
            </div>
            <ul role="list" className="divide-y divide-gray-100">
              {orgs[letter]?.map((org) => (
                <li key={org.id}>
                  <Link
                    href={`/organizations/${org.id}`}
                    className="flex gap-x-4 px-3 py-5 transition-colors hover:bg-gray-200 md:rounded-lg"
                  >
                    <Image
                      className="h-12 w-12 flex-none rounded-full bg-gray-50"
                      height={48}
                      width={48}
                      src={org.image}
                      alt=""
                    />
                    <div className="min-w-0">
                      <p className="text-sm font-semibold leading-6 text-gray-900">{org.name}</p>
                      <a
                        href={org.website}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-1 truncate text-xs leading-5 text-gray-500 hover:underline"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {org.website}
                      </a>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
    </nav>
  );
};

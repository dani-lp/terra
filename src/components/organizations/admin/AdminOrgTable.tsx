import { UserCircleIcon } from '@heroicons/react/24/solid';
import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import * as React from 'react';

import { Chip } from '@/components/common';
import { Skeleton } from '@/components/common/skeleton';
import { OrganizationDetailsSlideOver } from '@/components/organizations/admin/OrganizationDetailsSlideOver';
import { submissionStatusColors } from '@/const';
import { trpc } from '@/utils/trpc';

export const AdminOrgTable = () => {
  const { t } = useTranslation('orgs');
  const [selectedOrgId, setSelectedOrgId] = React.useState<string | null>(null);
  const { data, isLoading, isError, error } = trpc.auth.getAdminOrgData.useQuery();

  if (isError) {
    console.error(error);
    return null;
  }

  const organizations = data ?? [];

  return (
    <>
      <div className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-base font-semibold leading-6 text-gray-900">{t('admin.title')}</h1>
            <p className="mt-2 text-sm text-gray-700">{t('admin.subtitle')}</p>
          </div>
        </div>
        <div className="mt-6 flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <table className="min-w-full divide-y divide-gray-300">
                <thead>
                  <tr>
                    <th
                      scope="col"
                      className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                    >
                      {t('admin.tableHeading.name')}
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      {t('admin.tableHeading.email')}
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      {t('admin.tableHeading.status')}
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      {t('admin.tableHeading.website')}
                    </th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                      <span className="sr-only">{t('admin.tableHeading.edit')}</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {isLoading &&
                    [...Array(4)].map((_, i) => (
                      <tr key={i}>
                        <td className="whitespace-nowrap py-5 pl-4 pr-3 text-sm sm:pl-0">
                          <div className="flex items-center">
                            <div className="h-11 w-11 shrink-0">
                              <UserCircleIcon
                                className="h-11 w-11 text-gray-300"
                                aria-hidden="true"
                              />
                            </div>
                            <div className="ml-4">
                              <div className="mb-2">
                                <Skeleton className="h-4 w-32" />
                              </div>
                              <Skeleton className="h-4 w-28" />
                            </div>
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                          <Skeleton className="h-4 w-36" />
                        </td>
                        <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                          <Skeleton rounded className="h-6 w-28" />
                        </td>
                        <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                          <Skeleton className="h-4 w-36" />
                        </td>
                        <td className="relative whitespace-nowrap py-5 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                          <Skeleton className="h-4 w-12" />
                        </td>
                      </tr>
                    ))}
                  {!isLoading &&
                    organizations.map((org) => (
                      <tr key={org.id}>
                        <td className="whitespace-nowrap py-5 pl-4 pr-3 text-sm sm:pl-0">
                          <div className="flex items-center">
                            <div className="h-11 w-11 shrink-0">
                              {org.image ? (
                                <Image
                                  className="h-11 w-11 rounded-full"
                                  height={44}
                                  width={44}
                                  src={org.image}
                                  alt=""
                                />
                              ) : (
                                <UserCircleIcon
                                  className="h-11 w-11 text-gray-300"
                                  aria-hidden="true"
                                />
                              )}
                            </div>
                            <div className="ml-4">
                              <div className="font-medium text-gray-900">{org.name}</div>
                              <div className="mt-1 text-gray-500">@{org.username}</div>
                            </div>
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                          <a
                            href={`mailto:${org.email}`}
                            className="transition-colors hover:text-gray-600 hover:underline"
                          >
                            {org.email}
                          </a>
                        </td>
                        <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                          <Chip
                            label={t(`admin.statuses.${org.status}`)}
                            className={submissionStatusColors[org.status]}
                          />
                        </td>
                        <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                          <a
                            href={org.website}
                            target="_blank"
                            rel="noreferrer"
                            className="text-gray-500 transition-colors hover:text-gray-600 hover:underline"
                          >
                            {org.website}
                          </a>
                        </td>
                        <td className="relative whitespace-nowrap py-5 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                          <button
                            onClick={() => setSelectedOrgId(org.id)}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            {t('admin.details')}
                            <span className="sr-only">, {org.name}</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <OrganizationDetailsSlideOver
        open={selectedOrgId !== null}
        setOpen={() => setSelectedOrgId(null)}
        selectedOrgId={selectedOrgId}
      />
    </>
  );
};

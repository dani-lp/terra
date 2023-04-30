import { Spinner } from '@/components/common';
import {
  OrgDetailsList,
  type OrgDetailsListEntry,
} from '@/components/organizations/OrgDetailsList';
import { trpc } from '@/utils/trpc';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useTranslation } from 'next-i18next';
import * as React from 'react';

type Props = {
  open: boolean;
  setOpen: () => void;
  selectedOrgId: string | null;
};

export const OrganizationDetailsSlideOver = ({ open, setOpen, selectedOrgId }: Props) => {
  const { t } = useTranslation('orgs');
  const { data, isLoading, isError, error } = trpc.auth.getAdminOrgDetails.useQuery({
    organizationId: selectedOrgId,
  });

  if (isError) {
    console.error(error);
    return null;
  }

  const listEntries: OrgDetailsListEntry[] = [
    {
      label: t('fields.organizationName'),
      value: data?.name ?? '',
      asLink: false,
      required: true,
    },
    {
      label: t('fields.username'),
      value: data?.username ? `@${data.username}` : '',
      asLink: false,
      required: true,
    },
    {
      label: t('fields.website'),
      value: data?.website ?? '',
      asLink: true,
      required: true,
    },
    { label: t('fields.email'), value: data?.email ?? '', asLink: false, required: true },
    { label: t('fields.about'), value: data?.about ?? '', asLink: false, required: true },
    {
      label: t('fields.country'),
      value: data?.country ?? '',
      asLink: false,
      required: true,
    },
    {
      label: t('fields.streetAddress'),
      value: data?.address ?? '',
      asLink: false,
      required: false,
    },
    { label: t('fields.city'), value: data?.city ?? '', asLink: false, required: false },
    {
      label: t('fields.state'),
      value: data?.state ?? '',
      asLink: false,
      required: false,
    },
    {
      label: t('fields.postalCode'),
      value: data?.zip ?? '',
      asLink: false,
      required: false,
    },
    {
      label: t('fields.phoneNumber'),
      value: data?.phone ?? '',
      asLink: false,
      required: false,
    },
  ];

  return (
    <Transition.Root show={open} as={React.Fragment}>
      <Dialog as="div" className="relative z-30" onClose={setOpen}>
        <div className="fixed inset-0" />

        <Transition.Child
          as={React.Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500/75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16">
              <Transition.Child
                as={React.Fragment}
                enter="transform transition ease-in-out duration-500"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-xl">
                  <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                    {isLoading && (
                      <div className="absolute z-40 flex h-full w-full items-center justify-center bg-neutral-300/75">
                        <Spinner variant="dark" size="lg" />
                      </div>
                    )}
                    <div className="px-4 py-6 sm:px-6">
                      <div className="flex items-start justify-between">
                        <Dialog.Title className="text-base font-semibold leading-6 text-gray-900">
                          {t('admin.orgDetails')}
                        </Dialog.Title>
                        <div className="ml-3 flex h-7 items-center">
                          <button
                            type="button"
                            className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:ring-2 focus:ring-black"
                            onClick={setOpen}
                          >
                            <span className="sr-only">Close panel</span>
                            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="divide-y divide-gray-200">
                      <div className="px-6 pb-5">
                        <OrgDetailsList listEntries={listEntries} />
                      </div>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

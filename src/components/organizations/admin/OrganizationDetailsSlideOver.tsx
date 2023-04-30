import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useTranslation } from 'next-i18next';
import * as React from 'react';

import { Button, Chip, Spinner } from '@/components/common';
import {
  OrgDetailsList,
  type OrgDetailsListEntry,
} from '@/components/organizations/OrgDetailsList';
import { submissionStatusColors } from '@/const';
import { trpc } from '@/utils/trpc';

type Props = {
  open: boolean;
  setOpen: () => void;
  selectedOrgId: string | null;
};

export const OrganizationDetailsSlideOver = ({ open, setOpen, selectedOrgId }: Props) => {
  const { t } = useTranslation('orgs');
  const [message, setMessage] = React.useState('');
  const utils = trpc.useContext();
  const { data, isLoading, isError, error } = trpc.auth.getAdminOrgDetails.useQuery({
    organizationId: selectedOrgId,
  });
  const updateStatusMutation = trpc.auth.changeOrganizationStatus.useMutation({
    onSuccess: async () => {
      await utils.auth.getAdminOrgData.invalidate();
      await utils.auth.getAdminOrgDetails.invalidate();
      setMessage('');
    },
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

  const approveButtonEnabled =
    data &&
    (data.status === 'PENDING' || data.status === 'REJECTED') &&
    message.length > 10 &&
    !updateStatusMutation.isLoading;

  const rejectButtonEnabled =
    data &&
    (data.status === 'PENDING' || data.status === 'ACCEPTED') &&
    message.length > 10 &&
    !updateStatusMutation.isLoading;

  const handleApproveOrg = () => {
    updateStatusMutation.mutate({
      organizationId: selectedOrgId,
      message,
      newStatus: 'ACCEPTED',
    });
  };

  const handleRejectOrg = () => {
    updateStatusMutation.mutate({
      organizationId: selectedOrgId,
      message,
      newStatus: 'REJECTED',
    });
  };

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
                  <div className="flex h-full flex-col divide-y-2 divide-gray-300 bg-white shadow-xl">
                    {isLoading && (
                      <div className="absolute z-40 flex h-full w-full items-center justify-center bg-neutral-300/75">
                        <Spinner variant="dark" size="lg" />
                      </div>
                    )}
                    <div className="h-0 flex-1 overflow-y-auto">
                      <div className="px-4 py-6 sm:px-6">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center justify-center gap-4">
                            <Dialog.Title className="text-base font-semibold leading-6 text-gray-900">
                              {t('admin.orgDetails')}
                            </Dialog.Title>
                            {data?.status && (
                              <Chip
                                label={t(`admin.statuses.${data?.status}`)}
                                className={submissionStatusColors[data?.status ?? 'UNSUBMITTED']}
                              />
                            )}
                          </div>
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

                    {data && data.status !== 'UNSUBMITTED' && (
                      <div className="flex flex-col">
                        <div className="flex shrink-0 flex-col gap-4 bg-white p-4 sm:grid sm:grid-cols-3">
                          <div className="col-span-2">
                            <label
                              htmlFor="about"
                              className="block text-sm font-medium leading-6 text-gray-900"
                            >
                              {t('admin.message')}
                              <span className="text-red-500"> *</span>
                            </label>
                            <div className="mt-2">
                              <textarea
                                id="about"
                                name="about"
                                rows={3}
                                value={message}
                                onChange={(newText) => setMessage(newText.target.value)}
                                className="block w-full rounded-lg border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm sm:leading-6"
                              />
                            </div>
                          </div>
                          <div className="col-span-1 flex w-full flex-col items-start justify-start gap-2">
                            <p className="block text-sm font-medium leading-6 text-gray-900">
                              {t('admin.actions')}
                            </p>
                            <Button
                              onClick={handleApproveOrg}
                              disabled={!approveButtonEnabled}
                              className="w-full"
                            >
                              {t('admin.approve')}
                            </Button>
                            <Button
                              onClick={handleRejectOrg}
                              disabled={!rejectButtonEnabled}
                              variant="primaryRed"
                              className="w-full"
                            >
                              {t('admin.reject')}
                            </Button>
                          </div>
                        </div>
                        <p className="px-4 pb-4 text-sm leading-6 text-gray-600">
                          {t('admin.messagePlaceholder')}
                        </p>
                      </div>
                    )}
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

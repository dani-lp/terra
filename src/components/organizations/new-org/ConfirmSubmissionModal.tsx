import { Button } from '@/components/common';
import { Dialog, Transition } from '@headlessui/react';
import { CheckIcon } from '@heroicons/react/24/outline';
import { useTranslation } from 'next-i18next';
import * as React from 'react';

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  onSubmit: () => Promise<void>;
  submissionLoading: boolean;
};

export const ConfirmSubmissionModal = ({ open, setOpen, onSubmit, submissionLoading }: Props) => {
  const { t } = useTranslation('newOrg');
  const cancelButtonRef = React.useRef(null);

  return (
    <Transition.Root show={open} as={React.Fragment}>
      <Dialog as="div" className="relative z-10" initialFocus={cancelButtonRef} onClose={setOpen}>
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

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={React.Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                <div>
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                    <CheckIcon className="h-6 w-6 text-green-600" aria-hidden="true" />
                  </div>
                  <div className="mt-3 text-center sm:mt-5">
                    <Dialog.Title
                      as="h3"
                      className="text-base font-semibold leading-6 text-gray-900"
                    >
                      {t('confirmModal.title')}
                    </Dialog.Title>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">{t('confirmModal.message')}</p>
                    </div>
                  </div>
                </div>
                <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                  <Button
                    type="button"
                    className="w-full sm:col-start-2"
                    disabled={submissionLoading}
                    onClick={async () => {
                      await onSubmit();
                      setOpen(false);
                    }}
                  >
                    {t('actions.submit')}
                  </Button>
                  <Button
                    type="button"
                    variant="inverse"
                    className="mt-3 w-full sm:col-start-1 sm:mt-0"
                    disabled={submissionLoading}
                    ref={cancelButtonRef}
                    onClick={() => setOpen(false)}
                  >
                    {t('actions.cancel')}
                  </Button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

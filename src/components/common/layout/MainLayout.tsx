import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useTranslation } from 'next-i18next';
import { Inter } from 'next/font/google';
import * as React from 'react';

import { NavigationProvider } from '@/components/common/layout/context/NavigationContext';
import { SettingsModal } from '@/components/common/layout/settings';
import { TopBar } from '@/components/common/layout/Topbar';
import { classNames } from '@/const';
import { useSidebarActions, useSidebarOpen } from '@/store/useSidebarStore';
import { Sidebar } from './Sidebar';

const inter = Inter({ subsets: ['latin'] });

type MainLayoutProps = {
  children: React.ReactNode;
};

export const MainLayout = ({ children }: MainLayoutProps) => {
  const sidebarOpen = useSidebarOpen();
  const { setSidebarOpen } = useSidebarActions();
  const { t } = useTranslation('common');

  return (
    <NavigationProvider>
      <TopBar setSidebarOpen={setSidebarOpen} />

      <Transition.Root show={sidebarOpen} as={React.Fragment}>
        <Dialog
          as="div"
          className={classNames('relative z-40 lg:hidden', inter.className)}
          onClose={setSidebarOpen}
        >
          <Transition.Child
            as={React.Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-neutral-600/75" />
          </Transition.Child>

          <div className="fixed inset-0 z-40 flex">
            <Transition.Child
              as={React.Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative w-72 focus:outline-none">
                <Transition.Child
                  as={React.Fragment}
                  enter="ease-in-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in-out duration-300"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="absolute top-0 right-0 -mr-12 pt-2">
                    <button
                      type="button"
                      className="ml-1 flex h-10 w-10 items-center justify-center rounded-lg focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                      onClick={() => setSidebarOpen(false)}
                    >
                      <span className="sr-only">{t('a11y.closeSidebar')}</span>
                      <XMarkIcon className="h-6 w-6 text-white" aria-hidden="true" />
                    </button>
                  </div>
                </Transition.Child>
                <Sidebar />
              </Dialog.Panel>
            </Transition.Child>
            <div className="w-14 shrink-0" aria-hidden="true">
              {/* Force sidebar to shrink to fit close icon */}
            </div>
          </div>
        </Dialog>
      </Transition.Root>

      <main
        className={classNames(
          'flex h-full min-h-screen w-full justify-center bg-neutral-100 pt-16',
          inter.className,
        )}
      >
        <div className="w-full max-w-6xl">{children}</div>
      </main>
      <SettingsModal />
    </NavigationProvider>
  );
};

import * as React from 'react';
import { Inter } from '@next/font/google';
import Image from 'next/image';
import { Dialog, Transition } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';

import { Sidebar } from './Sidebar';
import { classNames } from '@/const';
import { useSidebarActions, useSidebarOpen } from '@/store/useSidebarStore';

const inter = Inter({ subsets: ['latin'] });

type MainLayoutProps = {
  children: React.ReactNode;
};

export const MainLayout = ({ children }: MainLayoutProps) => {
  const sidebarOpen = useSidebarOpen();
  const { setSidebarOpen } = useSidebarActions();
  const { t } = useTranslation('common');

  return (
    <>
      {/* Top bar */}
      <div className={classNames('lg:hidden', inter.className)}>
        <div className="fixed z-20 flex h-16 w-screen items-center justify-between border-b border-neutral-200 bg-white px-4 py-1.5">
          <div>
            <Image
              className="h-8 w-auto"
              height={32}
              width={32}
              src="/logo.png"
              alt="Terra"
            />
          </div>
          <div>
            <button
              type="button"
              className="-mr-3 inline-flex h-12 w-12 items-center justify-center rounded-lg text-neutral-500 hover:text-neutral-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-neutral-500"
              onClick={() => setSidebarOpen(true)}
            >
              {/* TODO this causes an hydration error in the client for some reason? */}
              {/* <span className="sr-only">{t('a11y.openSidebar')}</span> */}
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      <Transition.Root show={sidebarOpen} as={React.Fragment}>
        <Dialog as="div" className={classNames('relative z-40 lg:hidden', inter.className)} onClose={setSidebarOpen}>
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

      {/* Desktop sidebar */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>
      <main className={classNames(
        'bg-neutral-100 w-full min-h-screen h-full pt-16 lg:pt-0 lg:pl-72',
        inter.className,
      )}>
        {children}
      </main>
    </>
  );
};
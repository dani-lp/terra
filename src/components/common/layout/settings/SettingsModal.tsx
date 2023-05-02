import { classNames } from '@/const';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { Cog6ToothIcon, UserCircleIcon } from '@heroicons/react/24/solid';
import { useAtom } from 'jotai';
import { useSession } from 'next-auth/react';
import { useTranslation } from 'next-i18next';
import * as React from 'react';

import { Modal, type SelectOptionWithIcon } from '@/components/common';
import { OrgProfileSettings } from '@/components/common/layout/settings/content/OrgProfileSettings';
import { PlayerProfileSettings } from '@/components/common/layout/settings/content/PlayerProfileSettings';
import { settingsModalOpenAtom } from '@/components/common/layout/utils/atoms';
import { AccountSettings } from './content';

const tabs: SelectOptionWithIcon[] = [
  { id: 'profile', label: 'profile', icon: UserCircleIcon },
  { id: 'account', label: 'account', icon: Cog6ToothIcon },
];

type TabKey = typeof tabs[number]['id'];

export const SettingsModal = () => {
  const [open, setOpen] = useAtom(settingsModalOpenAtom);
  const { data: session } = useSession();
  const [selectedTabKey, setSelectedTabKey] = React.useState<TabKey>('profile');
  const { t } = useTranslation('common');

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Modal open={open} setOpen={setOpen} fullScreen className="max-w-2xl">
      <div className="flex h-full w-full flex-col items-start">
        <div className="flex w-full flex-col items-start justify-center px-4 pt-4 sm:px-6 sm:pt-6">
          <div className="flex w-full items-center justify-between">
            <h2 className="mb-1 text-2xl font-bold">{t('settings.title')}</h2>
            <button
              type="button"
              className="ml-1 flex h-10 w-10 items-center justify-center rounded-lg focus:outline-none focus:ring-2 focus:ring-inset focus:ring-black"
              onClick={() => setOpen(false)}
            >
              <span className="sr-only">{t('a11y.closeSidebar')}</span>
              <XMarkIcon className="h-6 w-6 text-black" aria-hidden="true" />
            </button>
          </div>

          {session && session?.user?.role === 'ORGANIZATION' && (
            <div className="w-full sm:block">
              <div className="w-full border-b border-gray-200">
                <nav
                  className="-mb-px flex w-full items-center justify-around gap-8 space-x-8 px-8"
                  aria-label="Tabs"
                >
                  {tabs.map((tab) => (
                    <div
                      key={tab.id}
                      onClick={() => setSelectedTabKey(tab.id)}
                      className={classNames(
                        tab.id === selectedTabKey
                          ? 'border-black text-black'
                          : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                        'group inline-flex w-full cursor-pointer items-center justify-center border-b-2 py-4 px-1 text-sm font-medium',
                      )}
                      aria-current={tab.id === selectedTabKey ? 'page' : undefined}
                    >
                      <tab.icon
                        className={classNames(
                          tab.id === selectedTabKey
                            ? 'text-black'
                            : 'text-gray-400 group-hover:text-gray-500',
                          '-ml-0.5 mr-2 h-5 w-5',
                        )}
                        aria-hidden="true"
                      />
                      <span>{t(`settings.tabs.${tab.label}`)}</span>
                    </div>
                  ))}
                </nav>
              </div>
            </div>
          )}
        </div>

        <div className="h-full w-full overflow-auto">
          {session?.user && session?.user.role === 'PLAYER' ? (
            <PlayerProfileSettings handleClose={handleClose} />
          ) : selectedTabKey === 'profile' ? (
            <OrgProfileSettings handleClose={handleClose} />
          ) : (
            <AccountSettings handleClose={handleClose} />
          )}
        </div>
      </div>
    </Modal>
  );
};

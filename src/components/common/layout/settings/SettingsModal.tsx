import { classNames } from '@/const';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { BellIcon, Cog6ToothIcon, UserCircleIcon } from '@heroicons/react/24/solid';
import { useTranslation } from 'next-i18next';
import * as React from 'react';
import { AccountSettings, NotificationSettings, ProfileSettings } from './content';

import { Button } from '../../button';
import { SelectField, type SelectOptionWithIcon } from '../../form';
import { Modal } from '../../modal';

import { settingsModalOpenAtom } from '@/components/common/layout/utils/atoms';
import { useSettingsActions } from '@/store/useSettingsStore';
import { trpc } from '@/utils/trpc';
import { useAtom } from 'jotai';
import { signOut } from 'next-auth/react';

const tabs: SelectOptionWithIcon[] = [
  { id: '1', label: 'profile', icon: UserCircleIcon },
  { id: '2', label: 'account', icon: Cog6ToothIcon },
  { id: '3', label: 'notifications', icon: BellIcon },
];

const sections: { [key: string]: () => JSX.Element } = {
  '1': ProfileSettings,
  '2': AccountSettings,
  '3': NotificationSettings,
};

export const SettingsModal = () => {
  const [open, setOpen] = useAtom(settingsModalOpenAtom);
  const { data, isLoading, isError, error } = trpc.user.getSelfData.useQuery();
  const [selectedTabKey, setSelectedTabKey] = React.useState<string>('1');
  const { t } = useTranslation('common');
  const { load } = useSettingsActions();

  const selectedTab =
    tabs.find((tab) => tab.id === selectedTabKey) ||
    ({ ...tabs[0], label: t(`settings.tabs.${tabs[0]?.label}`) } as SelectOptionWithIcon);
  const SelectedSection = sections[selectedTabKey] ?? ProfileSettings;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setOpen(false);
  };

  // TODO might be a better idea to load data only when the modal gets opened
  React.useEffect(() => {
    if (data && !isLoading && !isError) {
      load({
        about: data.about || '',
        image: data.image || '',
        name: data.name || '',
        username: data.username || '',
      });
    } else if (isError) {
      console.error(error);
    }
  }, [data, isLoading, isError, error, load]);

  return (
    <Modal open={open} setOpen={setOpen} fullScreen className="sm:w-[600px]">
      <form
        onSubmit={handleSubmit}
        className="flex h-full w-full flex-col items-start justify-between"
      >
        <div className="flex w-full flex-col items-start justify-center p-4 sm:p-6">
          <div className="flex w-full items-center justify-between">
            {/* TODO translate */}
            <h2 className="mb-1 text-2xl font-bold">Settings</h2>
            <button
              type="button"
              className="ml-1 flex h-10 w-10 items-center justify-center rounded-lg focus:outline-none focus:ring-2 focus:ring-inset focus:ring-black"
              onClick={() => setOpen(false)}
            >
              <span className="sr-only">{t('a11y.closeSidebar')}</span>
              <XMarkIcon className="h-6 w-6 text-black" aria-hidden="true" />
            </button>
          </div>

          <div className="mt-2 w-full sm:hidden">
            <SelectField
              label={t('a11y.selectATab') || ''}
              hideLabel
              options={tabs.map((tab) => ({ ...tab, label: t(`settings.tabs.${tab.label}`) }))}
              selected={
                { ...selectedTab, label: t(`settings.tabs.${selectedTab.label}`) } ||
                (tabs[0] as SelectOptionWithIcon)
              }
              setSelected={(tab) => setSelectedTabKey(tab.id)}
              className="w-full"
            />
          </div>

          <div className="hidden w-full sm:block">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                {tabs.map((tab) => (
                  <div
                    key={tab.id}
                    onClick={() => setSelectedTabKey(tab.id)}
                    className={classNames(
                      tab.id === selectedTabKey
                        ? 'border-black text-black'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                      'group inline-flex cursor-pointer items-center border-b-2 py-4 px-1 text-sm font-medium',
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
        </div>

        <div className="w-full overflow-auto px-4 sm:px-6">
          <SelectedSection />
        </div>

        <div className="mt-auto flex w-full justify-between border-t-2 border-gray-100 p-4 sm:px-8">
          <div>
            <Button variant="inverseRed" onClick={() => signOut()}>
              Log out
            </Button>
          </div>
          <div className="flex justify-end">
            <Button variant="inverse" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="ml-5">
              Save
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
};

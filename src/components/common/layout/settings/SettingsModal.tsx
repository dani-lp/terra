import * as React from 'react';
import { useTranslation } from 'react-i18next';
import {
  BellIcon,
  Cog6ToothIcon,
  UserCircleIcon,
} from '@heroicons/react/24/solid';
import { classNames } from '@/const';
import {
  AccountSettings,
  ProfileSettings,
  NotificationSettings,
} from './content';
import { XMarkIcon } from '@heroicons/react/24/outline';

import { Button } from '../../button';
import { SelectField, type SelectOptionWithIcon } from '../../form';
import { Modal } from '../../modal';

import { trpc } from '@/utils/trpc';
import { useSettingsActions } from '@/store/useSettingsStore';


type SettingsModalProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  className?: string;
};

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

export const SettingsModal = ({ open, setOpen }: SettingsModalProps) => {
  const { data, isLoading, isError, error } = trpc.user.getUserData.useQuery();
  const [selectedTabKey, setSelectedTabKey] = React.useState<string>('1');
  const { t } = useTranslation('common');
  const { load } = useSettingsActions();

  const selectedTab = tabs.find((tab) => tab.id === selectedTabKey) || { ...tabs[0], label: t(`settings.tabs.${tabs[0]?.label}`) } as SelectOptionWithIcon;
  const SelectedSection = sections[selectedTabKey] ?? ProfileSettings;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setOpen(false);
  };

  // TODO might be a better idea to load data only when the modal gets opened
  React.useEffect(() => {
    if (data && !isLoading && !isError) {
      load(data);
      console.log('Loaded data');
    } else if (isError) {
      console.error(error);
    }
  }, [data, isLoading, isError, error, load]);

  return (
    <Modal open={open} setOpen={setOpen} fullScreen className="sm:w-[600px]">
      <form onSubmit={handleSubmit} className="flex h-full w-full flex-col items-start justify-between">
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

          <div className="w-full sm:hidden">
            <SelectField
              label={t('a11y.selectATab') || ''}
              hideLabel
              options={tabs.map((tab) => ({ ...tab, label: t(`settings.tabs.${tab.label}`) }))}
              selected={{ ...selectedTab, label: t(`settings.tabs.${selectedTab.label}`) } || tabs[0] as SelectOptionWithIcon}
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
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                      'group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm cursor-pointer'
                    )}
                    aria-current={tab.id === selectedTabKey ? 'page' : undefined}
                  >
                    <tab.icon
                      className={classNames(
                        tab.id === selectedTabKey ? 'text-black' : 'text-gray-400 group-hover:text-gray-500',
                        '-ml-0.5 mr-2 h-5 w-5'
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

        <div className="mt-auto flex w-full justify-end border-t-2 border-gray-100 p-4 sm:px-8">
          <Button variant="inverse" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button type="submit" className="ml-5">
            Save
          </Button>
        </div>
      </form>
    </Modal >
  )
};
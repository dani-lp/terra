import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { SelectField, type SelectOptionWithIcon } from '../../form';
import { Modal } from '../../modal';
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

const sections: { [key: string ]: () => JSX.Element} = {
  '1': ProfileSettings,
  '2': AccountSettings,
  '3': NotificationSettings,
};

export const SettingsModal = ({ open, setOpen }: SettingsModalProps) => {
  const [selectedTabKey, setSelectedTabKey] = React.useState<string>('1');
  const { t } = useTranslation('common');

  const selectedTab = tabs.find((tab) => tab.id === selectedTabKey) || { ...tabs[0], label: t(`settings.tabs.${tabs[0]?.label}`) } as SelectOptionWithIcon;
  const SelectedSection = sections[selectedTabKey] ?? ProfileSettings;

  return (
    <Modal open={open} setOpen={setOpen} fullScreen className="flex flex-col items-start justify-start sm:h-96">
      <h2 className="text-2xl font-bold mb-1">Settings</h2>

      <div className="sm:hidden w-full">
        <SelectField
          label={t('a11y.selectATab') || ''}
          hideLabel
          options={tabs.map((tab) => ({ ...tab, label: t(`settings.tabs.${tab.label}`) }))}
          selected={{ ...selectedTab, label: t(`settings.tabs.${selectedTab.label}`) } || tabs[0] as SelectOptionWithIcon}
          setSelected={(tab) => setSelectedTabKey(tab.id)}
          className="w-full"
        />
      </div>

      <div className="hidden sm:block">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            {tabs.map((tab) => (
              <div
                key={tab.id}
                onClick={() => setSelectedTabKey(tab.id)}
                className={classNames(
                  tab.id === selectedTabKey
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                  'group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm cursor-pointer'
                )}
                aria-current={tab.id === selectedTabKey ? 'page' : undefined}
              >
                <tab.icon
                  className={classNames(
                    tab.id === selectedTabKey ? 'text-indigo-500' : 'text-gray-400 group-hover:text-gray-500',
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

      <SelectedSection />
    </Modal>
  )
};
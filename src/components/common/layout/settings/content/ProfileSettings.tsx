import { InputField, TextareaField } from '@/components/common';
import { useSession } from 'next-auth/react';
import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import { OrgUsernameField } from './components/OrgUsernameField';

import { useAbout, useSettingsActions, useUsername } from '@/store/useSettingsStore';

export const ProfileSettings = () => {
  const username = useUsername();
  const about = useAbout();
  const { setUsername, setAbout } = useSettingsActions();
  const { data: session } = useSession();
  const { t } = useTranslation('common');

  if (!session?.user) {
    return <div></div>;
  }

  return (
    <div className="h-full w-full">
      <span className="text-sm text-neutral-500 sm:text-base">
        {t('settings.descriptions.profileDescription')}
      </span>

      <div className="mt-6 flex flex-col lg:flex-row">
        <div className="grow space-y-6">
          <div>
            {session.user.role === 'ORGANIZATION' ? (
              <OrgUsernameField value={username} onChange={setUsername} />
            ) : (
              <InputField
                label={t('settings.fields.username') ?? ''}
                className="h-[42px]"
                value={username}
                onChange={(e) => setUsername(e.currentTarget.value)}
              />
            )}
          </div>

          <div>
            <TextareaField
              id="about"
              label={t('settings.fields.about') ?? ''}
              name="About"
              rows={3}
              value={about ?? ''}
              onChange={(e) => setAbout(e.currentTarget.value)}
            />
            <p className="mt-2 text-sm text-gray-500">
              {session.user.role === 'ORGANIZATION'
                ? t('settings.descriptions.aboutOrg')
                : t('settings.descriptions.aboutPlayer')}
            </p>
          </div>
        </div>

        <div className="mt-6 grow lg:mt-0 lg:ml-6 lg:shrink-0 lg:grow-0">
          <p className="text-sm font-medium text-gray-700" aria-hidden="true">
            {t('settings.fields.photo')}
          </p>
          <div className="mt-1 lg:hidden">
            <div className="flex items-center">
              <div
                className="inline-block h-12 w-12 shrink-0 overflow-hidden rounded-full"
                aria-hidden="true"
              >
                <Image
                  className="h-full w-full rounded-full"
                  src={session?.user?.image ?? ''}
                  alt=""
                  height={128}
                  width={128}
                />
              </div>
              <div className="ml-5 rounded-md shadow-sm">
                <div className="group relative flex items-center justify-center rounded-lg border border-gray-300 py-2 px-3 focus-within:ring-2 focus-within:ring-black hover:bg-gray-50">
                  <label
                    htmlFor="mobile-user-photo"
                    className="pointer-events-none relative text-sm font-medium leading-4 text-gray-700"
                  >
                    <span>{t('settings.fields.photoOverlay')}</span>
                    <span className="sr-only">{t('settings.fields.photoOverlayA11y')}</span>
                  </label>
                  <input
                    id="mobile-user-photo"
                    name="user-photo"
                    type="file"
                    className="absolute h-full w-full cursor-pointer rounded-md border-gray-300 opacity-0"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="relative hidden overflow-hidden rounded-full lg:block">
            <Image
              className="relative h-40 w-40 rounded-full"
              src={session?.user?.image ?? ''}
              alt=""
              height={160}
              width={160}
            />
            <label
              htmlFor="desktop-user-photo"
              className="absolute inset-0 flex h-full w-full items-center justify-center bg-black/75 text-sm font-medium text-white opacity-0 focus-within:opacity-100 hover:opacity-100"
            >
              <span>{t('settings.fields.photoOverlay')}</span>
              <span className="sr-only">{t('settings.fields.photoOverlayA11y')}</span>
              <input
                type="file"
                id="desktop-user-photo"
                name="user-photo"
                className="absolute inset-0 h-full w-full cursor-pointer rounded-md border-gray-300 opacity-0"
              />
            </label>
          </div>
        </div>
      </div>

      {session.user.role === 'ORGANIZATION' && (
        <div className="mt-6">
          <InputField id="website" label={t('settings.fields.website') ?? ''} name="website" />
          <p className="mt-2 text-sm text-gray-500">{t('settings.descriptions.websiteUrl')}</p>
        </div>
      )}
    </div>
  );
};

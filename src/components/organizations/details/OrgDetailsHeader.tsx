import { LinkIcon, MapPinIcon, UsersIcon } from '@heroicons/react/20/solid';
import { Trans, useTranslation } from 'next-i18next';

import type { OrganizationData } from '@prisma/client';
import Image from 'next/image';

type HeaderTitleProps = {
  name: string;
  joinedDate: Date;
  imageUrl: string;
};

const HeaderTitle = ({ name, joinedDate, imageUrl }: HeaderTitleProps) => {
  const date = joinedDate.toLocaleDateString();

  return (
    <div className="md:flex md:items-center md:justify-between md:space-x-5">
      <div className="flex items-start space-x-5">
        <div className="shrink-0">
          <div className="relative">
            <Image
              className="h-16 w-16 rounded-full"
              src={imageUrl}
              height={64}
              width={64}
              alt=""
            />
            <span className="absolute inset-0 rounded-full shadow-inner" aria-hidden="true" />
          </div>
        </div>
        <div className="pt-1.5">
          <h1 className="text-2xl font-bold text-gray-900">{name}</h1>
          <p className="text-sm font-medium text-gray-500">
            <Trans
              i18nKey="details.joinedOn"
              ns="orgs"
              values={{ date }}
              components={{ 1: <strong /> }}
            >
              {'Joined on <1>{{ date }}</1>'}
            </Trans>
          </p>
        </div>
      </div>
    </div>
  );
};

type Props = {
  org: OrganizationData;
  about: string;
  challengeCount: number;
};

export const OrgDetailsHeader = ({ org, about, challengeCount }: Props) => {
  const { t } = useTranslation('orgs');

  return (
    <div className="flex w-full flex-col items-start justify-start bg-white px-4 py-3 shadow md:bg-transparent">
      <HeaderTitle name={org.name} joinedDate={org.createdAt} imageUrl={org.image} />

      <div className="mt-2 mb-4 flex flex-col">
        <div className="mt-2 flex items-center text-sm text-gray-500">
          <LinkIcon className="mr-1.5 h-5 w-5 shrink-0 text-gray-400" aria-hidden="true" />
          <a href={org.website} target="_blank" rel="noreferrer" className="hover:underline">
            {org.website}
          </a>
        </div>
        <div className="mt-2 flex items-center text-sm text-gray-500">
          <MapPinIcon className="mr-1.5 h-5 w-5 shrink-0 text-gray-400" aria-hidden="true" />
          {org.country ?? 'Anywhere'}
        </div>
        <div className="mt-2 flex items-center text-sm text-gray-500">
          <UsersIcon className="mr-1.5 h-5 w-5 shrink-0 text-gray-400" aria-hidden="true" />
          {t('details.challengeCount', { count: challengeCount })}
        </div>
      </div>

      <p>{about}</p>
    </div>
  );
};

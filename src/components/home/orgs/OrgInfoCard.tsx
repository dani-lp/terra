import { LinkIcon, MapPinIcon, UserIcon } from '@heroicons/react/20/solid';
import { Trans, useTranslation } from 'next-i18next';

import { Skeleton } from '@/components/common/skeleton';
import { HomeCard } from '@/components/home/HomeCard';
import Image from 'next/image';

const ContentSkeleton = () => {
  return (
    <div className="grid grid-cols-2">
      <div className="col-span-1 flex flex-col">
        <div className="mb-1">
          <Skeleton className="h-3.5 w-36" />
        </div>

        <div className="flex items-center text-sm text-gray-500">
          <UserIcon className="mr-1.5 h-5 w-5 shrink-0 text-gray-400" aria-hidden="true" />@
          <Skeleton className="h-3 w-24" />
        </div>
        <div className="mt-2 flex items-center text-sm text-gray-500">
          <LinkIcon className="mr-1.5 h-5 w-5 shrink-0 text-gray-400" aria-hidden="true" />
          <Skeleton className="h-3 w-24" />
        </div>
        <div className="mt-2 flex items-center text-sm text-gray-500">
          <MapPinIcon className="mr-1.5 h-5 w-5 shrink-0 text-gray-400" aria-hidden="true" />
          <Skeleton className="h-3 w-24" />
        </div>
      </div>
      <div className="col-span-1 flex w-full flex-col items-center justify-center gap-4">
        <Skeleton rounded className="h-[72px] w-[72px]" />
        <Skeleton className="h-4 w-36" />
      </div>
    </div>
  );
};

type OrgInfoCardProps = {
  username: string;
  website: string;
  country: string;
  image: string;
  joinedOn: Date;
  loading: boolean;
};

export const OrgInfoCard = ({
  username,
  website,
  country,
  image,
  joinedOn,
  loading,
}: OrgInfoCardProps) => {
  const { t } = useTranslation('home');

  return (
    <HomeCard title={t('orgs.info.title')} subtitle={t('orgs.info.subtitle')}>
      {loading && <ContentSkeleton />}
      {!loading && (
        <div className="grid grid-cols-2">
          <div className="col-span-1 flex flex-col">
            <h6 className="mb-1 font-medium">{t('orgs.info.publicInformation')}</h6>

            <div className="flex items-center text-sm text-gray-500">
              <UserIcon className="mr-1.5 h-5 w-5 shrink-0 text-gray-400" aria-hidden="true" />@
              {username}
            </div>
            <div className="mt-2 flex items-center text-sm text-gray-500">
              <LinkIcon className="mr-1.5 h-5 w-5 shrink-0 text-gray-400" aria-hidden="true" />
              <a href={website} target="_blank" rel="noreferrer" className="hover:underline">
                {website}
              </a>
            </div>
            <div className="mt-2 flex items-center text-sm text-gray-500">
              <MapPinIcon className="mr-1.5 h-5 w-5 shrink-0 text-gray-400" aria-hidden="true" />
              {country}
            </div>
          </div>
          <div className="col-span-1 flex w-full flex-col items-center justify-center gap-4">
            <Image src={image} alt="" height={72} width={72} className="rounded-full" />
            <p className="text-sm font-medium text-gray-500">
              <Trans
                i18nKey="orgs.info.joinedOn"
                ns="orgs"
                values={{ date: joinedOn.toLocaleDateString() }}
                components={{ 1: <strong /> }}
              >
                {'Joined on <1>{{ date }}</1>'}
              </Trans>
            </p>
          </div>
        </div>
      )}
    </HomeCard>
  );
};

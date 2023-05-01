import { useTranslation } from 'next-i18next';

import { HomeCard } from '@/components/home/HomeCard';
import { QuickLink, type QuickLinkItem } from '@/components/home/QuickLink';
import { ClipboardDocumentListIcon, InformationCircleIcon, RocketLaunchIcon } from '@heroicons/react/24/outline';

export const OrgQuickLinksCard = () => {
  const { t } = useTranslation('home');

  const links: QuickLinkItem[] = [
    {
      title: t('orgs.quickLinks.challenges'),
      description: t('orgs.quickLinks.challengesMsg'),
      icon: RocketLaunchIcon,
      background: 'bg-indigo-500',
      href: '/challenges',
    },
    {
      title: t('orgs.quickLinks.registrationSubmission'),
      description: t('orgs.quickLinks.registrationSubmissionMsg'),
      icon: ClipboardDocumentListIcon,
      background: 'bg-green-500',
      href: '/organizations/waiting-room',
    },
    {
      title: t('orgs.quickLinks.about'),
      description: t('orgs.quickLinks.aboutMsg'),
      icon: InformationCircleIcon,
      background: 'bg-yellow-500',
      href: '/about',
    },
  ];


  return (
    <HomeCard title={t('orgs.quickLinks.title')} subtitle={t('orgs.quickLinks.subtitle')}>
      <ul role="list" className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {links.map((item, i) => (
          <QuickLink item={item} key={i} />
        ))}
      </ul>
    </HomeCard>
  );
};

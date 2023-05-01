import { HomeCard } from '@/components/home/HomeCard';
import { QuickLink, type QuickLinkItem } from '@/components/home/QuickLink';
import { InformationCircleIcon, RocketLaunchIcon, TrophyIcon } from '@heroicons/react/24/outline';
import { useTranslation } from 'next-i18next';

export const PlayerQuickLinksCard = () => {
  const { t } = useTranslation('home');

  const links: QuickLinkItem[] = [
    {
      title: t('players.quickLinks.availableChallenges'),
      description: t('players.quickLinks.availableChallengesMsg'),
      icon: RocketLaunchIcon,
      background: 'bg-indigo-500',
      href: '/challenges?challengesTab=available',
    },
    {
      title: t('players.quickLinks.activeChallenges'),
      description: t('players.quickLinks.activeChallengesMsg'),
      icon: TrophyIcon,
      background: 'bg-green-500',
      href: '/challenges?challengesTab=joined',
    },
    {
      title: t('players.quickLinks.about'),
      description: t('players.quickLinks.aboutMsg'),
      icon: InformationCircleIcon,
      background: 'bg-yellow-500',
      href: '/about',
    },
  ];

  return (
    <HomeCard title={t('players.quickLinks.title')} subtitle={t('players.quickLinks.subtitle')}>
      <ul role="list" className="grid grid-cols-1 gap-6 py-6 sm:grid-cols-2">
        {links.map((item, i) => (
          <QuickLink item={item} key={i} />
        ))}
      </ul>
    </HomeCard>
  );
};

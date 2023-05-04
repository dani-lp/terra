import { classNames } from '@/const';
import Link from 'next/link';

export type QuickLinkItem = {
  title: string;
  description: string;
  icon: React.ComponentType<React.ComponentProps<'svg'>>;
  background: string;
  href: string;
};

type Props = {
  item: QuickLinkItem;
};

export const QuickLink = ({ item }: Props) => {
  return (
    <li className="flow-root" role="listitem">
      <Link href={item.href}>
        <div className="relative -m-2 flex items-center space-x-4 rounded-xl p-2 focus-within:ring-2 focus-within:ring-indigo-500 hover:bg-gray-50">
          <div
            className={classNames(
              item.background,
              'flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-lg',
            )}
          >
            <item.icon className="h-6 w-6 text-white" aria-hidden="true" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-900">
              <span className="absolute inset-0" aria-hidden="true" />
              <span>{item.title}</span>
              <span aria-hidden="true"> &rarr;</span>
            </h3>
            <p className="mt-1 text-sm text-gray-500">{item.description}</p>
          </div>
        </div>
      </Link>
    </li>
  );
};

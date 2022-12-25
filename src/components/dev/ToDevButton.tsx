import Link from 'next/link';
import { BugAntIcon } from '@heroicons/react/24/outline';

export const ToDevButton = () => {
  return (
    <Link href="/dev" className="fixed bottom-4 right-4 rounded-full bg-black text-white p-4 shadow hover:shadow-xl transition-shadow">
      <BugAntIcon className="w-7" />
    </Link>
  );
};
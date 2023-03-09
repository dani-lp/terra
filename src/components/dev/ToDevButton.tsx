import Link from 'next/link';
import { BugAntIcon } from '@heroicons/react/24/outline';

export const ToDevButton = () => {
  return (
    <Link
      href="/dev"
      className="fixed bottom-4 right-4 rounded-full bg-black p-4 text-white shadow transition-shadow hover:shadow-xl"
    >
      <BugAntIcon className="w-7" />
    </Link>
  );
};

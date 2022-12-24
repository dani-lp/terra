import { Inter } from '@next/font/google';
import { Sidebar } from './Sidebar';
import { classNames } from '@/const';

const inter = Inter({ subsets: ['latin'] });

type MainLayoutProps = {
  children: React.ReactNode;
};

export const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <>
      <Sidebar />
      <main className={classNames(
        "bg-neutral-100 w-full h-screen pl-72",
        inter.className,
      )}>
        {children}
      </main>
    </>
  );
};
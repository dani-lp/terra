import { Sidebar } from './Sidebar';

type MainLayoutProps = {
  children: React.ReactNode;
};

export const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <>
      <Sidebar />
      <main className="bg-neutral-100 w-full h-screen pl-72">
        {children}
      </main>
    </>
  );
};
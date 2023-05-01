type Props = {
  title: string;
  subtitle: string;
  children: React.ReactNode;
};

export const HomeCard = ({ title, subtitle, children }: Props) => {
  return (
    <div className="h-full max-h-96 w-full space-y-2 divide-y-2 divide-gray-200 rounded-lg bg-white p-4 shadow-md">
      <div className="">
        <h3 className="text-lg font-medium leading-6 text-gray-900">{title}</h3>
        <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
      </div>
      <div>{children}</div>
    </div>
  );
};

import { CalendarDaysIcon } from '@heroicons/react/20/solid';

type Props = {
  label: string;
  name: string;
  value: string;
  handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
};

export const DateInputWithIcon = ({ label, name, value, handleInputChange, required }: Props) => {
  return (
    <div className="w-full">
      <label htmlFor={name} className="block text-sm font-medium leading-6 text-gray-900">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </label>
      <div className="relative mt-1 rounded-md shadow-sm">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <CalendarDaysIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
        </div>
        <input
          type="date"
          name={name}
          id={name}
          className="block w-full rounded-md border-0 py-1.5 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm sm:leading-6"
          value={value}
          onChange={handleInputChange}
        />
      </div>
    </div>
  );
};

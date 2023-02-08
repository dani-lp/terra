import { classNames } from '@/const';
import { FunnelIcon } from '@heroicons/react/20/solid';
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import { Button } from '../button';

type SearchBarProps = React.InputHTMLAttributes<HTMLInputElement> & {
  className?: string;
  withButton?: boolean;  // TODO limit rest of the props depending on this value
  onClick?: VoidFunction; // TODO add custom icon
  buttonText?: string;
};

export const SearchBar = ({
  className,
  withButton,
  onClick,
  buttonText,
  ...props
}: SearchBarProps) => {
  return (
    <div className={classNames('mt-1 flex w-full rounded-lg shadow-sm', className)}>
      <div className="relative flex grow items-stretch focus-within:z-10">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <MagnifyingGlassIcon className="h-5 w-5 text-neutral-400" aria-hidden="true" />
        </div>
        <input
          type="email"
          name="search"
          className={classNames(
            'block w-full border-neutral-300 pl-10 text-sm focus:border-black focus:ring-black',
            withButton ? 'rounded-none rounded-l-lg' : 'rounded-lg',
          )}
          placeholder="Search your challenges..."
          {...props}
        />
      </div>
      {withButton && (
        <Button
          type="button"
          variant="inverse"
          onClick={onClick} 
          thinBorder
          className="relative -ml-px inline-flex items-center space-x-2 rounded-l-none rounded-r-lg border px-4 py-2 text-sm font-medium focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
        >
          <FunnelIcon className="h-5 w-5 text-neutral-400" aria-hidden="true" />
          <span className="-mr-1.5 ml-1.5 font-normal">{buttonText}</span>
        </Button>
      )}
    </div>
  );
};
import { classNames } from '@/const';
import { Switch } from '@headlessui/react';

type ToggleProps = {
  enabled: boolean;
  setEnabled: (enabled: boolean) => void;
  disabled?: boolean;
};

export const Toggle = ({ enabled, setEnabled, disabled = false }: ToggleProps) => {
  const handleChange = (checked: boolean) => {
    if (!disabled) {
      setEnabled(checked);
    }
  }

  return (
    <Switch
      checked={enabled}
      onChange={handleChange}
      className={classNames(
        enabled && !disabled ? 'bg-black' : 'bg-neutral-200',
        disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
        'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2',
      )}
    >
      <span className="sr-only">Use setting</span>
      <span
        aria-hidden="true"
        className={classNames(
          enabled ? 'translate-x-5' : 'translate-x-0',
          'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
        )}
      />
    </Switch>
  );
};

import * as React from 'react';
import Image from 'next/image';
import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'
import { classNames } from '@/const/helpers';


type Icon = (props: React.SVGProps<SVGSVGElement>) => JSX.Element;

export type SelectOption = {
  id: string;
  label: string;
};

export type SelectOptionWithImage = SelectOption & {
  image: string;
  alt: string;
};

export type SelectOptionWithIcon = SelectOption & {
  icon: Icon;
};

type ExtractImage<T> = T extends { image: string }
  ? SelectOptionWithImage
  : SelectOption;

type SelectFieldProps<T extends SelectOption> = {
  options: T[];
  selected: ExtractImage<T>;
  setSelected: (value: ExtractImage<T>) => void;
  label?: string;
  hideLabel?: boolean;
  className?: string;
};

const SelectOptionIcon = (props: { icon: Icon }) => (
  <props.icon className="h-5 w-5" />
);

export const SelectField = <T extends SelectOption>({
  selected,
  setSelected,
  options,
  label,
  hideLabel = false,
  className,
}: SelectFieldProps<T>) => {
  return (
    <Listbox value={selected} onChange={setSelected}>
      {({ open }) => (
        <>
          {label && <Listbox.Label className={`block text-sm font-medium text-gray-700 ${hideLabel && 'sr-only'}`}>{label}</Listbox.Label>}
          <div className="relative -mt-2">
            <Listbox.Button className={classNames(
              'relative w-full cursor-default rounded-lg border border-gray-300 bg-white py-2 pr-10 text-left shadow-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black sm:text-sm',
              'image' in selected || 'icon' in selected ? 'pl-3' : '',
              className,
            )}>
              <span className="flex items-center">
                {'image' in selected && (
                  <Image
                    src={selected.image as string}
                    height={24}
                    width={24}
                    alt=""
                    className="h-6 w-6 shrink-0 rounded-full"
                  />
                )}
                {'icon' in selected && <SelectOptionIcon icon={selected.icon as Icon} />}
                <span className="ml-3 block truncate">{selected.label}</span>
              </span>
              <span className="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
                <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </span>
            </Listbox.Button>

            <Transition
              show={open}
              as={React.Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-lg bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
                {options.map((option) => (
                  <Listbox.Option
                    key={option.id}
                    className={({ active }) =>
                      classNames(
                        active ? 'text-white bg-black' : 'text-gray-900',
                        'relative cursor-default select-none py-2 pr-9',
                        'image' in option || 'icon' in option ? 'pl-3' : '',
                      )
                    }
                    value={option}
                  >
                    {({ selected, active }) => (
                      <>
                        <div className="flex items-center">
                          {'image' in option && (
                            <Image
                              src={option.image as string}
                              height={24}
                              width={24}
                              alt=""
                              className="h-6 w-6 shrink-0 rounded-full"
                            />
                          )}
                          {'icon' in option && <SelectOptionIcon icon={option.icon as Icon} />}
                          <span
                            className={classNames(selected ? 'font-semibold' : 'font-normal', 'ml-3 block truncate')}
                          >
                            {option.label}
                          </span>
                        </div>

                        {selected ? (
                          <span
                            className={classNames(
                              active ? 'text-white' : 'text-black',
                              'absolute inset-y-0 right-0 flex items-center pr-4'
                            )}
                          >
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        </>
      )
      }
    </Listbox >
  );
};
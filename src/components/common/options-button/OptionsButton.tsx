import * as React from 'react';
import { Listbox, Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import { classNames } from '@/const';
import { Button } from '../button';

export type OptionsButtonOption = {
  id: string;
  label: string;
  description: string;
};

type OptionsButtonProps = {
  options: OptionsButtonOption[];
  selected: OptionsButtonOption;
  setSelected: (value: OptionsButtonOption) => void;
  onClick: () => void;
  srComponentLabel?: string;  // for SR, purpose of the component (e.g. "Select a challenge type")
  srButtonLabel?: string;     // for SR, purpose of the changing button (e.g. "Change selected challenge type")
};

export const OptionsButton = ({ 
  options, 
  selected, 
  setSelected,
  onClick,
  srComponentLabel,
  srButtonLabel,
}: OptionsButtonProps) => {
  return (
    <Listbox value={selected} onChange={setSelected}>
      {({ open }) => (
        <>
          {srComponentLabel && <Listbox.Label className="sr-only">{srComponentLabel}</Listbox.Label>}
          <div className="relative">
            <div className="inline-flex divide-x divide-black rounded-lg shadow-sm">
              <div className="inline-flex divide-x divide-neutral-600 rounded-lg shadow-sm">
                <Button type="button" onClick={onClick} className="inline-flex items-center rounded-l-lg rounded-r-none border border-transparent bg-black py-2 pl-3 pr-4 text-white shadow-sm">
                  <p className="ml-2.5 text-sm font-medium">{selected.label}</p>
                </Button>
                <Listbox.Button className="inline-flex items-center rounded-l-none rounded-r-lg bg-black p-2 text-sm font-medium text-white hover:bg-black focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 focus:ring-offset-gray-50">
                  {srButtonLabel && <span className="sr-only">{srButtonLabel}</span>}
                  <ChevronDownIcon className="h-5 w-5 text-white" aria-hidden="true" />
                </Listbox.Button>
              </div>
            </div>

            <Transition
              show={open}
              as={React.Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className="absolute right-0 z-10 mt-2 w-72 origin-top-right divide-y divide-gray-200 overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                {options.map((option) => (
                  <Listbox.Option
                    key={option.label}
                    className={({ active }) =>
                      classNames(
                        active ? 'text-white bg-black' : 'text-gray-900',
                        'cursor-default select-none p-4 text-sm'
                      )
                    }
                    value={option}
                  >
                    {({ selected, active }) => (
                      <div className="flex flex-col">
                        <div className="flex justify-between">
                          <p className={selected ? 'font-semibold' : 'font-normal'}>{option.label}</p>
                        </div>
                        <p className={classNames(active ? 'text-indigo-200' : 'text-gray-500', 'mt-2')}>
                          {option.description}
                        </p>
                      </div>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        </>
      )}
    </Listbox>
  );
};
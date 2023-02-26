import * as React from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { classNames } from '@/const';

type ModalProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  children: React.ReactNode;
  className?: string;
  /**
   * If true, the modal will be full screen on mobile, but not in desktop
   */
  fullScreen?: boolean;
  smallShadow?: boolean;
}

export const Modal = ({
  open,
  setOpen,
  children,
  className,
  fullScreen = false,
  smallShadow = false,
}: ModalProps) => {
  return (
    <Transition.Root show={open} as={React.Fragment}>
      <Dialog as="div" className="relative z-40" onClose={setOpen}>
        {!smallShadow && (
          <Transition.Child
            as={React.Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500/75 transition-opacity" />
          </Transition.Child>
        )}

        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className={classNames(
            'flex min-h-full items-end justify-center text-center sm:items-center p-0',
          )}>
            <Transition.Child
              as={React.Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className={classNames(
                'relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:mx-4',
                className,
                fullScreen ? 'h-screen w-screen rounded-none shadow-none sm:h-[620px] sm:shadow-xl sm:w-auto sm:rounded-lg' : '',
                smallShadow ? 'shadow-lg' : 'shadow-none',
              )}>
                {children}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};
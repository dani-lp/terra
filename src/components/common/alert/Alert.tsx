import { classNames } from '@/const';
import { CheckCircleIcon, ExclamationTriangleIcon, XCircleIcon } from '@heroicons/react/20/solid';

type Content =
  | { type: 'warning'; title: string; message: string }
  | { type: 'error'; title: string; errors: string[] }
  | { type: 'success'; title: string; message: string };

type Props = {
  content: Content;
  shown: boolean;
  className?: string;
};

export const Alert = ({ content, shown, className }: Props) => {
  if (!shown) {
    return null;
  }

  switch (content.type) {
    case 'warning':
      return (
        <div className={classNames('rounded-md bg-yellow-50 p-4', className)}>
          <div className="flex">
            <div className="shrink-0">
              <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400" aria-hidden="true" />
            </div>
            <div className="ml-3">
              <h4 className="text-sm font-medium text-yellow-800">{content.title}</h4>
              <div className="mt-2 text-sm text-yellow-700">
                <p>{content.message}</p>
              </div>
            </div>
          </div>
        </div>
      );
    case 'error':
      return (
        <div className={classNames('rounded-md bg-red-50 p-4', className)}>
          <div className="flex">
            <div className="shrink-0">
              <XCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
            </div>
            <div className="ml-3">
              <h4 className="text-sm font-medium text-red-800">{content.title}</h4>
              <div className="mt-2 text-sm text-red-700">
                <ul role="list" className="list-disc space-y-1 pl-5">
                  {content.errors.map((error) => (
                    <li key={error}>{error}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      );
    case 'success':
      return (
        <div className={classNames('rounded-md bg-green-50 p-4', className)}>
          <div className="flex">
            <div className="shrink-0">
              <CheckCircleIcon className="h-5 w-5 text-green-400" aria-hidden="true" />
            </div>
            <div className="ml-3">
              <h4 className="text-sm font-medium text-green-800">{content.title}</h4>
              <div className="mt-2 text-sm text-green-700">
                <p>{content.message}</p>
              </div>
            </div>
          </div>
        </div>
      );
    default:
      return null;
  }
};

export type OrgDetailsListEntry = {
  label: string;
  value: string | null;
  asLink?: boolean;
  required?: boolean;
};

type Props = {
  listEntries: OrgDetailsListEntry[];
};

export const OrgDetailsList = ({ listEntries }: Props) => {
  return (
    <dl className="relative divide-y divide-neutral-200">
      {listEntries.map((entry) => (
        <div key={entry.label} className="py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
          <dt className="text-sm font-medium leading-6 text-gray-900">
            {entry.label}
            {entry.required && <span className="text-red-500"> *</span>}
          </dt>
          {entry.asLink ? (
            <a
              href={entry.value ?? '#'}
              target="_blank"
              rel="noreferrer"
              className="mt-1 text-sm leading-6 text-gray-700 underline sm:col-span-2 sm:mt-0"
            >
              {entry.value}
            </a>
          ) : (
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              {entry.value}
            </dd>
          )}
        </div>
      ))}
    </dl>
  );
};

export const OrgUsernameField = () => {
  return (
    <label htmlFor="username" className="block text-sm font-medium text-gray-700">
      Username
      <div className="mt-1 flex rounded-lg shadow-sm">
        <span className="inline-flex items-center rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 px-3 text-gray-500 sm:text-sm">
          terra.com/orgs/
        </span>
        <input
          type="text"
          name="username"
          id="username"
          autoComplete="username"
          className="block w-full min-w-0 flex-grow rounded-none rounded-r-lg border-gray-300 focus:border-black focus:ring-black sm:text-sm"
          // defaultValue={session?.user?.name ?? ''}
        />
      </div>
    </label>
  );
};
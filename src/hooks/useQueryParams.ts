import { useRouter } from 'next/router';
import type { ParsedUrlQuery } from 'querystring';

interface UseRouterParamsOptions {
  method?: 'push' | 'replace';
  shallow?: boolean;
}

export const useQueryParams = (options?: UseRouterParamsOptions) => {
  const { query, pathname, push, replace } = useRouter();

  const reload = options?.method === 'replace' ? replace : push;
  const shallow = options?.shallow ?? true;

  /**
   * Get the whole query object.
   * @returns The whole query object.
   */
  const getQuery = () => query;

  /**
   * Checks whether a param is exposed in the URL string or not.
   * @param name The name of the param.
   * @param value Optional, the param must have the specified value.
   * @returns true/false depending on the presence of the param.
   */
  const hasParam = (name: string, value?: string | number | boolean) => {
    const { [name]: param } = query;
    if (!value) {
      return !!param;
    }
    if (!param) {
      return false;
    } else if (Array.isArray(param)) {
      return param.indexOf(encodeURIComponent(value)) > -1;
    } else {
      return param === encodeURIComponent(value);
    }
  };

  /**
   * Retrieves from the URL the value of the provided param.
   * @param name The name of the param.
   * @returns The value of the param.
   */
  const getParamValue = (name: string) => {
    const value = query[name];
    return !value
      ? value
      : Array.isArray(value)
      ? value.map((el) => decodeURIComponent(el))
      : decodeURIComponent(value);
  };

  /**
   * Adds a query param to the URL string. Multiple params with the same name
   * and different values can be added.
   * @param name The name of the param.
   * @param value The value of the param.
   */
  const addParam = async (name: string, value: string | boolean | number) => {
    const { [name]: param, ...rest } = query;

    let newQuery;
    if (!param) {
      newQuery = { ...rest, [name]: encodeURIComponent(value) };
    } else if (Array.isArray(param)) {
      if (param.indexOf(encodeURIComponent(value)) > -1) return;
      newQuery = { ...rest, [name]: [...param, encodeURIComponent(value)] };
    } else {
      if (param === encodeURIComponent(value)) return;
      newQuery = { ...rest, [name]: [param, encodeURIComponent(value)] };
    }

    await reload(
      {
        pathname,
        query: newQuery,
      },
      undefined,
      { shallow },
    );
  };

  /**
   * It sets a query param in the URL to a given value. If it already exists, it
   * will be overriden.
   * @param name The name of the param.
   * @param value The value of the param, it can be single or multiple values.
   */
  const setParam = async (
    name: string,
    value?: string | boolean | number | string[] | boolean[] | number[],
  ) => {
    if (!value) {
      await removeParam(name);
      return;
    }
    const { [name]: param, ...rest } = query;
    await reload(
      {
        pathname,
        query: {
          ...rest,
          [name]: Array.isArray(value)
            ? value.map((el) => encodeURIComponent(el))
            : encodeURIComponent(value),
        },
      },
      undefined,
      { shallow },
    );
  };

  /**
   * If no argument is passed, it clears all the query params from the URL.
   * If one or more params are passed as arguments, only those will be cleared
   * from the URL.
   * @param params one or more params to remove.
   */
  const clearParams = async (...params: string[]) => {
    // Clear all params
    if (!params.length) {
      await reload(
        {
          pathname,
        },
        undefined,
        { shallow },
      );
      return;
    }
    // Clear the given params
    const newQuery = Object.keys(query).reduce((acc, curr) => {
      if (params.indexOf(curr) === -1) {
        acc[curr] = query[curr];
      }
      return acc;
    }, {} as ParsedUrlQuery);

    await reload(
      {
        pathname,
        query: newQuery,
      },
      undefined,
      { shallow },
    );
  };

  /**
   * Removes the provided params with a specific value from the URL.
   * @param name The name of the param.
   * @param value The value of the param.
   */
  const removeParam = async (
    name: string,
    value?: string | number | boolean | string[] | number[] | boolean[],
  ) => {
    const { [name]: param, ...rest } = query;

    if (!param) {
      return;
    }

    let newQuery;
    if (value && Array.isArray(param) && !Array.isArray(value)) {
      newQuery = {
        ...rest,
        [name]: param.filter((element) => element !== encodeURIComponent(value)),
      };
    } else {
      newQuery = { ...rest };
    }

    await reload(
      {
        pathname,
        query: newQuery,
      },
      undefined,
      { shallow },
    );
  };

  /**
   * Adds the query param to the URL if it's not already there or removes it
   * otherwise.
   * @param name The name of the param.
   * @param value The value of the param.
   */
  const toggleParam = async (name: string, value: string | boolean | number) => {
    const { [name]: param, ...rest } = query;

    let newQuery;
    if (!param) {
      // It doesn't exists -> add it.
      newQuery = { ...rest, [name]: encodeURIComponent(value) };
    } else if (Array.isArray(param)) {
      if (param.indexOf(encodeURIComponent(value)) > -1) {
        // There are multiple values for the same param and the value it's there
        // -> remove the value.
        newQuery = {
          ...rest,
          [name]: param.filter((element) => element !== encodeURIComponent(value)),
        };
      } else {
        // There are multiple values for the same param and the value it's not there
        // -> add the new value.
        newQuery = { ...rest, [name]: [...param, encodeURIComponent(value)] };
      }
    } else {
      if (param === encodeURIComponent(value)) {
        // The param exists with the same value -> remove it from the url.
        newQuery = { ...rest };
      } else {
        // The param exists with other values -> add the value.
        newQuery = { ...rest, [name]: [param, encodeURIComponent(value)] };
      }
    }

    await reload(
      {
        pathname,
        query: newQuery,
      },
      undefined,
      { shallow },
    );
  };

  return {
    getQuery,
    hasParam,
    getParamValue,
    addParam,
    setParam,
    clearParams,
    removeParam,
    toggleParam,
  };
};

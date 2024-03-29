import {
  jsonFetch, fullFetch,  JsonFetch,
  FullFetch, HttpError, makeHttpError,
} from "./fetch";
import { decrementRequest, incrementRequest } from "src/components/TopProgressBar";
import { delay } from "src/utils/delay";
import { isServer } from "src/utils/isServer";
import { authApis } from "./auth";
import { authApisMock } from "./auth.mock";
import { userApi } from "./user";
import { userApiMock } from "./user.mock";
import { weiboApi } from "./weibo";
import { weiboApiMock } from "./weibo.mock";
import { profileApi } from "./profile";
import { profileApiMock } from "./profile.mock";

export type ApiArgs = {
  jsonFetch: JsonFetch,
  fullFetch: FullFetch,
  makeHttpError: <T>(data: T, status: number) => HttpError<T>,
};

export type Api<T> = (actions: ApiArgs) => Record<string, T>;

export type MockApi<TApi extends (actions: ApiArgs) => any> =
  (actions: Pick<ApiArgs, "makeHttpError">) => ReturnType<TApi>;

export function createMockApi<T extends (actions: ApiArgs) => any>
(mock: MockApi<T>): MockApi<T> {
  const functions = mock({ makeHttpError });
  return Object
    .keys(functions)
    .reduce((prev, curr) => {
      prev[curr] = async (...args: any) => {
        if (!isServer()) {
          incrementRequest();
        }

        if (process.env.NODE_ENV === "development") {
          // eslint-disable-next-line max-len
          console.log(`Calling API ${functions[curr].name}, args ${JSON.stringify(args)}`);
        }
        await delay(500);
        return functions[curr](...args)
          .finally(() => {
            if (!isServer()) {
              decrementRequest();
            }});
      };
      return prev;
    }, {}) as T;
}

// changing this line during development to set USE_MOCK dynamically
const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === "1";
// const USE_MOCK = false;

// judge whether USE_MOCK here can help reduce the size of bundle
// by tree shaking mock modules at production build
// Attempted to write mock and api in the same file,
// but the mock won't be stripped.

const apis = [
  [authApis, USE_MOCK ? authApisMock : authApis],
  [userApi, USE_MOCK ? userApiMock : userApi],
  [weiboApi, USE_MOCK ? weiboApiMock : weiboApi],
  [profileApi, USE_MOCK ? profileApiMock : profileApi],
];

const computedApis = new Map<unknown, unknown>();
for (const [key, value] of apis) {
  computedApis.set(key,
    USE_MOCK
      ? createMockApi((value as MockApi<any>))
      : (value as Api<any>)({ jsonFetch, fullFetch, makeHttpError }),
  );
}


export function getApi<TR, T extends Api<TR>>(service: T): ReturnType<T> {
  return computedApis.get(service) as ReturnType<T>;
}

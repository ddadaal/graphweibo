/* eslint-disable max-len */
import type { authApis } from "./auth";
import type { MockApi } from ".";

export const authApisMock: MockApi<typeof authApis> = (({ makeHttpError }) => ({
  login: async ({ query: { username, password } }) => {
    if (username === password) {
      return { token: "123", userId: username };
    } else {
      throw makeHttpError({}, 401);
    }
  },
  register: async () => {
    return { token: "123", userId: "123" };
  },
}));



import { fromApi } from "./fetch";
import * as api from "graphweibo-api/search/search";
import { MockApi } from ".";
import { searchApi } from "./search";

export const searchApiMock: MockApi<typeof searchApi> = () => ({
  search: async () => {
    return {
      results: [
        {
          username: "ddadaal",
          weiboCount: 10,
          followCount: 1,
          followerCount: 2,
          followed: true,
          following: true,
        },
        {
          username: "cjy",
          weiboCount: 12,
          followCount: 523,
          followerCount: 243,
          followed: false,
          following: false,
        },
      ],
    };
  },
});

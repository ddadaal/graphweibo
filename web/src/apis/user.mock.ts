import { MockApi } from ".";
import { userApi } from "./user";

export const userApiMock: MockApi<typeof userApi> = () => ({
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
  follow: async () => ({}),
  unfollow: async () => ({}),
});

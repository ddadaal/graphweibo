import { MockApi } from ".";
import { userApi } from "./user";

export const userApiMock: MockApi<typeof userApi> = () => ({
  search: async () => {
    return {
      results: [
        {
          username: "ddadaal",
          userId: "1",
          weiboCount: 10,
          followCount: 1,
          followerCount: 2,
          followed: true,
          following: true,
        },
        {
          username: "cjy",
          userId: "2",
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

import { MockApi } from ".";
import { profileApi } from "./profile";

export const profileApiMock: MockApi<typeof profileApi> = () => ({
  getUserProfile: async () => ({
    profile: {
      followersCount: 10,
      followingsCount: 23,
      registerTime: "2020-12-19T14:22:38.988Z",
      userId: "123",
      username: "ddadaal",
      weiboCount: 140,
    },
  }),
});

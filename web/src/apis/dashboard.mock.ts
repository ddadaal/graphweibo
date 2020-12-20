import { fromApi } from "./fetch";
import * as getAccountProfileApi from "graphweibo-api/dashboard/getAccountProfile";
import { MockApi } from ".";
import { dashboardApi } from "./dashboard";

export const dashboardApiMock: MockApi<typeof dashboardApi> = () => ({
  getAccountProfile: async () => ({
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

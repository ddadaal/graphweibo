import { UserResult } from "./search";

export const endpoint = {
  method: "GET",
  url: "/user/followings",
} as const;

/** 查询一个用户关注的用户 */
export interface GetFollowingUsersSchema {
  querystring: {
    /** 要查询的用户ID */
    userId: string;
    /**
     * 页数。每页10项，从1开始，不设置的话，默认值为1
     * @default 1
     */
    page?: number;
  }
  responses: {
    200: {
      /** 关注这个用户的总个数 */
      totalCount: number;
      /** 此用户关注的用户 */
      followings: UserResult[];
    };
    /** 用户不存在。 */
    404: {}
  }
}

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
  }
  responses: {
    200: {
      /** 此用户关注的用户 */
      followings: UserResult[];
    };
    /** 用户不存在。 */
    404: {}
  }
}

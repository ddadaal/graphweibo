import { UserResult } from "./search";

export const endpoint = {
  method: "GET",
  url: "/user/followers",
} as const;

/** 查询关注一个用户的用户 */
export interface GetFollowersSchema {
  querystring: {
    /** 要查询的用户ID */
    userId: string;
  }
  responses: {
    200: {
      /** 关注此用户的用户 */
      followers: UserResult[];
    };
    /** 用户不存在。 */
    404: {}
  }
}

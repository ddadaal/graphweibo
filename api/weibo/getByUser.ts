import { WeiboResult } from "./getFollowings";

export const endpoint = {
  method: "GET",
  url: "/weibo",
} as const;

/**
 * 返回查询ID
 */
export interface WeiboGetByUserSchema {
  querystring: {
    /** 用户ID */
    userId: string;
  }
  responses: {
    200: {
      results: WeiboResult[];
    };
    /** 用户不存在。 */
    404: {

    }
  }
}

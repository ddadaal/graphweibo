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
    /**
     * 页数。每页10项，从1开始，不设置的话，默认值为1
     * @default 1
     */
    page?: number;
  }
  responses: {
    200: {
      totalCount: number;
      results: WeiboResult[];
    };
    /** 用户不存在。 */
    404: {

    }
  }
}

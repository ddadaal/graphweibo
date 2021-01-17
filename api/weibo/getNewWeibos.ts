import { WeiboResult } from "./getFollowings";

export const endpoint = {
  method: "GET",
  url: "/weibo/new",
} as const;

/**
 * 返回系统里最新的10条微博
 */
export interface GetNewWeibosSchema {
  querystring: {
    /**
     * 页数。每页10项，从1开始，不设置的话，默认值为1
     * @default 1
     */
    page?: number;
  }
  responses: {
    200: {
      results: WeiboResult[];
    }
  }
}

import { WeiboResult } from "./getFollowings";

export const endpoint = {
  method: "GET",
  url: "/weibo/new",
} as const;

/**
 * 返回系统里最新的10条微博
 */
export interface GetNewWeibosSchema {
  responses: {
    200: {
      results: WeiboResult[];
    }
  }
}

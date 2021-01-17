export const endpoint = {
  method: "GET",
  url: "/weibo/followings",
} as const;

const auth = true;

export interface WeiboResult {

  /** 这个微博的ID */
  weiboId: string;

  /** 发送的用户ID */
  senderId: string;

  /** 发送的用户的用户名 */
  senderUsername: string;

  /** 发送时间，应该是一个满足ISO8601的时间字符串，至少精确到秒*/
  sendTime: string;

  /** 内容 */
  content: string;
}

/**
 * 返回自己已经关注的人的微博。
 * 应该按时间倒序排列
 */
export interface WeiboGetFollowingsSchema {
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

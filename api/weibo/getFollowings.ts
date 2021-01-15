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
 * 把所有数据直接返回吧，简单一点
 * 要改以后再改
 */
export interface WeiboGetFollowingsSchema {
  responses: {
    200: {
      results: WeiboResult[];
    }
  }
}

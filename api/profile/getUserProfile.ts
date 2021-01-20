export const endpoint = {
  method: "GET",
  url: "/profile",
} as const;

export interface GetUserProfileSchema {
  querystring: {
    userId: string;
  }
  responses: {
    200: {
      profile: {
        /** 用户ID */
        userId: string;
        /** 用户名 */
        username: string;
        /** 注册时间。应该是一个ISO 8601字符串 */
        registerTime?: string;
        /** 微博数 */
        weiboCount: number;
        /** 关注的人数 */
        followingsCount: number;
        /** 被关注的人数 */
        followersCount: number;
      }
    };
    /** 没有输入userId */
    400: {}
    /** 没有找到这个用户 */
    404: {}
  }
}

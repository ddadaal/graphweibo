export const endpoint = {
  method: "GET",
  url: "/dashboard/accountProfile",
} as const;

export interface GetAccountProfileSchema {
  responses: {
    200: {
      profile: {
        /** 用户ID */
        userId: string;
        /** 用户名 */
        username: string;
        /** 注册时间。应该是一个ISO 8601字符串 */
        registerTime: string;
        /** 微博数 */
        weiboCount: number;
        /** 关注的人数 */
        followingsCount: number;
        /** 被关注的人数 */
        followersCount: number;
      }
    }
  }
}

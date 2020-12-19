export const endpoint = {
  method: "POST",
  url: "/user/follow",
} as const;

/** 关注一个用户 */
export interface FollowUserSchema {
  body: {
    /** 要关注的用户的用户ID */
    userId: string;
  };
  responses: {
    /** 关注成功 */
    200: {};
    /** 不存在这个用户 */
    404: {};
    /** 本来就已经关注这个用户 */
    405: {};
  }
}

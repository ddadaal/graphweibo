export const endpoint = {
  method: "DELETE",
  url: "/user/follow",
} as const;

const auth = true;

/** 取消关注一个用户。 */
export interface UnfollowUserSchema {
  body: {
    /** 要取消关注的用户的用户ID */
    userId: string;
  };
  responses: {
    /** 取消关注成功 */
    200: {};
    /** 不存在这个用户 */
    404: {};
    /** 本来就没有关注这个用户 */
    405: {};
  }
}

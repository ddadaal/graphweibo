export const endpoint = {
  method: "GET",
  url: "/user/search",
} as const;

export interface UserResult {
  /** 用户名 */
  username: string;
  /** 用户ID */
  userId: string;
  /**
   * 微博数量。应该是个int
   */
  weiboCount: number;

  /**
   * 关注的人数
   */
  followCount: number;

  /**
   * 被关注的人数
   */
  followerCount: number;

  /**
   * 我关注了这个用户了吗？
   * 如果当前用户自己，设置为true。
   * 如果搜索时用户没有登录，设置为false
   */
  following: boolean;

  /**
   * 这个用户关注我了吗？
   * 如果当前用户自己，设置为true。
   * 如果搜索时用户没有登录，设置为false
   */
  followed: boolean;


}

/** 根据查询字符串搜索用户 */
export interface SearchUserSchema {
  querystring: {
    /** 查询字符串 */
    query: string;
  };
  responses: {
    200: {
      /**
       * 查询结果
       */
      results: UserResult[];
    }
  }
}

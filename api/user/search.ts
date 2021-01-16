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

/**
 * 搜索用户
 * 如果参数里有userId，那么根据ID查用户，返回数组中最多只有一项
 * 如果参数里没有userId，那么一定有query，根据query查询用户。
*/
export interface SearchUserSchema {
  querystring: {
    /** 查询字符串 */
    query: string;
    /**
     * 页数。每页10项，从1开始，不设置的话，默认值为1
     * @default 1
     */
    page?: number;
  } | {
    /** 用户ID */
    userId: string;
  };
  responses: {
    200: {
      /** 总数，如果传入的是ID，那么总数最多为1。 */
      totalCount: number;
      /**
       * 对应页数的查询结果
       */
      results: UserResult[];
    }
  }
}

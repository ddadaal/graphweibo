export const endpoint = {
  method: "GET",
  url: "/search",
} as const;

export interface UserSearchResult {
  /** 用户名 */
  username: string;
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
   */
  following: boolean;

  /**
   * 这个用户关注我了吗？
   * 如果当前用户自己，设置为true。
   */
  followed: boolean;


}

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
      results: UserSearchResult[];
    }
  }
}

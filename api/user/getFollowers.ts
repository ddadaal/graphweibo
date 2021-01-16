import { UserResult } from "./search";

export const endpoint = {
  method: "GET",
  url: "/user/followers",
} as const;

/** 查询关注一个用户的用户 */
export interface GetFollowersSchema {
  querystring: {
    /** 要查询的用户ID */
    userId: string;
    /**
     * 页数。每页10项，从1开始，不设置的话，默认值为1
     * @default 1
     */
    page?: number;
  }
  responses: {
    200: {
      /** 关注这个用户的总个数 */
      totalCount: number;
      /** 对应页的关注此用户的用户。
       * 如果对应页数超过总量，则返回空数组
       * 比如：总共35，每页10个，一共4页。
       * 如果page设置为4，返回最后5个；如果page>=5，这个是空数组。
       */
      followers: UserResult[];
    };
    /** 用户不存在。 */
    404: {}
  }
}

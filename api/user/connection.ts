export const endpoint = {
  method: "GET",
  url: "/user/connection",
} as const;

export interface UserConnectionUser {
  userId: string;
  username: string;
}

/** 查询两个用户之间的四条边之内的关注关系 */
export interface UserConnectionSchema {
  querystring: {
    fromUserId: string;
    toUserId: string;
  };
  responses: {
    /** 关系 */
    200: {
      /** 图里所有用户的ID到用户名的映射 */
      usernames: Record<string, string>;

      /**
       * 所有源用户和目标用户之间的路径。
       * 每个节点用ID表示，每个小数组为一条路径。
       * 路径中需要包含源节点和目标节点
       **/
      paths: string[][];
    };
    /** 某个用户不存在 */
    404: {
      /** 来源用户不存在 */
      fromUserNotExists: boolean;
      /** 目标用户不存在 */
      toUserNotExists: boolean;
    };
  }
}

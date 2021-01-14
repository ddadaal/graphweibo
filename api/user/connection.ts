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
      /** 源用户的ID和用户名 */
      fromUser: UserConnectionUser;
      /** 目标用户的ID和用户名 */
      toUser: UserConnectionUser;
      /** 中间用户的ID和用户名，不包含源用户和目标用户*/
      intermediateUsers: UserConnectionUser[];
      /**
       * 所有源用户和目标用户之间的路径。
       * 每个节点用ID表示，每个小数组为一条路径。
       * 路径中需要包含源节点和目标节点
       **/
      paths: string[][];
    };
    /** 某个用户不存在 */
    404: {
      /** 不存在的用户。 */
      user: "from" | "to";
    };
  }
}

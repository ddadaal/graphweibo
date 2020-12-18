export const endpoint = {
  method: "GET",
  url: "/user/token",
} as const;

/** 使用用户名和密码登录 */
export interface LoginSchema {
  querystring: {
    /** 用户名 */
    username: string;
    /** 密码 */
    password: string;
  };
  responses: {
    /** 登录成功 */
    200: {
      /**
       * 用户 ID
       */
      userId: string;
      /**
       * 用户的JWT token。
       */
      token: string;
    };
    /** 用户名和密码无效。 */
    401: {};
  }
}

export const endpoint = {
  method: "POST" ,
  url: "/user",
} as const;

/** 注册 */
export interface RegisterSchema {
  body: {
    /** 注册用户名 */
    username: string;
    /** 密码 */
    password: string;
  };
  responses: {
    /** 注册成功 */
    201: {
      /** 用户的JWT token */
      token: string;
      /** 用户ID */
      userId: string;
    },
    /** 用户名已经存在 */
    409: {

    }
  }
}


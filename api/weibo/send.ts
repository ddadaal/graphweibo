export const endpoint = {
  method: "POST",
  url: "/weibo",
} as const;

const auth = true;

export interface SendWeiboSchema {
  body: {
    /** 微博内容 */
    content: string;
  };
  responses: {
    /** 发送成功 */
    201: {};
  };
}

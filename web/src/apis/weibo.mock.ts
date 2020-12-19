import { MockApi } from ".";
import { weiboApi } from "./weibo";

export const weiboApiMock: MockApi<typeof weiboApi> = () => ({
  get: async () => {
    return {
      results: [
        {
          weiboId: "1",
          senderUsername: "ddadaal",
          senderId: "1",
          sendTime: "2020-12-19T14:22:38.988Z",
          content: "微博测试1",
        },
        {
          weiboId: "2",
          senderUsername: "ddadaal",
          senderId: "1",
          sendTime: "2020-12-19T14:22:38.988Z",
          content: "微博测试1".repeat(20),
        },
      ],
    };
  },
  send: async () => ({}),
});

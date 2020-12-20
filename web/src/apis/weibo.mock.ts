import { MockApi } from ".";
import { weiboApi } from "./weibo";

const dummyResults =[
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
];

export const weiboApiMock: MockApi<typeof weiboApi> = () => ({
  get: async () => {
    return { results: dummyResults };
  },
  send: async () => ({}),
  getByUser: async () => ({ results: dummyResults }),
  getFollowings: async () => ({ results: dummyResults }),
});

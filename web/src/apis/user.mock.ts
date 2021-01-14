import { range } from "src/utils/array";
import { MockApi } from ".";
import { userApi } from "./user";

const dummyResults = [
  {
    username: "ddadaal",
    userId: "1",
    weiboCount: 10,
    followCount: 1,
    followerCount: 2,
    followed: true,
    following: true,
  },
  {
    username: "cjy",
    userId: "2",
    weiboCount: 12,
    followCount: 523,
    followerCount: 243,
    followed: false,
    following: false,
  },
];

// example graph
const exampleGraph = {
  fromUser: { userId: "1", username: "user1" },
  toUser: { userId: "5", username: "user5" },
  intermediateUsers: range(2, 5).map((i) => ({ userId: `${i}`, username: `user${i}` })),
  paths: [
    ["1", "5"],
    ["1", "2", "3", "5"],
    ["1", "3", "5"],
    ["1", "2", "4", "5"],
  ],
};

export const userApiMock: MockApi<typeof userApi> = () => ({
  search: async () => {
    return { results: dummyResults };
  },
  follow: async () => ({}),
  unfollow: async () => ({}),
  getFollowers: async () => ({ followers: dummyResults }),
  getFollowings: async () => ({ followings: dummyResults }),
  getUserConnection: async ({ query }) => {
    return exampleGraph;
  },
});

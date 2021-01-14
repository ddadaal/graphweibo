import { fromApi } from "./fetch";
import * as searchApi from "graphweibo-api/user/search";
import * as followApi from "graphweibo-api/user/follow";
import * as unfollowApi from "graphweibo-api/user/unfollow";
import * as getFollowersApi from "graphweibo-api/user/getFollowers";
import * as getFollowingsApi from "graphweibo-api/user/getFollowings";
import * as connectionApi from "graphweibo-api/user/connection";

export const userApi = () => ({
  search: fromApi<searchApi.SearchUserSchema>(searchApi.endpoint),
  follow: fromApi<followApi.FollowUserSchema>(followApi.endpoint),
  unfollow: fromApi<unfollowApi.UnfollowUserSchema>(unfollowApi.endpoint),
  getFollowers: fromApi<getFollowersApi.GetFollowersSchema>(getFollowersApi.endpoint),
  getFollowings:
    fromApi<getFollowingsApi.GetFollowingUsersSchema>(getFollowingsApi.endpoint),
  getUserConnection:
    fromApi<connectionApi.UserConnectionSchema>(connectionApi.endpoint),
});

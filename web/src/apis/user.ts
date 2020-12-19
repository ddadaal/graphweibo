import { fromApi } from "./fetch";
import * as searchApi from "graphweibo-api/user/search";
import * as followApi from "graphweibo-api/user/follow";
import * as unfollowApi from "graphweibo-api/user/unfollow";

export const userApi = () => ({
  search: fromApi<searchApi.SearchUserSchema>(searchApi.endpoint),
  follow: fromApi<followApi.FollowUserSchema>(followApi.endpoint),
  unfollow: fromApi<unfollowApi.UnfollowUserSchema>(unfollowApi.endpoint),
});

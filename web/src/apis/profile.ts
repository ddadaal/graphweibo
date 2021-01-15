import { fromApi } from "./fetch";
import * as getUserProfileApi from "graphweibo-api/profile/getUserProfile";

export const profileApi = () => ({
  getUserProfile:
    fromApi<getUserProfileApi.GetUserProfileSchema>(getUserProfileApi.endpoint),
});

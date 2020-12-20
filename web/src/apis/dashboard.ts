import { fromApi } from "./fetch";
import * as getAccountProfileApi from "graphweibo-api/dashboard/getAccountProfile";

export const dashboardApi = () => ({
  getAccountProfile:
    fromApi<getAccountProfileApi.GetAccountProfileSchema>(getAccountProfileApi.endpoint),
});

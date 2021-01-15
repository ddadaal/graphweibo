import { fromApi } from "./fetch";
import * as sendApi from "graphweibo-api/weibo/send";
import * as getFollowingsApi from "graphweibo-api/weibo/getFollowings";
import * as getByUserApi from "graphweibo-api/weibo/getByUser";
import * as getNewWeibosApi from "graphweibo-api/weibo/getNewWeibos";

// eslint-disable-next-line object-curly-newline
export const weiboApi = () => ({
  send: fromApi<sendApi.SendWeiboSchema>(sendApi.endpoint),
  getFollowings:
    fromApi<getFollowingsApi.WeiboGetFollowingsSchema>(getFollowingsApi.endpoint),
  getByUser: fromApi<getByUserApi.WeiboGetByUserSchema>(getByUserApi.endpoint),
  getNewWeibos: fromApi<getNewWeibosApi.GetNewWeibosSchema>(getNewWeibosApi.endpoint),
});

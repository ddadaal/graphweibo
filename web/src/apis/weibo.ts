import { fromApi } from "./fetch";
import * as sendApi from "graphweibo-api/weibo/send";
import * as getApi from "graphweibo-api/weibo/get";

// eslint-disable-next-line object-curly-newline
export const weiboApi = () => ({
  send: fromApi<sendApi.SendWeiboSchema>(sendApi.endpoint),
  get: fromApi<getApi.GetWeiboSchema>(getApi.endpoint),
});

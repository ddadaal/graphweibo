/* eslint-disable max-len */
import { fromApi } from "./fetch";
import * as loginApi from "graphweibo-api/auth/login";
import * as registerApi from "graphweibo-api/auth/register";

export const authApis = () => ({
  login: fromApi<loginApi.LoginSchema>(loginApi.endpoint),
  register: fromApi<registerApi.RegisterSchema>(registerApi.endpoint),
});



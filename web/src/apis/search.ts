import { fromApi } from "./fetch";
import * as api from "graphweibo-api/search/search";

export const searchApi = () => ({ search: fromApi<api.SearchUserSchema>(api.endpoint) });

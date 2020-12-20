import { GetAccountProfileSchema } from "graphweibo-api/dashboard/getAccountProfile";

export type AccountProfile = GetAccountProfileSchema["responses"]["200"]["profile"];

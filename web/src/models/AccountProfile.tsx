import { GetUserProfileSchema } from "graphweibo-api/profile/getUserProfile";

export type AccountProfile = GetUserProfileSchema["responses"]["200"]["profile"];

import { UserResult } from "graphweibo-api/user/search";
import { Box } from "grommet";
import { NextPage } from "next";
import React, { useState } from "react";
import { getApi } from "src/apis";
import { dashboardApi } from "src/apis/dashboard";
import { HttpError } from "src/apis/fetch";
import { userApi } from "src/apis/user";
import { UnifiedErrorPage } from "src/components/errors/UnifiedErrorPage";
import { UserListItem } from "src/components/UserListItem";
import { DashboardLayout } from "src/layouts/DashboardLayout";
import { AccountProfile } from "src/models/AccountProfile";
import { getCurrentUserInCookie } from "src/stores/UserStore";
import { requireAuth } from "src/utils/requireAuth";
import { SSRPageProps } from "src/utils/ssr";

type Props = SSRPageProps<{
  profile: AccountProfile;
  followings: UserResult[];
}>;

const api = getApi(dashboardApi);
const uapi = getApi(userApi);

const DashboardFollowingsPage: NextPage<Props> =
  requireAuth()<Props>((props) => {

    if ("error" in props) {
      return <UnifiedErrorPage error={props.error} />;
    }

    const { followings } = props;
    const [profile, setProfile] = useState(props.profile);

    return (
      <DashboardLayout
        profile={profile}
        tab="followings"
      >
        <Box gap="large">
          {followings.map((w) => (
            <UserListItem
              key={w.userId}
              user={w}
              onUserFollow={() =>
                setProfile((p) => ({ ...p, followingsCount: p.followingsCount+1 }))}
              onUserUnfollow={() =>
                setProfile((p) => ({ ...p, followingsCount: p.followingsCount-1 }))}
            />
          ))}
        </Box>
      </DashboardLayout>
    );
  });


DashboardFollowingsPage.getInitialProps = async (ctx) => {
  const user = getCurrentUserInCookie(ctx);

  if (!user) {
    return { error: { status: 401, data: {} } };
  }

  const data = await Promise.all([
    api.getAccountProfile({}),
    uapi.getFollowings({ query: { userId: user.userId } }),
  ])
    .then(([{ profile },{ followings }]) => ({ profile, followings }))
    .catch((r: HttpError) => ({ error: r }));

  return data;
};

export default DashboardFollowingsPage ;

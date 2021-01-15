import { UserResult } from "graphweibo-api/user/search";
import { Box } from "grommet";
import { NextPage } from "next";
import React, { useState } from "react";
import { getApi } from "src/apis";
import { profileApi } from "src/apis/profile";
import { HttpError } from "src/apis/fetch";
import { userApi } from "src/apis/user";
import { UnifiedErrorPage } from "src/components/errors/UnifiedErrorPage";
import { UserListItem } from "src/components/UserListItem";
import { DashboardLayout } from "src/layouts/DashboardLayout";
import { AccountProfile } from "src/models/AccountProfile";
import { requireAuth } from "src/utils/requireAuth";
import { SSRPageProps } from "src/utils/ssr";
import { queryToString } from "src/utils/querystring";

type Props = SSRPageProps<{
  profile: AccountProfile;
  followings: UserResult[];
}>;

const api = getApi(profileApi);
const uapi = getApi(userApi);

const DashboardFollowingsPage: NextPage<Props> = (props) => {

  if ("error" in props) {
    return <UnifiedErrorPage error={props.error} />;
  }

  const { followings } = props;
  const [profile, setProfile] = useState(props.profile);

  return (
    <DashboardLayout
      profile={profile}
      userId={profile.userId}
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
};

DashboardFollowingsPage.getInitialProps = async (ctx) => {
  const userId = queryToString(ctx.query.userId);

  if (!userId) {
    return { error: { status: 400, data: {} } };
  }


  const data = await Promise.all([
    api.getUserProfile({ query: { userId } }),
    uapi.getFollowings({ query: { userId } }),
  ])
    .then(([{ profile },{ followings }]) => ({ profile, followings }))
    .catch((r: HttpError) => ({ error: r }));

  return data;
};

export default DashboardFollowingsPage ;
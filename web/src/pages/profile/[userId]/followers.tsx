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
import { SSRPageProps } from "src/utils/ssr";
import { queryToIntOrDefault, queryToString } from "src/utils/querystring";
import {
  NoUserIdErrorPage,
  UserNotExistErrorPage,
} from "src/components/dashboard/errorPages";
import { Pagination } from "src/components/Pagination";

type Props = SSRPageProps<{
  page: number;
  userId: string;
  profile: AccountProfile;
  totalCount: number;
  followers: UserResult[];
}>;

const api = getApi(profileApi);
const uapi = getApi(userApi);

const DashboardFollowersPage: NextPage<Props> = (props) => {

  if ("error" in props) {
    if (props.error.status === 400) {
      return <NoUserIdErrorPage />;
    } else if (props.error.status === 404) {
      return <UserNotExistErrorPage />;
    }
    return <UnifiedErrorPage error={props.error} />;
  }

  const { followers } = props;
  const [profile, setProfile] = useState(props.profile);

  return (
    <DashboardLayout
      userId={profile.userId}
      profile={profile}
      tab="followers"
    >
      <Box gap="large">
        {followers.map((w) => (
          <UserListItem
            key={w.userId}
            user={w}
            onUserFollow={() =>
              setProfile((p) => ({ ...p, followingsCount: p.followingsCount+1 }))}
            onUserUnfollow={() =>
              setProfile((p) => ({ ...p, followingsCount: p.followingsCount-1 }))}
          />
        ))}
        <Box direction="row" justify="center">
          <Pagination
            currentPage={props.page}
            itemsPerPage={10}
            totalItemsCount={props.totalCount}
            getUrl={(i) => ({
              pathname: "/profile/[userId]/followers",
              query: { userId: props.userId, page: i },
            })}
          />
        </Box>
      </Box>
    </DashboardLayout>
  );
};


DashboardFollowersPage.getInitialProps = async (ctx) => {
  const userId = queryToString(ctx.query.userId);

  if (!userId) {
    return { error: { status: 400, data: {} } };
  }

  const page = queryToIntOrDefault(ctx.query.page, 1);

  const data = await Promise.all([
    api.getUserProfile({ query: { userId } }),
    uapi.getFollowers({ query: { userId, page } }),
  ])
    .then(([{ profile },{ totalCount, followers }]) =>
      ({ profile, followers, totalCount, page, userId }))
    .catch((r: HttpError) => ({ error: r }));

  return data;
};

export default DashboardFollowersPage;

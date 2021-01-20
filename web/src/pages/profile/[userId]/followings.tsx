import { UserResult } from "graphweibo-api/user/search";
import { Box } from "grommet";
import { NextPage } from "next";
import React, { useCallback } from "react";
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
import { useRouter } from "next/router";

type Props = SSRPageProps<{
  page: number;
  userId: string;
  totalCount: number;
  profile: AccountProfile;
  followings: UserResult[];
}>;

const api = getApi(profileApi);
const uapi = getApi(userApi);

const DashboardFollowingsPage: NextPage<Props> = (props) => {

  if ("error" in props) {
    if (props.error.status === 400) {
      return <NoUserIdErrorPage />;
    } else if (props.error.status === 404) {
      return <UserNotExistErrorPage />;
    }
    return <UnifiedErrorPage error={props.error} />;
  }

  const router = useRouter();
  const refresh = useCallback(() => router.replace(router.asPath), [router.asPath]);

  return (
    <DashboardLayout
      profile={props.profile}
      userId={props.profile.userId}
      tab="followings"
    >
      <Box gap="large">
        {props.followings.map((w) => (
          <UserListItem
            key={w.userId}
            user={w}
            onUserFollow={refresh}
            onUserUnfollow={refresh}
          />
        ))}
      </Box>
      <Box direction="row" justify="center">
        <Pagination
          currentPage={props.page}
          itemsPerPage={10}
          totalItemsCount={props.totalCount}
          getUrl={(i) => ({
            pathname: "/profile/[userId]/followings",
            query: { userId: props.userId, page: i },
          })}
        />
      </Box>
    </DashboardLayout>
  );
};

DashboardFollowingsPage.getInitialProps = async (ctx) => {
  const userId = queryToString(ctx.query.userId);

  if (!userId) {
    return { error: { status: 400, data: {} } };
  }

  const page = queryToIntOrDefault(ctx.query.page, 1);


  const data = await Promise.all([
    api.getUserProfile({ query: { userId } }),
    uapi.getFollowings({ query: { userId } }),
  ])
    .then(([{ profile  },{ followings, totalCount }]) =>
      ({ profile, followings, page, userId, totalCount }))
    .catch((r: HttpError) => ({ error: r }));

  return data;
};

export default DashboardFollowingsPage ;

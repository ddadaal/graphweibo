import { WeiboResult } from "graphweibo-api/weibo/getFollowings";
import { Box } from "grommet";
import { NextPage } from "next";
import React from "react";
import { getApi } from "src/apis";
import { HttpError } from "src/apis/fetch";
import { profileApi } from "src/apis/profile";
import { weiboApi } from "src/apis/weibo";
import {
  NoUserIdErrorPage,
  UserNotExistErrorPage,
} from "src/components/dashboard/errorPages";
import { UnifiedErrorPage } from "src/components/errors/UnifiedErrorPage";
import { Pagination } from "src/components/Pagination";
import { WeiboListItem } from "src/components/WeiboListItem";
import { DashboardLayout } from "src/layouts/DashboardLayout";
import { AccountProfile } from "src/models/AccountProfile";
import { queryToIntOrDefault, queryToString } from "src/utils/querystring";
import { SSRPageProps } from "src/utils/ssr";

type Props = SSRPageProps<{
  page: number;
  userId: string;
  totalCount: number;
  profile: AccountProfile;
  weibos: WeiboResult[];
}>;

const api = getApi(profileApi);
const wapi = getApi(weiboApi);

const DashboardPage: NextPage<Props> = (props) => {

  if ("error" in props) {
    if (props.error.status === 400) {
      return <NoUserIdErrorPage />;
    } else if (props.error.status === 404) {
      return <UserNotExistErrorPage />;
    }
    return <UnifiedErrorPage error={props.error} />;
  }

  const { profile, weibos } = props;

  return (
    <DashboardLayout
      profile={profile}
      userId={profile.userId}
      tab="weibo"
    >
      <Box gap="large">
        {weibos.map((w) => (
          <WeiboListItem
            key={w.weiboId}
            weibo={w}
          />
        ))}
      </Box>
      <Box direction="row" justify="center">
        <Pagination
          currentPage={props.page}
          itemsPerPage={10}
          totalItemsCount={props.totalCount}
          getUrl={(i) => ({
            pathname: "/profile/[userId]",
            query: { userId: props.userId, page: i },
          })}
        />
      </Box>
    </DashboardLayout>
  );
};


DashboardPage.getInitialProps = async (ctx) => {
  const userId = queryToString(ctx.query.userId);

  if (!userId) {
    return { error: { status: 400, data: {} } };
  }

  const page = queryToIntOrDefault(ctx.query.page, 1);

  const data = await Promise.all([
    api.getUserProfile({ query: { userId } }),
    wapi.getByUser({ query: { userId, page } }),
  ])
    .then(([{ profile },{ results: weibos, totalCount }]) =>
      ({ profile, weibos, totalCount, userId, page }))
    .catch((r: HttpError) => ({ error: r }));

  return data;
};

export default DashboardPage;

import { WeiboResult } from "graphweibo-api/weibo/getFollowings";
import { Box } from "grommet";
import { NextPage } from "next";
import React from "react";
import { getApi } from "src/apis";
import { dashboardApi } from "src/apis/dashboard";
import { HttpError } from "src/apis/fetch";
import { weiboApi } from "src/apis/weibo";
import { UnifiedErrorPage } from "src/components/errors/UnifiedErrorPage";
import { WeiboListItem } from "src/components/WeiboListItem";
import { DashboardLayout } from "src/layouts/DashboardLayout";
import { AccountProfile } from "src/models/AccountProfile";
import { getCurrentUserInCookie } from "src/stores/UserStore";
import { requireAuth } from "src/utils/requireAuth";
import { SSRPageProps } from "src/utils/ssr";

type Props = SSRPageProps<{
  profile: AccountProfile;
  weibos: WeiboResult[];
}>;

const api = getApi(dashboardApi);
const wapi = getApi(weiboApi);

const DashboardPage: NextPage<Props> =
  requireAuth()<Props>((props) => {

    if ("error" in props) {
      return <UnifiedErrorPage error={props.error} />;
    }

    const { profile, weibos } = props;

    return (
      <DashboardLayout
        profile={profile}
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
      </DashboardLayout>
    );
  });


DashboardPage.getInitialProps = async (ctx) => {
  const user = getCurrentUserInCookie(ctx);

  if (!user) {
    return { error: { status: 401, data: {} } };
  }

  const data = await Promise.all([
    api.getAccountProfile({}),
    wapi.getByUser({ query: { userId: user.userId } }),
  ])
    .then(([{ profile },{ results: weibos }]) => ({ profile, weibos }))
    .catch((r: HttpError) => ({ error: r }));

  return data;
};

export default DashboardPage;

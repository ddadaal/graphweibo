import { Box } from "grommet";
import { NextPage } from "next";
import React, { useState } from "react";
import { getApi } from "src/apis";
import { dashboardApi } from "src/apis/dashboard";
import { HttpError } from "src/apis/fetch";
import { AccountProfileShowcase } from "src/components/dashboard/AccountProfileShowcase";
import { UnifiedErrorPage } from "src/components/errors/UnifiedErrorPage";
import { AccountProfile } from "src/models/AccountProfile";
import { getCurrentUserInCookie } from "src/stores/UserStore";
import { SSRPageProps } from "src/utils/ssr";

type Props = SSRPageProps<{
  profile: AccountProfile;
}>;

const api = getApi(dashboardApi);

const DashboardPage: NextPage<Props> = (props) => {
  if ("error" in props) {
    return <UnifiedErrorPage error={props.error} />;
  }

  const [info, setInfo] = useState(props.profile);

  return (
    <Box fill gap="large" alignSelf="center" width={{ max: "large" }}>
      <AccountProfileShowcase
        registerTime={info.registerTime}
        userId={info.userId}
        username={info.username}
      />
    </Box>
  );
};

DashboardPage.getInitialProps = async (ctx) => {
  const user = getCurrentUserInCookie(ctx);

  if (!user) {
    return { error: { status: 401, data: {} } };
  }

  const data = await api.getAccountProfile({})
    .catch((r: HttpError) => ({ error: r }));

  return data;
};

export default DashboardPage;

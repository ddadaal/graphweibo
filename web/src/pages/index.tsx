import React from "react";
import { Box } from "grommet";
import { WeiboInput } from "src/components/WeiboInput";
import { NextPage } from "next";
import { getApi } from "src/apis";
import { weiboApi } from "src/apis/weibo";
import { SSRPageProps } from "src/utils/ssr";
import { HttpError } from "src/apis/fetch";
import { UnifiedErrorPage } from "src/components/errors/UnifiedErrorPage";
import { WeiboListItem } from "src/components/WeiboListItem";
import { WeiboResult } from "graphweibo-api/weibo/getFollowings";
import { getCurrentUserInCookie } from "src/stores/UserStore";

const api = getApi(weiboApi);

type Props = SSRPageProps<{
  results: WeiboResult[];
}>;


const Home: NextPage<Props> = (props) => {
  if ("error" in props) {
    return <UnifiedErrorPage error={props.error} />;
  }

  return (
    <Box fill gap="large" alignSelf="center" width={{ max: "large" }}>
      <Box>
        <WeiboInput />
      </Box>
      <Box gap="large">
        {
          props.results.map((r) => (
            <WeiboListItem
              key={r.weiboId}
              weibo={r}
            />
          ))
        }
      </Box>
    </Box>
  );
};

Home.getInitialProps = async (ctx) => {
  const user = getCurrentUserInCookie(ctx);

  const data = await (
    user ? api.getFollowings({}) : api.getNewWeibos({})
  )
    .catch((r: HttpError) => ({ error: r }));

  return data;
};


export default Home;

import React from "react";
import { Box, TextArea } from "grommet";
import { Logo } from "src/components/Logo";
import { WeiboInput } from "src/components/WeiboInput";
import { NextPage } from "next";
import { getApi } from "src/apis";
import { weiboApi } from "src/apis/weibo";
import { GetWeiboResult } from "graphweibo-api/weibo/get";
import { SSRPageProps } from "src/utils/ssr";
import { HttpError } from "src/apis/fetch";
import { UnifiedErrorPage } from "src/components/errors/UnifiedErrorPage";
import { WeiboListItem } from "src/components/WeiboListItem";

const api = getApi(weiboApi);

type Props = SSRPageProps<{
  results: GetWeiboResult[];
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

Home.getInitialProps = async (context) => {
  const data = await api.get({})
    .catch((r: HttpError) => ({ error: r }));

  return data;
};


export default Home;

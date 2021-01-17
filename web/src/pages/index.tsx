import React, { useRef, useState } from "react";
import { Box, InfiniteScroll } from "grommet";
import { WeiboInput } from "src/components/WeiboInput";
import { NextPage } from "next";
import { getApi } from "src/apis";
import { weiboApi } from "src/apis/weibo";
import { SSRPageProps } from "src/utils/ssr";
import { HttpError } from "src/apis/fetch";
import { UnifiedErrorPage } from "src/components/errors/UnifiedErrorPage";
import { WeiboListItem } from "src/components/WeiboListItem";
import { WeiboResult } from "graphweibo-api/weibo/getFollowings";
import { getCurrentUserInCookie, UserStore } from "src/stores/UserStore";
import { useStore } from "simstate";
import { useHttpRequest } from "src/utils/http";

const api = getApi(weiboApi);

type Props = SSRPageProps<{
  results: WeiboResult[];
}>;


const Home: NextPage<Props> = (props) => {
  if ("error" in props) {
    return <UnifiedErrorPage error={props.error} />;
  }

  const page = useRef(1);
  const userStore = useStore(UserStore);

  const [items, setItems] = useState(props.results);
  const [loading, setLoading] = useState(false);

  const request = useHttpRequest(setLoading);

  const onMore = () => request(async () => {
    const newPage = page.current + 1;
    const newWeibos = userStore.user
      ? await api.getFollowings({ query: { page: newPage } })
      : await api.getNewWeibos({ query: { page: newPage } });
    page.current = newPage;
    setItems((items) => [...items, ...newWeibos.results ]);
  });

  return (
    <Box fill gap="large" alignSelf="center" width={{ max: "large" }}>
      <Box>
        <WeiboInput />
      </Box>
      <Box gap="large">
        <InfiniteScroll items={items} onMore={onMore}>
          {(r: WeiboResult) => (
            <Box key={r.weiboId} margin={{ vertical: "small" }}>
              <WeiboListItem
                weibo={r}
              />
            </Box>
          )}
        </InfiniteScroll>
      </Box>
    </Box>
  );
};

Home.getInitialProps = async (ctx) => {
  const user = getCurrentUserInCookie(ctx);

  const data = await (
    user ? api.getFollowings({ query: {} }) : api.getNewWeibos({ query: {} })
  )
    .catch((r: HttpError) => ({ error: r }));

  return data;
};


export default Home;

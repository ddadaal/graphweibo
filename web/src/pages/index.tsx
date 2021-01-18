import React, { useCallback, useEffect, useRef, useState } from "react";
import { Anchor, Box, InfiniteScroll } from "grommet";
import { WeiboInput } from "src/components/WeiboInput";
import { NextPage } from "next";
import { getApi } from "src/apis";
import { weiboApi } from "src/apis/weibo";
import { SSRPageProps } from "src/utils/ssr";
import { HttpError } from "src/apis/fetch";
import { UnifiedErrorPage } from "src/components/errors/UnifiedErrorPage";
import { WeiboListItem } from "src/components/WeiboListItem";
import { WeiboResult } from "graphweibo-api/weibo/getFollowings";
import { getCurrentUserInCookie, User, UserStore } from "src/stores/UserStore";
import { useStore } from "simstate";
import { useHttpRequest } from "src/utils/http";
import { LocalizedString } from "simstate-i18n";
import { lang } from "src/i18n";
import { isInViewport } from "src/utils/dom";
import { ScrollEventStore } from "src/stores/ScrollEventStore";

const root = lang.pages.index;

const api = getApi(weiboApi);

type Props = SSRPageProps<{
  results: WeiboResult[];
}>;

function load(user: User | null, page = 1) {
  return user
    ? api.getFollowings({ query: { page } })
    : api.getNewWeibos({ query: { page } });

}

const Home: NextPage<Props> = (props) => {
  if ("error" in props) {
    return <UnifiedErrorPage error={props.error} />;
  }

  const page = useRef(1);
  const userStore = useStore(UserStore);

  const [items, setItems] = useState(props.results);
  const [loading, setLoading] = useState(false);

  const loadingRef = useRef(false);

  const request = useHttpRequest(setLoading);

  const onMore = useCallback(() => {
    if (loadingRef.current) { return; }
    loadingRef.current = true;
    request(async () => {
      const newPage = page.current + 1;
      const newWeibos = await load(userStore.user, newPage);
      page.current = newPage;
      setItems((items) => [...items, ...newWeibos.results ]);
    }).finally(() => {
      loadingRef.current = false;
    });
  }, [page, userStore.user]);

  const moreRef = useRef<HTMLDivElement | null>(null);

  const eventStore = useStore(ScrollEventStore);

  const onScroll = useCallback(() => {
    if (isInViewport(moreRef.current!)) {
      onMore();
    }
  }, []);

  useEffect(() => {
    eventStore.register(onScroll);
    return () => eventStore.unregister(onScroll);
  }, []);

  const reload = useCallback(() => {
    request(async () => {
      const weibos = await load(userStore.user);
      page.current = 1;
      setItems(weibos.results);
    });
  }, [userStore.user]);

  // reload when user changes
  useEffect(() => {
    reload();
  }, [reload]);

  return (
    <Box fill gap="large" alignSelf="center" width={{ max: "large" }} >
      <Box>
        <WeiboInput onSubmitCompleted={reload}/>
      </Box>
      <Box gap="large">
        <InfiniteScroll items={items}>
          {(r: WeiboResult) => (
            <Box key={r.weiboId} margin={{ vertical: "small" }}>
              <WeiboListItem
                weibo={r}
              />
            </Box>
          )}
        </InfiniteScroll>
        <Box pad="small" flex fill border align="center" ref={moreRef}>
          <Anchor disabled={loading} onClick={onMore}>
            <LocalizedString id={loading ? root.moreLoading : root.more}/>
          </Anchor>
        </Box>
      </Box>
    </Box>
  );
};

Home.getInitialProps = async (ctx) => {
  const user = getCurrentUserInCookie(ctx);

  const data = await load(user)
    .catch((r: HttpError) => ({ error: r }));

  return data;
};


export default Home;

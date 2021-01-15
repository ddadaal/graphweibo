import { UserConnectionSchema } from "graphweibo-api/user/connection";
import { Box } from "grommet";
import { NextPage } from "next";
import React, { useCallback, useEffect } from "react";
import { getApi } from "src/apis";
import { HttpError } from "src/apis/fetch";
import { userApi } from "src/apis/user";
import { UnifiedErrorPage } from "src/components/errors/UnifiedErrorPage";
import { UserGraph } from "src/components/connection/UserGraph";
import { SSRPageProps } from "src/utils/ssr";
import { isServer } from "src/utils/isServer";
import { useRouter } from "next/router";
import { useHttpErrorHandler } from "src/utils/http";
import { useAsync } from "react-async";
import { queryToString } from "src/utils/querystring";
import { useFirstMount } from "src/utils/useFirstMount";
import { OverlayLoading } from "src/components/loading/OverlayLoading";

const api = getApi(userApi);

type Props = SSRPageProps<{
  response: UserConnectionSchema["responses"]["200"]
}>;

const getConnection = ([fromId, toId]: [string, string]) =>
  api.getUserConnection({ query: { fromUserId: fromId, toUserId: toId } });

interface SearchQuery {
  from?: string;
  to?: string;
}

export const ConnectionPage: NextPage<Props> = (props) => {

  const router = useRouter();

  const query = router.query as SearchQuery;

  if ("error" in props) {
    return <UnifiedErrorPage error={props.error} />;
  }

  const errorHandler = useHttpErrorHandler();

  const { data, isPending, run } = useAsync({
    deferFn: getConnection,
    initialValue: props.response,
    onReject: errorHandler,
  });

  const firstMount = useFirstMount();

  useEffect(() => {
    if (!firstMount) {
      run(query);
    }
  }, [query]);

  const updateQuery = useCallback((newQuery: Partial<SearchQuery>) => {
    const combinedQuery = { ...query, ...newQuery };
    router.push({ pathname: "/connection", query: combinedQuery });
  }, [router, run, query]);

  // opt out SSR for the UserGraph component
  return (
    <Box>
      { isServer() ? undefined
        : data ? <UserGraph {...data} />
          : <OverlayLoading loading={true} />
      }
    </Box>
  );
};

ConnectionPage.getInitialProps = async (context) => {
  const { from, to } = context.query as SearchQuery;

  const data = await getConnection([from, to])
    .catch((r: HttpError) => ({ error: r }));

  return { response: data };
};

export default ConnectionPage;

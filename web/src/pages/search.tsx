import React, { useCallback, useEffect, useState } from "react";
import { Box } from "grommet";
import { useRouter } from "next/router";
import { useAsync } from "react-async";
import { getApi } from "src/apis";
import { NextPage } from "next";
import { OverlayLoading } from "src/components/loading/OverlayLoading";
import { queryToIntOrDefault, queryToString } from "src/utils/querystring";
import { SearchBar } from "src/components/SearchBar";
import { useFirstMount } from "src/utils/useFirstMount";
import { HttpError } from "src/apis/fetch";
import { SSRPageProps } from "src/utils/ssr";
import { UnifiedErrorPage } from "src/components/errors/UnifiedErrorPage";
import { useHttpErrorHandler } from "src/utils/http";
import { UserListItem } from "src/components/UserListItem";
import { userApi } from "src/apis/user";
import { UserResult } from "graphweibo-api/user/search";
import { Pagination } from "src/components/Pagination";
import produce from "immer";

const api = getApi(userApi);

type Props = SSRPageProps<{
  results: UserResult[];
  totalCount: number;
}>;

interface SearchQuery {
  query: string;
}

export const SearchPage: NextPage<Props> = (props) => {

  const router = useRouter();

  const query = router.query;

  if ("error" in props) {
    return <UnifiedErrorPage error={props.error} />;
  }

  const { totalCount } = props;

  const [results, setResults] = useState(props.results);

  useEffect(() => {
    setResults(props.results);
  }, [props.results]);

  const onFollow = useCallback((u: UserResult) => {
    setResults((r) => produce(r, (d) => {
      const user = d.find((x) => x.userId == u.userId);
      if (user) user.followersCount++;
    }));
  }, [setResults]);

  const onUnfollow = useCallback((u: UserResult) => {
    setResults((r) => produce(r, (d) => {
      const user = d.find((x) => x.userId == u.userId);
      if (user) user.followersCount--;
    }));
  }, [setResults]);

  const updateQuery = useCallback((newQuery: Partial<SearchQuery>) => {
    const combinedQuery = { ...query, ...newQuery };
    router.push({ pathname: "/search", query: combinedQuery });
  }, [router, query]);

  const searchText = queryToString(query?.query ?? "");
  const currentPage = queryToIntOrDefault(query.page, 1);

  return (
    <Box flex="grow" direction="column">
      <Box justify="center" align="center" margin="small">
        <SearchBar
          initialText={searchText}
          onConfirm={(k) => updateQuery({ query: k })}
        />
      </Box>
      <Box direction="row" justify="center" flex="grow">
        <Box flex="grow" width={{ max: "large" }} >
          <Box gap="large">
            {results.map((r) => (
              <UserListItem
                key={r.username}
                user={r}
                onUserFollow={onFollow}
                onUserUnfollow={onUnfollow}
              />
            ))}
          </Box>
          <Box direction="row" justify="center">
            <Pagination
              currentPage={currentPage}
              itemsPerPage={10}
              totalItemsCount={totalCount}
              getUrl={(i) => ({
                pathname: "/search",
                query: { ...query, page: i },
              })}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

SearchPage.getInitialProps = async (context) => {
  const query = context.query as { query: string };

  if (!query.query) {
    query.query = "";
  }

  const data = await api.search({ query })
    .catch((r: HttpError) => ({ error: r }));

  return data;
};

export default SearchPage;

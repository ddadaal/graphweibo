import React, { useCallback, useEffect } from "react";
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

const api = getApi(userApi);

type Props = SSRPageProps<{
  results: UserResult[];
  totalCount: number;
}>;

const search = ([query]: any[]) => api.search({ query });

interface SearchQuery {
  query: string;
}

export const SearchPage: NextPage<Props> = (props) => {

  const router = useRouter();

  const query = router.query;

  if ("error" in props) {
    return <UnifiedErrorPage error={props.error} />;
  }

  const errorHandler = useHttpErrorHandler();

  const { data, isPending, run } = useAsync({
    deferFn: search,
    initialValue: { results: props.results ?? [], totalCount: props.totalCount ?? 0 },
    onReject: errorHandler,
  });

  const firstMount = useFirstMount();

  useEffect(() => {
    if (!firstMount) {
      run(query);
    }
  }, [query]);

  const { results } = data!;

  const updateQuery = useCallback((newQuery: Partial<SearchQuery>) => {
    const combinedQuery = { ...query, ...newQuery };
    router.push({ pathname: "/search", query: combinedQuery });
  }, [router, run, query]);

  const searchText = queryToString(query?.searchText ?? "");
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
          <OverlayLoading loading={isPending}>
            <Box gap="large">
              {results.map((r) => (
                <UserListItem
                  key={r.username}
                  user={r}
                />
              ))}
            </Box>
            <Box direction="row" justify="center">
              <Pagination
                currentPage={currentPage}
                itemsPerPage={10}
                totalItemsCount={data!.totalCount}
                getUrl={(i) => ({
                  pathname: "/search",
                  query: { ...query, page: i },
                })}
              />
            </Box>
          </OverlayLoading>

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

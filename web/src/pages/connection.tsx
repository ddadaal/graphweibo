import { UserConnectionSchema } from "graphweibo-api/user/connection";
import { Box, Button, FormField, Paragraph } from "grommet";
import { NextPage } from "next";
import React, { useCallback, useEffect, useState } from "react";
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
import { useFirstMount } from "src/utils/useFirstMount";
import { OverlayLoading } from "src/components/loading/OverlayLoading";
import { ThemeStore } from "src/stores/ThemeStore";
import { UserSelectTextBox } from "src/components/UserSelectTextBox";
import { LocalizedString } from "simstate-i18n";
import { lang } from "src/i18n";
import { UserResult } from "graphweibo-api/user/search";

const root = lang.pages.connection;

const api = getApi(userApi);

type Props = SSRPageProps<{
  response: UserConnectionSchema["responses"]["200"] | null;
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

  const [fromUser, setFromUser] = useState<UserResult | null>(null);
  const [toUser, setToUser] = useState<UserResult | null>(null);

  const updateQuery = useCallback(() => {
    const combinedQuery = { ...query };
    if (fromUser) { combinedQuery.from = fromUser.userId;}
    if (toUser) { combinedQuery.to = toUser.userId;}
    router.push({ pathname: "/connection", query: combinedQuery });
  }, [router, run, query]);

  // opt out SSR for the UserGraph component
  return (
    <Box>
      <Box direction="row" alignSelf="center" gap="medium">
        <FormField label={<LocalizedString id={root.fromUser} />}>
          <UserSelectTextBox
            initialId={query.from}
            onSelected={(s) => setFromUser(s)}
          />
        </FormField>
        <FormField label={<LocalizedString id={root.toUser} />}>
          <UserSelectTextBox
            initialId={query.to}
            onSelected={(s) => setToUser(s)}
          />
        </FormField>
        <Box alignSelf="end" margin={{ vertical: "small" }}>
          <Button primary onClick={updateQuery} disabled={!fromUser || !toUser}>
            <Box pad="small">
              <LocalizedString id={root.query}/>
            </Box>
          </Button>
        </Box>
      </Box>
      <Box>

        { isServer() ? undefined
          : data ? <UserGraph {...data} />
            : <OverlayLoading loading={true} />
        }
      </Box>
    </Box>
  );
};

ConnectionPage.getInitialProps = async (context) => {
  const { from, to } = context.query as SearchQuery;

  if (!from || !to) { return { response: null };}

  const data = await getConnection([from, to])
    .then((r) => ({ response: r }))
    .catch((r: HttpError) => ({ error: r }));

  return data;
};

export default ConnectionPage;

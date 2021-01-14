import { UserConnectionSchema } from "graphweibo-api/user/connection";
import { Box } from "grommet";
import { NextPage } from "next";
import React from "react";
import { getApi } from "src/apis";
import { HttpError } from "src/apis/fetch";
import { userApi } from "src/apis/user";
import { UnifiedErrorPage } from "src/components/errors/UnifiedErrorPage";
import { UserGraph } from "src/components/connection/UserGraph";
import { SSRPageProps } from "src/utils/ssr";
import { isServer } from "src/utils/isServer";

const api = getApi(userApi);

type Props = SSRPageProps<UserConnectionSchema["responses"]["200"]>;

const getConnection = (fromId: string, toId: string) =>
  api.getUserConnection({ query: { fromUserId: fromId, toUserId: toId } });

export const ConnectionPage: NextPage<Props> = (props) => {

  if ("error" in props) {
    return <UnifiedErrorPage error={props.error} />;
  }

  // opt out SSR for the component
  return (
    <Box>
      { isServer() ? undefined
        : <UserGraph {...props} />
      }
    </Box>
  );
};

ConnectionPage.getInitialProps = async (context) => {
  const { from, to } = context.query as { from: string, to: string };

  const data = await getConnection(from, to)
    .catch((r: HttpError) => ({ error: r }));

  return data; };

export default ConnectionPage;

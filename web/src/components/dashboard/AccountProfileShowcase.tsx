import { Box, Heading, Text } from "grommet";
import React from "react";
import { LocalizedString } from "simstate-i18n";
import { lang } from "src/i18n";
import { formatDateTime } from "src/utils/datetime";
import { DummyAvatar } from "../DummyAvatar";

const root = lang.pages.profile.accountProfile;

interface Props {
  username: string;
  userId: string;
  registerTime: string;
}

const AccountInfoRow: React.FC<{
  textId: string;
  value: string | number;
}> = ({ textId, value }) => (
  <Text>
    <LocalizedString id={textId} />
    {" "}
    {value}
  </Text>
);

export const AccountProfileShowcase: React.FC<Props> = ({
  userId,
  username,
  registerTime,
}) => {
  return (
    <Box direction="row">
      <Box justify="center" align="center" pad={{ horizontal: "xlarge" }}>
        <DummyAvatar size="xlarge" />
      </Box>
      <Box direction="column">
        <Heading level={2}>
          {username}
        </Heading>
        <AccountInfoRow textId={root.userId} value={userId} />
        <AccountInfoRow
          textId={root.registerTime}
          value={formatDateTime(registerTime)}
        />
      </Box>
    </Box>
  );
};

import React from "react";
import { Avatar, Box, Button, Heading, Paragraph, Text } from "grommet";
import { AnchorLink } from "./AnchorLink";
import { UserInfo } from "src/models/UserInfo";
import { LocalizedString } from "simstate-i18n";
import { lang } from "src/i18n";

const root = lang.components.userListItem;

interface Props {
  user: UserInfo;
  onFollowClicked: (user: UserInfo) => void;
}

const NumberInfo: React.FC<{ textId: string; value: number}> = (props) => {
  return (
    <Box direction="column" justify="evenly">
      <Box>
        <LocalizedString id={props.textId} />
      </Box>
      <Box>
        {props.value}
      </Box>
    </Box>
  );
};

export const UserListItem: React.FC<Props> = ({ user, onFollowClicked }) => {

  return (
    <Box direction="row" gap="small" justify="between" align="center">
      <Box direction="row" gap="small">
        <Avatar src="//s.gravatar.com/avatar/b7fb138d53ba0f573212ccce38a7c43b?s=80" />
        <Box direction="column">
          <Text>
            {user.username}
          </Text>
          <Text>
            {user.weiboCount}
          </Text>
        </Box>
      </Box>
      <Box direction="row" gap="small">
        <NumberInfo
          textId={root.fans}
          value={user.followerCount}
        />
        <NumberInfo
          textId={root.following}
          value={user.followCount}
        />
        <Box width="small">
          <Button size="medium" fill label={(
            <LocalizedString id={user.following ? root.following : root.follow} />
          )}
          >
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

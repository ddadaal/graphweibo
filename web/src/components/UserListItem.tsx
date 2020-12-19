import React, { useState } from "react";
import { Avatar, Box, Button, Heading, Paragraph, Text } from "grommet";
import { AnchorLink } from "./AnchorLink";
import { UserInfo } from "src/models/UserInfo";
import { LocalizedString } from "simstate-i18n";
import { lang } from "src/i18n";
import { getApi } from "src/apis";
import { userApi } from "src/apis/user";
import { useHttpRequest } from "src/utils/http";
import { toast } from "react-toastify";

const root = lang.components.userListItem;

const api = getApi(userApi);

interface Props {
  user: UserInfo;
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

export const UserListItem: React.FC<Props> = ({ user }) => {

  const [loading, setLoading] = useState(false);
  const request = useHttpRequest(setLoading);
  const [following, setFollowing] = useState(user.following);

  const onClick = () => request(async () => {
    if (following) {
      await api.unfollow({ body: { username: user.userId } });
      toast.success(<LocalizedString id={root.unfollowComplete} />);
    } else {
      await api.follow({ body: { username: user.userId } });
      toast.success(<LocalizedString id={root.followComplete} />);
    }
    setFollowing(!following);
  });

  return (
    <Box direction="row" gap="small" justify="between" align="center">
      <Box direction="row" gap="small">
        <Avatar src="//s.gravatar.com/avatar/b7fb138d53ba0f573212ccce38a7c43b?s=80" />
        <Box direction="column">
          <Text>
            {user.username}
          </Text>
          <Text>
            <LocalizedString id={root.weiboCount} />
            {" "}
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
            <LocalizedString id={
              loading
                ? user.following ? root.unfollowInProgress : root.followInProgress
                : following ? root.following : root.follow}
            />
          )} onClick={onClick} disabled={loading}
          >
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

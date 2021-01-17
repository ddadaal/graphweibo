import React, { useState } from "react";
import {  Box, Button, Text } from "grommet";
import { UserInfo } from "src/models/UserInfo";
import { LocalizedString } from "simstate-i18n";
import { lang } from "src/i18n";
import { getApi } from "src/apis";
import { userApi } from "src/apis/user";
import { useHttpRequest } from "src/utils/http";
import { toast } from "react-toastify";
import { DummyAvatar } from "./DummyAvatar";
import { useStore } from "simstate";
import { UserStore } from "src/stores/UserStore";
import Router from "next/router";
import { AnchorLink } from "./AnchorLink";

const root = lang.components.userListItem;

const api = getApi(userApi);

interface Props {
  user: UserInfo;
  onUserFollow?: (user: UserInfo) => void;
  onUserUnfollow?: (user: UserInfo) => void;
}

interface NumberInfoProps {
  textId: string;
  value: number;
  userId: string;
  pathname: string;
}

const NumberInfo: React.FC<NumberInfoProps> = (props) => {
  return (
    <Box direction="column" justify="evenly">
      <Box>
        <LocalizedString id={props.textId} />
      </Box>
      <Box>
        <AnchorLink
          href={{ pathname: props.pathname, query: { userId: props.userId } }}
          as={props.pathname.replace("[userId]", props.userId)}
        >
          {props.value}
        </AnchorLink>
      </Box>
    </Box>
  );
};

export const UserListItem: React.FC<Props> = ({
  user,
  onUserFollow,
  onUserUnfollow,
}) => {

  const userStore = useStore(UserStore);
  const [loading, setLoading] = useState(false);
  const request = useHttpRequest(setLoading);
  const [following, setFollowing] = useState(user.following);

  const onClick = () => request(async () => {
    if (following) {
      await api.unfollow({ body: { userId: user.userId } });
      toast.success(<LocalizedString id={root.unfollowComplete} />);
      onUserUnfollow?.(user);
    } else {
      await api.follow({ body: { userId: user.userId } });
      toast.success(<LocalizedString id={root.followComplete} />);
      onUserFollow?.(user);
    }
    setFollowing(!following);
  });

  return (
    <Box direction="row" gap="small" justify="between" align="center">
      <Box direction="row" gap="small">
        <DummyAvatar />
        <Box direction="column">
          <AnchorLink href={{
            pathname: "/profile/[userId]",
            query: { userId: user.userId },
          }}
          as={`/profile/${user.userId}`}
          >
            {user.username}
          </AnchorLink>
          <Text>
            <LocalizedString id={root.weiboCount} />
            {" "}
            <AnchorLink href={{
              pathname: "/profile/[userId]",
              query: { userId: user.userId },
            }}
            as={`/profile/${user.userId}`}
            >
              {user.weiboCount}
            </AnchorLink>
          </Text>
        </Box>
      </Box>
      <Box direction="row" gap="small">
        <NumberInfo
          textId={root.fans}
          value={user.followersCount}
          userId={user.userId}
          pathname="/profile/[userId]/followers"
        />
        <NumberInfo
          textId={root.following}
          value={user.followingsCount}
          userId={user.userId}
          pathname="/profile/[userId]/followings"
        />
        {
          userStore.user
            ?  (
              <Box gap="small" direction="row">
                <Box width="128px">
                  <Button size="medium" fill secondary label={(
                    <LocalizedString id={root.queryConnection} />
                  )} onClick={() => Router.push({
                    pathname: "/connection",
                    query: { from: userStore.user!.userId , to: user.userId },
                  })} disabled={loading}
                  >
                  </Button>
                </Box>
                <Box width="108px">
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
            ) : undefined
            // ) : (
            //   <Box alignSelf="center">
            //     <AnchorLink href="/login">
            //       <LocalizedString id={root.loginToFollow}/>
            //     </AnchorLink>
            //   </Box>
            // )
        }
      </Box>
    </Box>
  );
};

import {  Box, Text } from "grommet";
import React from "react";
import { WeiboInfo } from "src/models/weibo";
import { formatDateTime } from "src/utils/datetime";
import { AnchorLink } from "./AnchorLink";
import { DummyAvatar } from "./DummyAvatar";

interface Props {
  weibo: WeiboInfo;
}



export const WeiboListItem: React.FC<Props> = ({ weibo }) => {


  return (
    <Box direction="row" gap="medium">
      <Box width={{ min: "72px" }}>
        <DummyAvatar
          size="large"
        />
      </Box>
      <Box gap="small">
        <Box>
          <AnchorLink href={{
            pathname: "/profile/[userId]",
            query: { userId: weibo.senderId },
          }}
          as={`/profile/${weibo.senderId}`}
          >
            {weibo.senderUsername}
          </AnchorLink>
          <Text size="small">
            {formatDateTime(weibo.sendTime)}
          </Text>
        </Box>
        <Box>
          <Text>
            {weibo.content}
          </Text>
        </Box>
      </Box>
    </Box>
  );
};

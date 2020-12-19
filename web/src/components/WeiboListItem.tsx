import { Avatar, Box, Paragraph, Text } from "grommet";
import React from "react";
import { WeiboInfo } from "src/models/weibo";
import { formatDateTime } from "src/utils/datetime";

interface Props {
  weibo: WeiboInfo;
}



export const WeiboListItem: React.FC<Props> = ({ weibo }) => {


  return (
    <Box direction="row" gap="medium">
      <Box width={{ min: "72px" }}>
        <Avatar
          size="large"
          src="//s.gravatar.com/avatar/b7fb138d53ba0f573212ccce38a7c43b?s=80"
        />
      </Box>
      <Box gap="small">
        <Box>
          <Text weight="bold">
            {weibo.senderUsername}
          </Text>
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

import { Avatar, AvatarProps } from "grommet";
import { User } from "grommet-icons";
import React from "react";

type Props = AvatarProps;

export const DummyAvatar: React.FC<Props> = (props) => (
  <Avatar background="brand" {...props}>
    <User color="white" />
  </Avatar>
);

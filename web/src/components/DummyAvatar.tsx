import { Avatar, AvatarProps } from "grommet";
import React from "react";

type Props = AvatarProps;

export const DummyAvatar: React.FC<Props> = (props) => (
  <Avatar
    src="//s.gravatar.com/avatar/b7fb138d53ba0f573212ccce38a7c43b?s=80"
    {...props}
  />
);

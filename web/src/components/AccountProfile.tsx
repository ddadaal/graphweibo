import { Box } from "grommet";
import React from "react";
import { DummyAvatar } from "./DummyAvatar";

interface Props {

}

export const AccountProfile: React.FC<Props> = (props) => {
  return (
    <Box direction="row">
      <DummyAvatar size="xlarge" />
      <Box direction="column">

      </Box>
    </Box>
  );
};

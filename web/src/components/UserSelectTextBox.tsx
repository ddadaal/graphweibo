import { Box } from "grommet";
import React from "react";
import { UserInfo } from "src/models/UserInfo";

interface Props {
  initialId: string;
  selected: UserInfo | null;
  onSelected: (selected: UserInfo) => void;
}

export const UserSelectTextBox: React.FC<Props> = (props) => {
  return (
    <Box>

    </Box>
  );
};

import { Box } from "grommet";
import { NextPage } from "next";
import React from "react";
import { AccountProfile } from "src/components/AccountProfile";


const DashboardPage: NextPage = () => {
  return (
    <Box fill gap="large" alignSelf="center" width={{ max: "large" }}>
      <AccountProfile />
    </Box>
  );
};

export default DashboardPage;

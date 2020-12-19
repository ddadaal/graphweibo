import React from "react";
import { Box, TextArea } from "grommet";
import { Logo } from "src/components/Logo";


const Home: React.FC = () => {

  return(
    <Box justify="center" flex="grow">
      <Box justify="center" align="center" pad="small">
        <Box width="medium" height="small">
          <Logo />
        </Box>
        <Box width="medium">
        </Box>
        <Box height="small" />
      </Box>
    </Box>
  );
};

export default Home;

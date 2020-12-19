import React from "react";
import { Box, TextArea } from "grommet";
import { Logo } from "src/components/Logo";
import { WeiboInput } from "src/components/WeiboInput";


const Home: React.FC = () => {

  return(
    <Box flex="grow">
      <Box width={{ max: "large " }}>
        <WeiboInput />
      </Box>
    </Box>
  );
};

export default Home;

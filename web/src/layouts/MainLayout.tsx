import React, { useCallback, useRef } from "react";
import { Grommet, Box } from "grommet";
import { Footer } from "src/layouts/footer";
import { Header } from "src/layouts/header";
import siteTheme from "src/styles/theme";
import { MediaContextProvider } from "src/styles/media";
import { createStore, StoreProvider, useStore } from "simstate";
import { ThemeStore } from "src/stores/ThemeStore";
import { GlobalStyle } from "src/styles/global";
import { ToastContainer } from "react-toastify";
import { ScrollEventStore } from "src/stores/ScrollEventStore";
import useConstant from "src/utils/useConstant";

interface Props {
}

const maxWidth = "xxlarge";

export const MainLayout: React.FC<Props> = ({ children }) => {
  const { theme } = useStore(ThemeStore);
  const scrollEventStore = useStore(ScrollEventStore);

  const onScroll = useCallback(() => {
    scrollEventStore.events.forEach((x) => x());
  }, [scrollEventStore.events]);

  return (
    <>
      <GlobalStyle />
      <ToastContainer />
      <MediaContextProvider>
        <Grommet theme={siteTheme} full={true} themeMode={theme} onScroll={onScroll} >
          <Box direction="column" height="100vh">
            <Header width={maxWidth} />
            <Box as="main" flex="grow" pad="small" align="center" >
              <Box width={maxWidth} flex="grow">
                {children}
              </Box>
            </Box>
            <Footer />
          </Box>
        </Grommet>
      </MediaContextProvider>
    </>
  );
};

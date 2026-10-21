import { Box, Flex, Theme } from "@radix-ui/themes";
import "@radix-ui/themes/styles.css";
import "./App.css";
import { type PropsWithChildren } from "react";
import {
  PageWithRouter,
  PdfGenerator,
  VideoAnalyser,
  VideoSelector,
} from "./components";
import { useVideoStore } from "./stores/video-store";

function App() {
  const { view } = useVideoStore();

  return (
    <>
      <Theme appearance="dark">
        <Box width={"100%"} height={"100%"}>
          <Flex justify={"center"} p="4" direction={"column"} align={"center"}>
            <PageWithRouter>
              <PageTransition show={view === "selection"}>
                <VideoSelector />
              </PageTransition>
              <PageTransition show={view === "analysis"}>
                <VideoAnalyser />
              </PageTransition>
              <PageTransition show={view === "generation"}>
                <PdfGenerator />
              </PageTransition>
            </PageWithRouter>
          </Flex>
        </Box>
      </Theme>
    </>
  );
}

export default App;

const PageTransition = ({
  children,
  show,
}: PropsWithChildren<{ show?: boolean }>) => {
  return (
    <>
      {show && (
        <div
        // layout
        // transition={{ duration: 0.3, bounce: 0 }}
        // initial={{ translateX: "-30px", opacity: 0, display: "none" }}
        // animate={{ translateX: 0, opacity: 1, display: "block" }}
        // exit={{ translateX: "-30px", opacity: 0, display: "none" }}
        >
          {children}
        </div>
      )}
    </>
  );
};

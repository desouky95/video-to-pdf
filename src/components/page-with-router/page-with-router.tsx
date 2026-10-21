import { Box, Flex, IconButton } from "@radix-ui/themes";
import type { PropsWithChildren } from "react";
import { ChevronLeftIcon } from "@radix-ui/react-icons";
import { useVideoStore } from "../../stores/video-store";

export const PageWithRouter = ({ children }: PropsWithChildren<object>) => {
  const { setView, view } = useVideoStore();

  const handleBack = () => {
    setView(
      view === "analysis"
        ? "selection"
        : view === "generation"
        ? "analysis"
        : "selection"
    );
  };
  return (
    <Box width={"100%"}>
      <Flex justify={"start"} p="2" minHeight={'40px'}>
        {view !== "selection" && (
          <IconButton onClick={handleBack}>
            <ChevronLeftIcon />
          </IconButton>
        )}
      </Flex>
      {children}
    </Box>
  );
};

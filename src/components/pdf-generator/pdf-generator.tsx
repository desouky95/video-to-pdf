import { Box, Button, Flex, Spinner } from "@radix-ui/themes";
import { usePdfGenerator } from "./pdf-generator.hook";
import { useVideoStore } from "../../stores/video-store";

export const PdfGenerator = () => {
  const { processing } = usePdfGenerator();

  const { pdf, meta } = useVideoStore();

  // const previewURL = useMemo(() => pdf && pdf.output("datauristring"), [pdf]);

  if (processing) return <Spinner />;
  if (!pdf) return null;

  return (
    <Flex justify={"center"} direction={"column"} align={"center"} gap={"2"}>
      <Box height={"60vh"}>
        {pdf && (
          <iframe width={"100%"} height={"100%"} src={pdf.output('datauristring')} />
        )}
      </Box>
      <Button onClick={() => pdf.save(meta?.name)}>Save</Button>
    </Flex>
  );
};

import {
  Button,
  Checkbox,
  ContextMenu,
  Flex,
  Grid,
  Spinner,
  Text,
  TextField,
} from "@radix-ui/themes";
import { useVideoAnalyser } from "./video-analyser.hook";
import styled from "styled-components";
import { useVideoStore } from "../../stores/video-store";
import { usePdfGenerator } from "../pdf-generator/pdf-generator.hook";
import JSZip from "jszip";
import { dataURLtoFile } from "../../utils/dataURLtoFile";

export const VideoAnalyser = () => {
  const {
    toggleFrame,
    selected,
    frames,
    selectAll,
    setSelectAll,
    // setView,
    setMeta,
    meta,
  } = useVideoStore();
  const { start, processing } = useVideoAnalyser();
  const { generate } = usePdfGenerator();

  const saveImage = (index: number) => {
    const imgData = frames[index];
    const a = document.createElement("a");
    a.style.display = "none";
    a.href = imgData.dataUrl;
    a.download = `${meta.name ?? "generated"}_${index}` + "." + "jpeg";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const saveImages = async () => {
    const zip = new JSZip();
    const images = zip.folder("images");

    frames.forEach((frame, index) => {
      const imgData = dataURLtoFile(frame.dataUrl, `image_${index}.jpeg`);
      images?.file(`image_${index}.jpeg`, imgData);
    });

    const file = await zip.generateAsync({ type: "blob" });
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(file);
    link.download = `images.zip`;
    link.click();
  };

  if (processing)
    return (
      <Flex width={"100%"} height={"100%"} align={"center"} justify={"center"}>
        <Spinner />
      </Flex>
    );
  return (
    <Flex direction={"column"} align={"center"} gap={"2"}>
      <Button disabled={processing} onClick={start}>
        Analyze Video
      </Button>
      <Text as="label">
        Frame Interval
        <TextField.Root
          type="number"
          onChange={(e) => setMeta({ interval: e.target.valueAsNumber })}
          value={meta.interval ?? 1}
        />
      </Text>

      {frames.length > 0 && (
        <Button
          onClick={() => {
            generate();
            // setView("generation");
          }}
        >
          Generate PDF
        </Button>
      )}

      {frames.length > 0 && (
        <Text as="label">
          <Flex align={"center"} gap={"2"}>
            <Checkbox
              size={"3"}
              checked={selectAll}
              onCheckedChange={(check) => {
                if (typeof check === "boolean") setSelectAll(check);
              }}
            />
            Select All
          </Flex>
        </Text>
      )}
      {selectAll && <Button onClick={saveImages}>Save Images</Button>}
      {frames.length > 0 && !processing && (
        <Grid columns={{ initial: "1", sm: "2", md: "3" }} gap={"5"}>
          {frames.map((image, index) => (
            <ContextMenu.Root key={image.dataUrl}>
              <ContextMenu.Trigger>
                <FrameButton
                  onClick={() => toggleFrame(index)}
                  selected={selected.filter((_) => _ == index).length > 0}
                >
                  <img width={"100%"} src={image.dataUrl} />
                </FrameButton>
              </ContextMenu.Trigger>
              <ContextMenu.Content color="gray" highContrast>
                <ContextMenu.Item onClick={() => toggleFrame(index)}>
                  {selected.filter((_) => _ == index).length > 0
                    ? "Remove"
                    : "Select"}
                </ContextMenu.Item>
                <ContextMenu.Separator />
                <ContextMenu.Item onClick={() => saveImage(index)} color="blue">
                  Save
                </ContextMenu.Item>
              </ContextMenu.Content>
            </ContextMenu.Root>
          ))}
        </Grid>
      )}
    </Flex>
  );
};

const FrameButton = styled.div<{ selected: boolean }>`
  border-radius: 5px;
  overflow: hidden;
  height: 100%;
  outline: 4px solid
    ${(p) => (p.selected ? "var(--blue-9)" : "var(--color-background)")};
  cursor: pointer;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

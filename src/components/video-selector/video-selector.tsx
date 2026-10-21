import { Button, Flex } from "@radix-ui/themes";
import { useRef } from "react";
import { useVideoStore } from "../../stores/video-store";

export const VideoSelector = () => {
  const { setVideo, video, setView, setSelectAll, setFrames } = useVideoStore(
    (s) => s
  );
  const videoInputRef = useRef<HTMLInputElement>(null);
  // const videoRef = useRef<HTMLVideoElement | null>(null);

  const handleSelect = () => {
    if (!videoInputRef.current) return;
    videoInputRef.current.value = "";
    videoInputRef.current?.click();
  };
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.length) {
      setVideo(event.target.files?.[0]);
      setFrames([]);
      setSelectAll(false);
    }
  };

  return (
    <Flex direction={"column"} justify={"center"} gap={"4"} align={"center"}>
      <input
        type="file"
        hidden
        ref={videoInputRef}
        accept="video/*"
        onChange={handleChange}
      />
      <Button onClick={handleSelect}>Select Video</Button>
      {video && (
        <>
          <Flex
            minHeight={"400px"}
            height={"1px"}
            maxHeight={"400px"}
            width={"100%"}
            justify={"center"}
          >
            <video
              // ref={videoRef}
              style={{ maxHeight: "100%" }}
              src={URL.createObjectURL(video)}
              controls
            />
          </Flex>
          <Button onClick={() => setView("analysis")}>Next</Button>
        </>
      )}
    </Flex>
  );
};

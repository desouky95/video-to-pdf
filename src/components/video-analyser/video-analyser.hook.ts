import { useCallback, useState } from "react";
import { useVideoStore, type Frame } from "../../stores/video-store";

export const useVideoAnalyser = () => {
  const { setFrames, video: file, meta, setVideoElement } = useVideoStore();

  const [processing, setProcessing] = useState<boolean>(false);
  const seekVideo = async (
    video: HTMLVideoElement,
    time: number
  ): Promise<void> => {
    return new Promise((resolve) => {
      const onSeeked = () => {
        video.removeEventListener("seeked", onSeeked);
        resolve();
      };
      video.addEventListener("seeked", onSeeked);
      video.currentTime = time;
    });
  };
  const start = useCallback(async () => {
    if (!file) return;
    setProcessing(true);
    const video = document.createElement("video");
    video.src = URL.createObjectURL(file);
    video.crossOrigin = "anonymous";
    video.load();
    video.onloadedmetadata = async () => {
      setVideoElement(video);
      const duration = video.duration;
      video.currentTime = 0;
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      const extractedFrames: Frame[] = [];
      const videoWidth = video.videoWidth;
      const videoHeight = video.videoHeight;
      const FRAME_INTERVAL = meta.interval ?? 1; // seconds

      for (let t = 0; t <= duration; t += FRAME_INTERVAL) {
        try {
          await seekVideo(video, t);
          console.log(t, duration);
          // canvas.width = THUMBNAIL_SIZE;
          canvas.width = videoWidth;
          // canvas.height = (THUMBNAIL_SIZE * video.videoHeight) / video.videoWidth;
          canvas.height = videoHeight;
          // ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);
          ctx?.drawImage(video, 0, 0);
          const dataUrl = canvas.toDataURL("image/jpeg", 1.0);

          extractedFrames.push({
            dataUrl,

            width: canvas.width,
            height: canvas.height,
          });
        } catch (err) {
          console.error("Error extracting frame at time", t, err);
        }
      }
      setFrames(extractedFrames);
      setProcessing(false);
    };
  }, [file, meta.interval, setFrames, setVideoElement]);
  return {
    start,
    frames,
    processing,
  };
};

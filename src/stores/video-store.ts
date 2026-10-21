import type jsPDF from "jspdf";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
type Meta = {
  name: string;
  interval: number;
};
export type Frame = {
  dataUrl: string;
  width: number;
  height: number;
  imgData?: ImageData;
};
type VideoStore = {
  videoElement: HTMLVideoElement | null;
  video: File | null;
  meta: Partial<Meta>;
  setMeta: (meta: Partial<Meta>) => void;
  frames: Frame[];
  selected: number[];
  pdf: jsPDF | null;
  setPdf: (pdf: jsPDF) => void;
  savePdf: () => void;
  setVideo: (file: File | null) => void;
  setVideoElement: (element: HTMLVideoElement | null) => void;
  setFrames: (frames: Frame[]) => void;
  toggleFrame: (index: number) => void;
  view: "selection" | "analysis" | "generation";
  setView: (view: "selection" | "analysis" | "generation") => void;
  selectAll: boolean;
  setSelectAll: (value: boolean) => void;
};
export const useVideoStore = create<VideoStore>()(
  devtools<VideoStore>((set, get) => ({
    view: "selection",
    videoElement: null,
    frames: [],
    selected: [],
    pdf: null,
    selectAll: false,
    meta: {},
    setPdf(pdf) {
      set({ pdf });
    },
    savePdf() {},
    setView(view) {
      set({ view });
    },
    setFrames(frames) {
      set({ frames });
    },
    setVideoElement(element) {
      set({ videoElement: element });
    },
    setSelectAll(value) {
      set({
        selectAll: value,
        selected: !value ? [] : get().frames.map((_, index) => index),
      });
    },
    toggleFrame(index) {
      if (get().selected.filter((_) => _ === index).length === 0) {
        set({ selected: [...get().selected, index] });
      } else {
        set({ selected: get().selected.filter((_) => _ !== index) });
      }
      if (get().selected.length === get().frames.length) {
        set({ selectAll: true });
      } else {
        set({ selectAll: false });
      }
    },
    video: null,
    setVideo(file) {
      set({ video: file, meta: { name: file?.name } });
    },
    setMeta(meta) {
      set({ meta: { ...get().meta, ...meta } });
    },
  }))
);

import * as pdfjs from "pdfjs-dist";
import type {
  TextItem,
  TextMarkedContent,
} from "pdfjs-dist/types/src/display/api";
import { useCallback } from "react";

pdfjs.GlobalWorkerOptions.workerSrc = "pdf.worker.mjs";

const isTextITem = (item: TextItem | TextMarkedContent): item is TextItem =>
  item !== undefined && "str" in item;
export const usePdf = () => {
  const getText = useCallback(async (src: string | URL | ArrayBuffer) => {
    console.log(src);
    const document = await pdfjs.getDocument(src).promise;

    const maxPages = document.numPages;

    return Promise.all(
      Array.from({ length: maxPages }, (_, i) => i + 1).map(async (pageNum) => {
        const page = await document.getPage(pageNum);
        const content = await page.getTextContent();
        const spliceIndex = content.items.findIndex(
          (_) => isTextITem(_) && _.str === "www.footballstickipedia.com"
        );
        const albumContent = content.items.slice(spliceIndex + 1);
        const sections = content.items
          .filter(filterSections)
          .map(parseSections)
          .filter((_) => _ !== null);
        const parsed = albumContent
          .filter(filteredItems)
          .map(parseItems)
          .filter(isTextITem);

        return { sections, cards: parsed };
      })
    );
  }, []);

  const filteredItems = (item: TextItem | TextMarkedContent) => {
    if (!isTextITem(item)) return false;
    return (
      item.str.startsWith("__ ") ||
      (item.fontName == "g_d0_f5" && item.str != "")
    );
  };
  const parseItems = (item: TextItem | TextMarkedContent) => {
    if (!isTextITem(item)) return item;
    const split = item.str.split(":");
    const number = split[0]?.replace("__ ", "").trim();
    const splitNameAndClub = split[1].split("(");
    const name =
      splitNameAndClub.length === 0
        ? splitNameAndClub[0]
        : splitNameAndClub[0].trim();
    const club =
      splitNameAndClub.length === 0
        ? ""
        : splitNameAndClub[1]?.replace(")", "").trim();

    return {
      ...item,
      number,
      name,
      club,
    };
  };

  const filterSections = (item: TextItem | TextMarkedContent) => {
    if (!isTextITem(item)) return false;

    return item.fontName.endsWith("f5") && item.str !== "";
  };
  const parseSections = (item: TextItem | TextMarkedContent, index: number) => {
    if (!isTextITem(item)) return null;
    const split = item.str.split(":");
    // const nameCheck = split[1].split('-').length
    const getName = () => {
      if (split.length === 1) return split[0].split("-")[0]?.trim();
      if (split[1].split("-").length > 1) {
        return split[1].split("-")[0]?.trim();
      }
      return split[0]?.trim();
    };
    const name = getName();
    return {
      index,
      name: name,
    };
  };

  return { getText };
};

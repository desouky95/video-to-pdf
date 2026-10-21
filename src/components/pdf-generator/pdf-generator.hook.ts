import jsPDF from "jspdf";
import { useCallback, useState } from "react";
import { useVideoStore } from "../../stores/video-store";

export const usePdfGenerator = () => {
  const [processing, setProcessing] = useState<boolean>(false);
  const { selected, frames, setPdf, meta } = useVideoStore();

  const generate = useCallback(() => {
    setProcessing(true);
    const doc = new jsPDF();
    for (let i = 0; i < selected.length; i++) {
      if (i > 0) doc.addPage();
      const imgData = frames[selected[i]];
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const imgAspectRatio = imgData.width / imgData.height;
      const pageAspectRatio = pageWidth / pageHeight;
      let pdfWidth, pdfHeight;
      if (imgAspectRatio > pageAspectRatio) {
        pdfWidth = pageWidth;
        pdfHeight = pageWidth / imgAspectRatio;
      } else {
        pdfHeight = pageHeight;
        pdfWidth = pageHeight * imgAspectRatio;
      }

      const x = (pageWidth - pdfWidth) / 2;
      const y = (pageHeight - pdfHeight) / 2;
      doc.addImage(imgData.dataUrl, "JPEG", x, y, pdfWidth, pdfHeight);
    }

    setPdf(doc);
    setProcessing(false);
    doc.save(`${meta?.name ?? "generated"}.pdf`);
  }, [frames, meta?.name, selected, setPdf]);

  return {
    generate,
    processing,
  };
};

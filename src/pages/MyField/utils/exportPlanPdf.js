import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

export async function exportPlanPdf(elementId, fileName) {
  try {
    const element = document.getElementById(elementId);
    if (!element) throw new Error("PDF element not found");

    const canvas = await html2canvas(element, {
      scale: 2,
      backgroundColor: "#020617",
      useCORS: true,
      ignoreElements: (el) => {
        // Ignore anything risky
        return (
          el.classList?.contains("backdrop-blur") ||
          el.classList?.contains("shadow") ||
          el.classList?.contains("bg-gradient")
        );
      }
    });

    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(fileName);

  } catch (err) {
    console.error("PDF export error:", err);
    alert("PDF export failed. Please try again.");
  }
}

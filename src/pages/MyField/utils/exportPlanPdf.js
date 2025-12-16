import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

export async function exportPlanPdf(elementId, fileName) {
  try {
    const element = document.getElementById(elementId);
    if (!element) throw new Error("PDF element not found");

    // 1️⃣ Clone the element to avoid breaking live UI
    const clone = element.cloneNode(true);

    // 2️⃣ Force safe styles (NO oklab / gradients / blur)
    clone.querySelectorAll("*").forEach((el) => {
      const style = el.style;

      style.backgroundImage = "none";
      style.filter = "none";
      style.backdropFilter = "none";
      style.boxShadow = "none";

      // Force safe colors
      style.color = "#e5e7eb";           // slate-200
      style.backgroundColor = "#020617"; // slate-950
      style.borderColor = "#334155";     // slate-700
    });

    // 3️⃣ Render offscreen (important)
    clone.style.position = "fixed";
    clone.style.left = "-9999px";
    document.body.appendChild(clone);

    const canvas = await html2canvas(clone, {
      scale: 2,
      backgroundColor: "#020617",
      useCORS: true,
    });

    document.body.removeChild(clone);

    // 4️⃣ Create PDF
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

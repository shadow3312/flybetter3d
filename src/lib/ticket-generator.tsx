import html2canvas from "html2canvas-pro"
import jsPDF from "jspdf"

export const TicketGenerator = {
  generatePDF: async (element: HTMLElement, filename = "flight-ticket.pdf"): Promise<void> => {
    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        width: element.scrollWidth,
        height: element.scrollHeight,
      })

      const imgWidth = 210
      const pageHeight = 295
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      let heightLeft = imgHeight

      const pdf = new jsPDF("p", "mm", "a4")
      let position = 0

      pdf.addImage(canvas.toDataURL("image/png"), "PNG", 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight
        pdf.addPage()
        pdf.addImage(canvas.toDataURL("image/png"), "PNG", 0, position, imgWidth, imgHeight)
        heightLeft -= pageHeight
      }

      pdf.save(filename)
    } catch (error) {
      console.error("Error generating PDF:", error)
      throw new Error("Failed to generate ticket PDF")
    }
  },

  generateImage: async (element: HTMLElement, filename = "flight-ticket.png"): Promise<void> => {
    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
      })

      const link = document.createElement("a")
      link.download = filename
      link.href = canvas.toDataURL("image/png")
      link.click()
    } catch (error) {
      console.error("Error generating image:", error)
      throw new Error("Failed to generate ticket image")
    }
  },
}

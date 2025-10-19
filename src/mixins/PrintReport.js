import { format, parseISO } from "date-fns";

export default {
  methods: {
    printReport(tableElement, options = {}) {
      const { headerText, user, reportTitle, queryDate, skipTableLogic } =
        options;

      const fileDate = queryDate || format(new Date(), "yyyy-MM-dd");

      let titleParts = [];
      if (reportTitle) titleParts.push(reportTitle);
      if (headerText) titleParts.push(headerText);
      titleParts.push(fileDate);

      const documentTitle = titleParts.join(" - ");

      const printWindow = window.open("", "_blank");
      if (!printWindow) {
        alert("Please allow popups for this website");
        return;
      }

      const printDocument = printWindow.document;
      printDocument.write(
        `<html><head><title>${documentTitle}</title></head><body></body></html>`
      );

      const styles = document.querySelectorAll('link[rel="stylesheet"], style');
      styles.forEach((style) => {
        printDocument.head.appendChild(style.cloneNode(true));
      });

      const customStyle = printDocument.createElement("style");
      customStyle.textContent = `
        @page {
          size: landscape;
          margin: 20mm;
        }
        body {
          font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
        }
        .report-title {
          font-size: 20px;
          font-weight: bold;
          text-align: center;
          margin-bottom: 10px;
        }
        caption {
          font-size: 16px;
          font-weight: bold;
          margin-bottom: 10px;
          text-align: left;
          caption-side: top;
        }
        tr {
          page-break-inside: avoid !important;
        }
        .v-chip {
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
          text-transform: uppercase;
          font-weight: bold;
        }
        .print-footer {
          display: flex;
          justify-content: space-between;
          font-size: 12px;
          margin-top: 20px;
          position: fixed;
          bottom: 0;
          left: 20mm;
          right: 20mm;
        }
        .no-print {
          display: none !important;
        }
        .printable-flex-header {
          display: flex !important;
          flex-wrap: nowrap !important;
        }
      `;
      printDocument.head.appendChild(customStyle);

      if (reportTitle) {
        const titleEl = document.createElement("div");
        titleEl.className = "report-title";
        titleEl.textContent = reportTitle;
        printDocument.body.appendChild(titleEl);
      }

      const tableWrapperClone = tableElement.cloneNode(true);
      if (!skipTableLogic) {
        const table = tableWrapperClone.querySelector("table");
        if (table) {
          const originalTable = tableElement.querySelector("table");
          if (originalTable) {
            const tableWidth = originalTable.offsetWidth;
            const originalHeaderCells =
              tableElement.querySelectorAll("thead th");
            const columnWidths = Array.from(originalHeaderCells).map(
              (th) => (th.offsetWidth / tableWidth) * 100 + "%"
            );

            const clonedHeaderCells = table.querySelectorAll("thead th");
            clonedHeaderCells.forEach((th, index) => {
              th.style.width = columnWidths[index];
            });

            const bodyRows = table.querySelectorAll("tbody tr");
            bodyRows.forEach((row) => {
              const cells = row.querySelectorAll("td");
              cells.forEach((cell, index) => {
                if (columnWidths[index]) {
                  cell.style.width = columnWidths[index];
                }
              });
            });
          }

          if (headerText) {
            const caption = table.createCaption();
            caption.textContent = headerText;
          }
        }
      }

      const originalChips = tableElement.querySelectorAll(".v-chip");
      const clonedChips = tableWrapperClone.querySelectorAll(".v-chip");
      originalChips.forEach((chip, index) => {
        if (clonedChips[index]) {
          const color = window.getComputedStyle(chip).color;
          const backgroundColor = window.getComputedStyle(chip).backgroundColor;
          clonedChips[index].style.color = color;
          clonedChips[index].style.backgroundColor = backgroundColor;
        }
      });

      printDocument.body.appendChild(tableWrapperClone);

      const footerEl = printDocument.createElement("div");
      footerEl.className = "print-footer";
      const printedBy = user
        ? `Printed by: ${user.firstName} ${user.lastName} (ID: ${user.userId})`
        : "";
      const printDateStr = `Print Date: ${new Date().toLocaleString()}`;
      const reportDateStr = queryDate
        ? `Report Date: ${format(parseISO(queryDate), "MMMM d, yyyy")}`
        : "";

      footerEl.innerHTML = `<span>${reportDateStr}</span><span>${printedBy}</span><span>${printDateStr}</span>`;
      printDocument.body.appendChild(footerEl);

      printDocument.close();

      setTimeout(() => {
        printWindow.focus();
        printWindow.print();
        printWindow.close();
      }, 500);
    },
  },
};

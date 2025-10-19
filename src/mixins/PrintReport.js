export default {
  methods: {
    printReport(tableElement, options = {}) {
      const { headerText, user, reportTitle } = options;

      const printDate = new Date();
      const formattedDate = `${printDate.getFullYear()}-${(
        printDate.getMonth() + 1
      )
        .toString()
        .padStart(2, "0")}-${printDate.getDate().toString().padStart(2, "0")}`;

      let titleParts = [];
      if (reportTitle) titleParts.push(reportTitle);
      if (headerText) titleParts.push(headerText);
      titleParts.push(formattedDate);

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
        @media print {
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
        } 
      `;
      printDocument.head.appendChild(customStyle);

      if (reportTitle) {
        const titleEl = printDocument.createElement("div");
        titleEl.className = "report-title";
        titleEl.textContent = reportTitle;
        printDocument.body.appendChild(titleEl);
      }

      const tableWrapperClone = tableElement.cloneNode(true);
      const table = tableWrapperClone.querySelector("table");
      if (table && headerText) {
        const caption = table.createCaption();
        caption.textContent = headerText;
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
      footerEl.innerHTML = `<span>${printedBy}</span><span>${printDateStr}</span>`;
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

import html2canvas from "html2canvas";
export default {
  methods: {
    handlePrinting: function () {
      const printContent = this.$refs.bookingSummary.$el;
      const referenceNumber = this.value.transaction.referenceNumber;

      const button = printContent.querySelector("button");

      let originalDisplay = "";
      if (button) {
        originalDisplay = button.style.display;
        button.style.display = "none";
      }

      // Temporarily set width to 600px for better capture
      const originalWidth = printContent.style.width;
      printContent.style.width = "600px";

      const options = {
        logging: false,
        useCORS: true, // Enable CORS to handle cross-origin images
        scale: 2, // Increase the scale to improve the quality of the screenshot
      };

      html2canvas(printContent, options)
        .then((canvas) => {
          const imageData = canvas.toDataURL("image/png");
          const printWindow = window.open("", "_blank");
          const printDocument = printWindow.document;

          const head = printDocument.head;
          const style = printDocument.createElement("style");
          style.innerHTML = `
        html, body {
          height: 100%;
          display: flex;
          flex-direction: column;
          font-family: Arial, Helvetica, sans-serif;
        }
        body {
          justify-content: space-between;
        }
        .booking-summary {
          display: block;
          margin: 0 auto;
          max-width: 100%;
          max-height: 100%;
        }
        footer {
          margin-top: auto;
        }
      `;

          head.appendChild(style);

          // Create Image element and append to the print document
          const img = printDocument.createElement("img");
          img.className = "booking-summary";
          img.src = imageData;

          printDocument.body.appendChild(img);

          // Footer
          const footer = printDocument.createElement("footer");
          const divFooter = printDocument.createElement("div");
          divFooter.className = "div-footer";
          divFooter.textContent = "Ref no. " + referenceNumber;
          footer.appendChild(divFooter);

          printDocument.body.appendChild(footer);

          // Add a slight delay before triggering print (optional)
          setTimeout(() => {
            // Print the document directly
            printWindow.print();

            // Close the print window (optional)
            printWindow.close();
          }, 1000); // Adjust the delay as needed
        })
        .finally(() => {
          // Restore to original styles
          printContent.style.width = originalWidth;
          if (button) {
            button.style.display = originalDisplay;
          }
        });
    },
  },
};

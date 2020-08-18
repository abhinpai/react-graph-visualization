export default class FileSaveSupport {
  static save(fileContent, fileName) {
    return new Promise((resolve, reject) => {
      // extract file format
      const format = fileName.split(".")[1].toLowerCase();

      if (FileSaveSupport.isFileConstructorAvailable()) {
        if (
          format === "txt" ||
          format === "json" ||
          format === "svg" ||
          format === "graphml" ||
          format === "pdf" ||
          format === "png"
        ) {
          let mimeType = "";
          switch (format) {
            case "txt":
            case "json":
            default:
              mimeType = "text/plain";
              break;
            case "svg":
              mimeType = "image/svg+xml";
              break;
            case "png":
              mimeType = "image/png";
              break;
            case "graphml":
              mimeType = "application/xml";
              break;
            case "pdf":
              mimeType = "text/plain; charset=x-user-defined";
              break;
          }

          let blob = null;
          if (format === "pdf") {
            // encode content to make transparent images work correctly
            const uint8Array = new Uint8Array(fileContent.length);
            for (let i = 0; i < fileContent.length; i++) {
              uint8Array[i] = fileContent.charCodeAt(i);
            }
            blob = new Blob([uint8Array], { type: mimeType });
          } else if (format === "png") {
            // save as binary data
            const dataUrlParts = fileContent.split(",");
            const bString = window.atob(dataUrlParts[1]);
            const byteArray = [];
            for (let i = 0; i < bString.length; i++) {
              byteArray.push(bString.charCodeAt(i));
            }
            blob = new Blob([new Uint8Array(byteArray)], { type: mimeType });
          } else {
            blob = new Blob([fileContent], { type: mimeType });
          }

          // workaround for supporting non-binary data
          fileContent = URL.createObjectURL(blob);
        }

        const aElement = document.createElement("a");
        aElement.setAttribute("href", fileContent);
        aElement.setAttribute("download", fileName);
        aElement.style.display = "none";
        document.body.appendChild(aElement);
        aElement.click();
        document.body.removeChild(aElement);

        resolve("File saved successfully");
        return;
      }
      if (FileSaveSupport.isMsSaveAvailable()) {
        let blob;
        if (fileContent.startsWith("data:")) {
          const dataUrlParts = fileContent.split(",");
          const bString = window.atob(dataUrlParts[1]);
          const byteArray = [];
          for (let i = 0; i < bString.length; i++) {
            byteArray.push(bString.charCodeAt(i));
          }
          // For the options, extract the mime type from the Data URL
          blob = new Blob([new Uint8Array(byteArray)], {
            type: dataUrlParts[0].match(/:(.*?);/)[1],
          });
        } else if (format === "pdf") {
          // encode content to make transparent images work correctly
          const uint8Array = new Uint8Array(fileContent.length);
          for (let i = 0; i < fileContent.length; i++) {
            uint8Array[i] = fileContent.charCodeAt(i);
          }
          blob = new Blob([uint8Array], {
            type: "text/plain; charset=x-user-defined",
          });
        } else {
          blob = new Blob([fileContent]);
        }

        if (window.navigator.msSaveOrOpenBlob(blob, fileName)) {
          resolve("File saved successfully");
        } else {
          reject(
            new Error("File save failed: A failure occurred during saving.")
          );
        }
        return;
      }
      reject(
        new Error(
          "File save failed: Save operation is not supported by the browser."
        )
      );
    });
  }

  static isFileConstructorAvailable() {
    // Test whether required functions exist
    if (
      typeof window.URL !== "function" ||
      typeof window.Blob !== "function" ||
      typeof window.File !== "function"
    ) {
      return false;
    }
    // Test whether the constructor works as expected
    try {
      // eslint-disable-next-line no-new
      new File(["Content"], "fileName", {
        type: "image/png",
        lastModified: Date.now(),
      });
    } catch (ignored) {
      return false;
    }
    // Everything is available
    return true;
  }

  static isMsSaveAvailable() {
    return (
      typeof window.Blob === "function" &&
      typeof window.navigator.msSaveOrOpenBlob === "function"
    );
  }
}

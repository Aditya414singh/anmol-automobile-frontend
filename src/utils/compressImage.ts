export const compressImage = (
  file: File,
  maxWidth = 1800,
  quality = 0.85
): Promise<File> => {
  // Already small enough — don't compress
  if (file.size <= 1 * 1024 * 1024) {
    return Promise.resolve(file);
  }

  return new Promise((resolve, reject) => {
    const image = new Image();

    const objectUrl = URL.createObjectURL(file);

    image.onload = () => {
      URL.revokeObjectURL(objectUrl);

      const scale = Math.min(
        1,
        maxWidth / image.width
      );

      const width = Math.round(
        image.width * scale
      );

      const height = Math.round(
        image.height * scale
      );

      const canvas = document.createElement("canvas");

      canvas.width = width;
      canvas.height = height;

      const context = canvas.getContext("2d");

      if (!context) {
        reject(
          new Error("Unable to process image.")
        );
        return;
      }

      context.drawImage(
        image,
        0,
        0,
        width,
        height
      );

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(
              new Error("Unable to compress image.")
            );
            return;
          }

          const compressedFile = new File(
            [blob],
            file.name.replace(
              /\.[^/.]+$/,
              ".jpg"
            ),
            {
              type: "image/jpeg",
              lastModified: Date.now(),
            }
          );

          resolve(compressedFile);
        },
        "image/jpeg",
        quality
      );
    };

    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);

      reject(
        new Error("Unable to read image.")
      );
    };

    image.src = objectUrl;
  });
};
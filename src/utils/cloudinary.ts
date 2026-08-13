export const getOptimizedCloudinaryUrl = (
  url: string,
  width?: number
): string => {
  if (!url) {
    return url;
  }

  // Only optimize Cloudinary URLs
  if (!url.includes("res.cloudinary.com")) {
    return url;
  }

  const transformations = [
    "f_auto",
    "q_auto",
  ];

  if (width) {
    transformations.push(`w_${width}`);
  }

  const transformationString =
    transformations.join(",");

  const uploadMarker = "/upload/";

  if (!url.includes(uploadMarker)) {
    return url;
  }

  // If this URL already contains our optimization,
  // don't add the transformations again.
  if (
    url.includes("f_auto") ||
    url.includes("q_auto")
  ) {
    return url;
  }

  return url.replace(
    uploadMarker,
    `${uploadMarker}${transformationString}/`
  );
};
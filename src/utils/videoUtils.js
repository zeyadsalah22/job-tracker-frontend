/**
 * Video utility functions for interview recording management
 */

/**
 * Combines multiple video blobs into a single blob
 * @param {Blob[]} blobs - Array of video blobs to combine
 * @returns {Blob|null} - Combined video blob or null if invalid
 */
export const combineVideoBlobs = (blobs) => {
  if (!blobs || blobs.length === 0) {
    console.warn("No video blobs provided to combine");
    return null;
  }

  // Filter out null/undefined blobs
  const validBlobs = blobs.filter(blob => blob instanceof Blob && blob.size > 0);
  
  if (validBlobs.length === 0) {
    console.warn("No valid video blobs to combine");
    return null;
  }

  // WebM format allows simple concatenation
  const combinedBlob = new Blob(validBlobs, { type: "video/webm" });
  
  console.log(`Combined ${validBlobs.length} video blobs into ${(combinedBlob.size / (1024 * 1024)).toFixed(2)}MB`);
  
  return combinedBlob;
};

/**
 * Converts a Blob to a File object for FormData upload
 * @param {Blob} blob - The blob to convert
 * @param {string} filename - The filename to use
 * @returns {File} - File object ready for upload
 */
export const blobToFile = (blob, filename = "interview-recording.webm") => {
  if (!(blob instanceof Blob)) {
    throw new Error("Invalid blob provided");
  }
  
  return new File([blob], filename, { 
    type: blob.type || "video/webm",
    lastModified: Date.now()
  });
};

/**
 * Validates video file constraints
 * @param {Blob} blob - The video blob to validate
 * @param {number} maxSizeMB - Maximum allowed size in MB (default 100)
 * @returns {Object} - Validation result with isValid and error message
 */
export const validateVideoConstraints = (blob, maxSizeMB = 100) => {
  if (!blob) {
    return {
      isValid: false,
      error: "No video file provided"
    };
  }

  if (!(blob instanceof Blob)) {
    return {
      isValid: false,
      error: "Invalid video file format"
    };
  }

  const sizeMB = blob.size / (1024 * 1024);
  
  if (sizeMB > maxSizeMB) {
    return {
      isValid: false,
      error: `Video size (${sizeMB.toFixed(2)}MB) exceeds maximum allowed size of ${maxSizeMB}MB. Please record a shorter interview.`
    };
  }

  if (blob.size === 0) {
    return {
      isValid: false,
      error: "Video file is empty"
    };
  }

  return {
    isValid: true,
    sizeMB: sizeMB.toFixed(2)
  };
};

/**
 * Creates a preview URL for a video blob
 * @param {Blob} blob - The video blob
 * @returns {string} - Object URL for preview
 */
export const createVideoPreviewUrl = (blob) => {
  if (!blob || !(blob instanceof Blob)) {
    return null;
  }
  return URL.createObjectURL(blob);
};

/**
 * Revokes a video preview URL to free memory
 * @param {string} url - The object URL to revoke
 */
export const revokeVideoPreviewUrl = (url) => {
  if (url && typeof url === 'string' && url.startsWith('blob:')) {
    URL.revokeObjectURL(url);
  }
};


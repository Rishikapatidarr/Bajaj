// helpers/fileHandler.js
const mime = require("mime-types");

const handleFile = (base64String) => {
  if (!base64String) return { file_valid: false };

  try {
    const buffer = Buffer.from(base64String, "base64");
    const fileType = mime.lookup(buffer);
    const fileSizeKB = (buffer.length / 1024).toFixed(2);
    return { file_valid: true, file_mime_type: fileType, file_size_kb: fileSizeKB };
  } catch {
    return { file_valid: false };
  }
};

module.exports = { handleFile };

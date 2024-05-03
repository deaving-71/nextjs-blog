export function bufferToDataUri(buffer: Buffer, mimeType: string) {
  const b64 = Buffer.from(buffer).toString("base64");
  const dataURI = "data:" + mimeType + ";base64," + b64;
  return dataURI;
}

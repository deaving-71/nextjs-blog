export function slugify(str: string) {
  if (str === "") throw new Error("Received empty string");

  return str
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "");
}

import { config } from "#config/storage";
import { v2 as cloudinary, UploadApiOptions } from "cloudinary";

cloudinary.config(config);

export async function uploadImage(imagePath: string) {
  const options: UploadApiOptions = {
    folder: "blog",
    use_filename: true,
    unique_filename: false,
    overwrite: true,
    resource_type: "image",
  };

  const result = await cloudinary.uploader.upload(imagePath, options);
  return result.url;
}

export async function removeImage(url: string) {
  const thumbnailName = url.split("/").at(-1);
  if (!thumbnailName) return;

  const publicId = "blog/" + thumbnailName.split(".")[0];
  console.log("publicId: ", publicId);

  await cloudinary.api.delete_resources([publicId], {
    type: "upload",
    resource_type: "image",
  });
}

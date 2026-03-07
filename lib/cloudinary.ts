import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export { cloudinary };

/**
 * Upload un fichier vers Cloudinary
 * @param file - Le fichier à uploader
 * @param folder - Le dossier dans Cloudinary (ex: "zekatech/projects")
 * @param resourceType - Type de ressource: "image" ou "video"
 * @returns L'URL sécurisée du fichier uploadé
 */
export async function uploadToCloudinary(
  file: File,
  folder: string = "zekatech/projects",
  resourceType: "image" | "video" = "image"
): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: resourceType,
        // Optimisations automatiques pour les images
        ...(resourceType === "image" && {
          transformation: [
            { quality: "auto", fetch_format: "auto" },
          ],
        }),
      },
      (error, result) => {
        if (error || !result) {
          reject(error || new Error("Upload failed"));
        } else {
          resolve(result.secure_url);
        }
      }
    );

    uploadStream.end(buffer);
  });
}

/**
 * Supprime un fichier de Cloudinary
 * @param publicId - L'ID public du fichier (extrait de l'URL)
 * @param resourceType - Type de ressource: "image" ou "video"
 */
export async function deleteFromCloudinary(
  publicId: string,
  resourceType: "image" | "video" = "image"
): Promise<void> {
  await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
}

/**
 * Extrait le public_id d'une URL Cloudinary
 * @param url - L'URL Cloudinary complète
 * @returns Le public_id
 */
export function extractPublicId(url: string): string {
  const parts = url.split("/");
  const filename = parts[parts.length - 1];
  const publicId = filename.split(".")[0];
  const folder = parts.slice(parts.indexOf("upload") + 1, -1).join("/");
  return folder ? `${folder}/${publicId}` : publicId;
}

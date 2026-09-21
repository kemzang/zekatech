import { NextResponse } from "next/server";
import { withAdmin } from "@/lib/auth";
import { uploadToCloudinary } from "@/lib/cloudinary";

const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
];

/** Controle de la signature binaire : le type MIME annonce vient du client. */
function sniff(buf: Buffer): string | null {
  if (buf.length < 12) return null;
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff)
    return "image/jpeg";
  if (
    buf
      .subarray(0, 8)
      .equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))
  )
    return "image/png";
  if (buf.subarray(0, 6).toString("latin1").startsWith("GIF8"))
    return "image/gif";
  if (
    buf.subarray(0, 4).toString("latin1") === "RIFF" &&
    buf.subarray(8, 12).toString("latin1") === "WEBP"
  )
    return "image/webp";
  if (buf.subarray(0, 4).equals(Buffer.from([0x1a, 0x45, 0xdf, 0xa3])))
    return "video/webm";
  if (buf.subarray(4, 8).toString("latin1") === "ftyp") {
    const brand = buf.subarray(8, 12).toString("latin1");
    return brand.startsWith("qt") ? "video/quicktime" : "video/mp4";
  }
  return null;
}

async function assertRealType(file: File, allowed: string[]) {
  const buf = Buffer.from(await file.arrayBuffer());
  const detected = sniff(buf);
  return detected !== null && allowed.includes(detected);
}
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED_VIDEO_TYPES = ["video/mp4", "video/webm", "video/quicktime"];
const MAX_VIDEO_SIZE = 100 * 1024 * 1024; // 100 MB

export const POST = withAdmin(async (req: Request) => {
  try {
    const formData = await req.formData();
    const videoFile = formData.get("video");
    const files = formData.getAll("files") as File[];

    // Upload vidéo
    if (videoFile && videoFile instanceof File && videoFile.size > 0) {
      if (!ALLOWED_VIDEO_TYPES.includes(videoFile.type)) {
        return NextResponse.json(
          { error: "Vidéo non autorisée. Utilisez MP4, WebM ou MOV." },
          { status: 400 },
        );
      }
      if (videoFile.size > MAX_VIDEO_SIZE) {
        return NextResponse.json(
          { error: "Vidéo trop volumineuse. Max 100 Mo." },
          { status: 400 },
        );
      }

      if (!(await assertRealType(videoFile, ALLOWED_VIDEO_TYPES))) {
        return NextResponse.json(
          { error: "Le contenu du fichier ne correspond pas à une vidéo." },
          { status: 400 },
        );
      }
      const url = await uploadToCloudinary(
        videoFile,
        "zekatech/projects/videos",
        "video",
      );
      return NextResponse.json({ url });
    }

    // Upload images
    const fileArray = files.filter(
      (f): f is File => f instanceof File && f.size > 0,
    );
    if (fileArray.length > 20) {
      return NextResponse.json(
        { error: "20 images maximum par envoi." },
        { status: 400 },
      );
    }
    if (!fileArray.length) {
      return NextResponse.json(
        {
          error:
            "Aucun fichier image envoyé. Choisissez une ou plusieurs images sur votre PC.",
        },
        { status: 400 },
      );
    }

    const urls: string[] = [];
    for (const file of fileArray) {
      if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
        return NextResponse.json(
          {
            error: `Type non autorisé: ${file.name}. Utilisez JPEG, PNG, GIF ou WebP.`,
          },
          { status: 400 },
        );
      }
      if (file.size > MAX_IMAGE_SIZE) {
        return NextResponse.json(
          { error: `Fichier trop volumineux: ${file.name}. Max 5 Mo.` },
          { status: 400 },
        );
      }

      if (!(await assertRealType(file, ALLOWED_IMAGE_TYPES))) {
        return NextResponse.json(
          {
            error: `Le contenu de ${file.name} ne correspond pas à une image.`,
          },
          { status: 400 },
        );
      }
      const url = await uploadToCloudinary(
        file,
        "zekatech/projects/images",
        "image",
      );
      urls.push(url);
    }

    return NextResponse.json({ urls });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Erreur lors de l'upload." },
      { status: 500 },
    );
  }
});

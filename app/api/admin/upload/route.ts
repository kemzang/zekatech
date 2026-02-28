import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads", "projects");
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED_VIDEO_TYPES = ["video/mp4", "video/webm", "video/quicktime"];
const MAX_VIDEO_SIZE = 100 * 1024 * 1024; // 100 MB

export async function POST(req: Request) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }
  try {
    const formData = await req.formData();
    const videoFile = formData.get("video");
    const files = formData.getAll("files") as File[];

    if (videoFile && videoFile instanceof File && videoFile.size > 0) {
      if (!ALLOWED_VIDEO_TYPES.includes(videoFile.type)) {
        return NextResponse.json(
          { error: "Vidéo non autorisée. Utilisez MP4, WebM ou MOV." },
          { status: 400 }
        );
      }
      if (videoFile.size > MAX_VIDEO_SIZE) {
        return NextResponse.json(
          { error: "Vidéo trop volumineuse. Max 100 Mo." },
          { status: 400 }
        );
      }
      await mkdir(UPLOAD_DIR, { recursive: true });
      const ext = path.extname(videoFile.name) || ".mp4";
      const name = `v-${randomUUID()}${ext}`;
      const filePath = path.join(UPLOAD_DIR, name);
      const buf = Buffer.from(await videoFile.arrayBuffer());
      await writeFile(filePath, buf);
      return NextResponse.json({ url: `/uploads/projects/${name}` });
    }

    const fileArray = files.filter((f): f is File => f instanceof File && f.size > 0);
    if (!fileArray.length) {
      return NextResponse.json(
        { error: "Aucun fichier image envoyé. Choisissez une ou plusieurs images sur votre PC." },
        { status: 400 }
      );
    }
    await mkdir(UPLOAD_DIR, { recursive: true });
    const urls: string[] = [];
    for (const file of fileArray) {
      if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
        return NextResponse.json(
          { error: `Type non autorisé: ${file.name}. Utilisez JPEG, PNG, GIF ou WebP.` },
          { status: 400 }
        );
      }
      if (file.size > MAX_IMAGE_SIZE) {
        return NextResponse.json(
          { error: `Fichier trop volumineux: ${file.name}. Max 5 Mo.` },
          { status: 400 }
        );
      }
      const ext = path.extname(file.name) || ".jpg";
      const name = `${randomUUID()}${ext}`;
      const filePath = path.join(UPLOAD_DIR, name);
      const buf = Buffer.from(await file.arrayBuffer());
      await writeFile(filePath, buf);
      urls.push(`/uploads/projects/${name}`);
    }
    return NextResponse.json({ urls });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Erreur lors de l'upload." },
      { status: 500 }
    );
  }
}

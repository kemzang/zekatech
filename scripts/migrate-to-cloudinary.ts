/**
 * Script de migration des images locales vers Cloudinary
 * Usage: npx tsx scripts/migrate-to-cloudinary.ts
 */

import { PrismaClient } from "@prisma/client";
import { cloudinary } from "../lib/cloudinary";
import { readdir, readFile } from "fs/promises";
import path from "path";

const prisma = new PrismaClient();

async function migrateImages() {
  console.log("🚀 Début de la migration vers Cloudinary...\n");

  const uploadsDir = path.join(process.cwd(), "public", "uploads", "projects");
  
  try {
    const files = await readdir(uploadsDir);
    const imageFiles = files.filter(f => /\.(jpg|jpeg|png|gif|webp)$/i.test(f));
    
    console.log(`📁 ${imageFiles.length} images trouvées localement\n`);

    for (const filename of imageFiles) {
      const localPath = path.join(uploadsDir, filename);
      const localUrl = `/uploads/projects/${filename}`;
      
      console.log(`📤 Upload: ${filename}...`);
      
      try {
        // Lire le fichier
        const fileBuffer = await readFile(localPath);
        
        // Upload vers Cloudinary
        const result = await new Promise<{ secure_url: string }>((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            {
              folder: "zekatech/projects/images",
              resource_type: "image",
              transformation: [{ quality: "auto", fetch_format: "auto" }],
            },
            (error, result) => {
              if (error) reject(error);
              else if (result) resolve(result);
              else reject(new Error("No result"));
            }
          );
          uploadStream.end(fileBuffer);
        });

        console.log(`   ✅ Uploadé: ${result.secure_url}`);

        // Mettre à jour la base de données
        // Chercher les projets qui utilisent cette image
        const projectsWithImage = await prisma.project.findMany({
          where: {
            OR: [
              { imageUrl: localUrl },
              { imageUrls: { contains: localUrl } },
            ],
          },
        });

        for (const project of projectsWithImage) {
          let updated = false;
          
          // Mettre à jour imageUrl
          if (project.imageUrl === localUrl) {
            await prisma.project.update({
              where: { id: project.id },
              data: { imageUrl: result.secure_url },
            });
            console.log(`   📝 Projet "${project.title}" - imageUrl mis à jour`);
            updated = true;
          }

          // Mettre à jour imageUrls
          if (project.imageUrls?.includes(localUrl)) {
            const urls = JSON.parse(project.imageUrls) as string[];
            const newUrls = urls.map(url => url === localUrl ? result.secure_url : url);
            await prisma.project.update({
              where: { id: project.id },
              data: { imageUrls: JSON.stringify(newUrls) },
            });
            console.log(`   📝 Projet "${project.title}" - imageUrls mis à jour`);
            updated = true;
          }

          if (!updated) {
            console.log(`   ⚠️  Image non utilisée dans la DB`);
          }
        }

        console.log("");
      } catch (error) {
        console.error(`   ❌ Erreur: ${error}`);
      }
    }

    console.log("✨ Migration terminée!\n");
    console.log("📌 Prochaines étapes:");
    console.log("   1. Vérifie que les images s'affichent correctement");
    console.log("   2. Tu peux supprimer le dossier public/uploads/projects/");
    console.log("   3. Redéploie sur Vercel\n");

  } catch (error) {
    console.error("❌ Erreur lors de la lecture du dossier:", error);
  }
}

migrateImages()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

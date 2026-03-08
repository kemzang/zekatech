import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { ProfileForm } from "./profile-form";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-semibold text-foreground">Mon Profil</h1>
      <p className="mt-1 text-muted-foreground">
        Gérez vos informations personnelles et votre mot de passe.
      </p>
      <div className="mt-6">
        <ProfileForm user={session.user} />
      </div>
    </div>
  );
}

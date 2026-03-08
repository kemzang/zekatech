import { Resend } from "resend";

// Utiliser une clé par défaut en développement si non configurée
const resend = new Resend(process.env.RESEND_API_KEY || "re_placeholder");

const FROM_EMAIL = process.env.FROM_EMAIL || "onboarding@resend.dev";

/**
 * Envoie un email de réinitialisation de mot de passe
 */
export async function sendPasswordResetEmail(
  to: string,
  resetLink: string,
  userName?: string
) {
  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: "Réinitialisation de votre mot de passe - ZekaTech",
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Réinitialisation de mot de passe</title>
          </head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 28px;">ZekaTech</h1>
            </div>
            
            <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
              <h2 style="color: #333; margin-top: 0;">Réinitialisation de mot de passe</h2>
              
              ${userName ? `<p>Bonjour ${userName},</p>` : '<p>Bonjour,</p>'}
              
              <p>Vous avez demandé à réinitialiser votre mot de passe. Cliquez sur le bouton ci-dessous pour créer un nouveau mot de passe :</p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${resetLink}" 
                   style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                          color: white; 
                          padding: 14px 30px; 
                          text-decoration: none; 
                          border-radius: 5px; 
                          display: inline-block;
                          font-weight: bold;">
                  Réinitialiser mon mot de passe
                </a>
              </div>
              
              <p style="color: #666; font-size: 14px;">
                Ou copiez ce lien dans votre navigateur :<br>
                <a href="${resetLink}" style="color: #667eea; word-break: break-all;">${resetLink}</a>
              </p>
              
              <div style="background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; border-radius: 4px;">
                <p style="margin: 0; color: #856404;">
                  <strong>⚠️ Important :</strong> Ce lien expire dans 1 heure.
                </p>
              </div>
              
              <p style="color: #666; font-size: 14px;">
                Si vous n'avez pas demandé cette réinitialisation, vous pouvez ignorer cet email en toute sécurité.
              </p>
              
              <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
              
              <p style="color: #999; font-size: 12px; text-align: center;">
                © ${new Date().getFullYear()} ZekaTech. Tous droits réservés.<br>
                Cet email a été envoyé automatiquement, merci de ne pas y répondre.
              </p>
            </div>
          </body>
        </html>
      `,
    });

    if (error) {
      console.error("Erreur Resend:", error);
      throw new Error("Échec de l'envoi de l'email");
    }

    return { success: true, data };
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'email:", error);
    throw error;
  }
}

/**
 * Envoie un email de bienvenue
 */
export async function sendWelcomeEmail(to: string, userName?: string) {
  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: "Bienvenue sur ZekaTech ! 🎉",
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 28px;">🎉 Bienvenue !</h1>
            </div>
            
            <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
              ${userName ? `<h2 style="color: #333; margin-top: 0;">Bonjour ${userName} !</h2>` : '<h2 style="color: #333; margin-top: 0;">Bonjour !</h2>'}
              
              <p>Merci de vous être inscrit sur <strong>ZekaTech</strong>. Nous sommes ravis de vous compter parmi nous !</p>
              
              <p>Vous pouvez maintenant :</p>
              <ul style="color: #666;">
                <li>Découvrir nos services</li>
                <li>Consulter nos projets</li>
                <li>Nous contacter pour vos besoins</li>
              </ul>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.NEXTAUTH_URL}" 
                   style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                          color: white; 
                          padding: 14px 30px; 
                          text-decoration: none; 
                          border-radius: 5px; 
                          display: inline-block;
                          font-weight: bold;">
                  Visiter le site
                </a>
              </div>
              
              <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
              
              <p style="color: #999; font-size: 12px; text-align: center;">
                © ${new Date().getFullYear()} ZekaTech. Tous droits réservés.
              </p>
            </div>
          </body>
        </html>
      `,
    });

    if (error) {
      console.error("Erreur Resend:", error);
      return { success: false };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'email:", error);
    return { success: false };
  }
}

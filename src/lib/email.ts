import nodemailer from 'nodemailer';

export async function sendConfirmationEmail(email: string, name: string, date: string, time: string) {
  const smtpUser = process.env.EMAIL_HOST_USER;
  const smtpPass = process.env.EMAIL_HOST_PASSWORD;

  const htmlContent = `
    <html>
      <body style="font-family: 'Georgia', serif; color: #111; max-width: 600px; margin: auto; padding: 20px;">
        <h2 style="color: #C9A84C;">Shanthi's Tailoring Atelier</h2>
        <p>Dear ${name},</p>
        <p>Your bespoke consultation is confirmed for <strong>${date} at ${time}</strong>.</p>
        <p>We look forward to crafting perfection with you.</p>
        <p>Warm regards,<br/>The Shanthi Team</p>
      </body>
    </html>
  `;

  if (!smtpUser || !smtpPass) {
    console.log("\n" + "=".repeat(50));
    console.log("MOCK EMAIL SENT (Add EMAIL_HOST_USER and EMAIL_HOST_PASSWORD to .env.local to send real emails)");
    console.log(`To: ${email}`);
    console.log("Subject: Your Appointment Confirmation - Shanthi's");
    console.log(htmlContent);
    console.log("=".repeat(50) + "\n");
    return true;
  }

  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    await transporter.sendMail({
      from: `"Shanthi's Tailoring" <${smtpUser}>`,
      to: email,
      subject: "Your Appointment Confirmation - Shanthi's",
      html: htmlContent,
    });

    return true;
  } catch (error) {
    console.error("Failed to send email:", error);
    return false;
  }
}

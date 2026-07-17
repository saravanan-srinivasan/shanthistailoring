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

export async function sendAdminNotification(adminEmail: string, customerName: string, date: string, time: string, phone: string, email: string) {
  const smtpUser = process.env.EMAIL_HOST_USER;
  const smtpPass = process.env.EMAIL_HOST_PASSWORD;

  const htmlContent = `
    <html>
      <body style="font-family: Arial, sans-serif; color: #333; max-width: 600px; padding: 20px;">
        <h2 style="color: #222;">New Appointment Alert!</h2>
        <p><strong>Customer:</strong> ${customerName}</p>
        <p><strong>Date:</strong> ${date}</p>
        <p><strong>Time:</strong> ${time}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><br/>Please check the Admin Portal for full details.</p>
      </body>
    </html>
  `;

  if (!smtpUser || !smtpPass) {
    console.log("MOCK ADMIN ALERT SENT to " + adminEmail);
    return true;
  }

  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: { user: smtpUser, pass: smtpPass },
    });

    await transporter.sendMail({
      from: `"Shanthi's Website" <${smtpUser}>`,
      to: adminEmail,
      subject: `New Booking: ${customerName} on ${date}`,
      html: htmlContent,
    });
    return true;
  } catch (error) {
    console.error("Failed to send admin alert:", error);
    return false;
  }
}

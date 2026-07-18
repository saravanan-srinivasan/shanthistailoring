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

export async function sendQuoteEmail(email: string, customerName: string, quotePrice: number, orderId: string, baseUrl: string) {
  const smtpUser = process.env.EMAIL_HOST_USER;
  const smtpPass = process.env.EMAIL_HOST_PASSWORD;

  const checkoutUrl = `${baseUrl}/checkout/${orderId}`;

  const htmlContent = `
    <html>
      <body style="font-family: Arial, sans-serif; color: #333; max-width: 600px; padding: 20px;">
        <h2 style="color: #C9A84C;">Your Custom Design Quote is Ready!</h2>
        <p>Dear ${customerName},</p>
        <p>Our master tailors have reviewed your measurements and reference photos. We are thrilled to bring your design to life!</p>
        <p><strong>Total Quotation:</strong> ₹${quotePrice}</p>
        <p>To confirm your order and begin production, please complete your secure zero-fee UPI payment by clicking the link below:</p>
        <br/>
        <a href="${checkoutUrl}" style="background-color: #C9A84C; color: #000; padding: 12px 24px; text-decoration: none; font-weight: bold; border-radius: 4px; display: inline-block;">Proceed to Payment</a>
        <br/><br/>
        <p>Warm regards,<br/>The Shanthi Team</p>
      </body>
    </html>
  `;

  if (!smtpUser || !smtpPass) {
    console.log("MOCK QUOTE EMAIL SENT to " + email);
    console.log("Checkout Link: " + checkoutUrl);
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
      from: `"Shanthi's Tailoring" <${smtpUser}>`,
      to: email,
      subject: "Your Custom Design Quote - Shanthi's",
      html: htmlContent,
    });
    return true;
  } catch (error) {
    console.error("Failed to send quote email:", error);
    return false;
  }
}

// -------------------------------------------------------------
// NEW NOTIFICATION FUNCTIONS
// -------------------------------------------------------------

export async function sendOnlineOrderAdminAlert(customerName: string, garmentType: string, email: string) {
  const smtpUser = process.env.EMAIL_HOST_USER;
  const smtpPass = process.env.EMAIL_HOST_PASSWORD;
  
  const htmlContent = `
    <html>
      <body style="font-family: Arial, sans-serif; color: #333; max-width: 600px; padding: 20px;">
        <h2 style="color: #222;">🚨 NEW ONLINE ORDER</h2>
        <p><strong>Customer:</strong> ${customerName}</p>
        <p><strong>Garment Type:</strong> ${garmentType}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><br/>Please check the Admin Portal Remote Orders tab to review measurements and send a quote!</p>
      </body>
    </html>
  `;

  if (!smtpUser || !smtpPass) return true;
  try {
    const transporter = nodemailer.createTransport({ host: 'smtp.gmail.com', port: 465, secure: true, auth: { user: smtpUser, pass: smtpPass } });
    await transporter.sendMail({ from: `"Shanthi's Website" <${smtpUser}>`, to: smtpUser, subject: `🚨 New Order: ${garmentType} from ${customerName}`, html: htmlContent });
  } catch (error) { console.error(error); }
}

export async function sendOnlineOrderCustomerConfirmation(email: string, customerName: string, garmentType: string) {
  const smtpUser = process.env.EMAIL_HOST_USER;
  const smtpPass = process.env.EMAIL_HOST_PASSWORD;
  
  const htmlContent = `
    <html>
      <body style="font-family: Arial, sans-serif; color: #333; max-width: 600px; padding: 20px;">
        <h2 style="color: #C9A84C;">Measurements Received!</h2>
        <p>Dear ${customerName},</p>
        <p>Thank you for submitting your custom measurements for your <strong>${garmentType}</strong>.</p>
        <p>Our master tailor is currently reviewing your profile and reference images. We will email you a custom quotation shortly.</p>
        <p>Warm regards,<br/>The Shanthi Team</p>
      </body>
    </html>
  `;

  if (!smtpUser || !smtpPass) return true;
  try {
    const transporter = nodemailer.createTransport({ host: 'smtp.gmail.com', port: 465, secure: true, auth: { user: smtpUser, pass: smtpPass } });
    await transporter.sendMail({ from: `"Shanthi's Tailoring" <${smtpUser}>`, to: email, subject: "We received your measurements!", html: htmlContent });
  } catch (error) { console.error(error); }
}

export async function sendPaymentConfirmedAdminAlert(customerName: string, paymentType: string, detail: string) {
  const smtpUser = process.env.EMAIL_HOST_USER;
  const smtpPass = process.env.EMAIL_HOST_PASSWORD;
  
  const htmlContent = `
    <html>
      <body style="font-family: Arial, sans-serif; color: #333; max-width: 600px; padding: 20px;">
        <h2 style="color: #222;">💰 PAYMENT ALERT</h2>
        <p><strong>Customer:</strong> ${customerName}</p>
        <p><strong>Type:</strong> ${paymentType}</p>
        <p><strong>Details:</strong> ${detail}</p>
        <p><br/>You can now begin production on this order!</p>
      </body>
    </html>
  `;

  if (!smtpUser || !smtpPass) return true;
  try {
    const transporter = nodemailer.createTransport({ host: 'smtp.gmail.com', port: 465, secure: true, auth: { user: smtpUser, pass: smtpPass } });
    await transporter.sendMail({ from: `"Shanthi's Website" <${smtpUser}>`, to: smtpUser, subject: `💰 Payment Alert: ${customerName}`, html: htmlContent });
  } catch (error) { console.error(error); }
}

export async function sendPaymentReceiptCustomer(email: string, customerName: string, paymentType: string) {
  const smtpUser = process.env.EMAIL_HOST_USER;
  const smtpPass = process.env.EMAIL_HOST_PASSWORD;
  
  const htmlContent = `
    <html>
      <body style="font-family: Arial, sans-serif; color: #333; max-width: 600px; padding: 20px;">
        <h2 style="color: #C9A84C;">Order Confirmed</h2>
        <p>Dear ${customerName},</p>
        <p>Your payment details (${paymentType}) have been received successfully!</p>
        <p>We are officially beginning production on your custom garment. We will notify you as soon as it is ready.</p>
        <p>Warm regards,<br/>The Shanthi Team</p>
      </body>
    </html>
  `;

  if (!smtpUser || !smtpPass) return true;
  try {
    const transporter = nodemailer.createTransport({ host: 'smtp.gmail.com', port: 465, secure: true, auth: { user: smtpUser, pass: smtpPass } });
    await transporter.sendMail({ from: `"Shanthi's Tailoring" <${smtpUser}>`, to: email, subject: "Order Confirmed - Production Started!", html: htmlContent });
  } catch (error) { console.error(error); }
}

export async function sendOrderRejectedEmail(email: string, customerName: string) {
  const smtpUser = process.env.EMAIL_HOST_USER;
  const smtpPass = process.env.EMAIL_HOST_PASSWORD;
  
  const htmlContent = `
    <html>
      <body style="font-family: Arial, sans-serif; color: #333; max-width: 600px; padding: 20px;">
        <h2 style="color: #C9A84C;">Update regarding your design request</h2>
        <p>Dear ${customerName},</p>
        <p>Thank you for submitting your custom design request.</p>
        <p>After careful review of the measurements and reference images, our master tailor has determined that we cannot fulfill this specific design to our quality standards at this time.</p>
        <p>We apologize for any inconvenience and hope to serve you in the future.</p>
        <p>Warm regards,<br/>The Shanthi Team</p>
      </body>
    </html>
  `;

  if (!smtpUser || !smtpPass) return true;
  try {
    const transporter = nodemailer.createTransport({ host: 'smtp.gmail.com', port: 465, secure: true, auth: { user: smtpUser, pass: smtpPass } });
    await transporter.sendMail({ from: `"Shanthi's Tailoring" <${smtpUser}>`, to: email, subject: "Update regarding your design request", html: htmlContent });
  } catch (error) { console.error(error); }
}

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Sends an email via Resend's API.
 * Used currently for: forgot-password reset links.
 */
async function sendEmail(to, subject, html) {
  try {
    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM,
      to,
      subject,
      html,
    });

    if (error) {
      console.error("Resend error:", error);
      throw new Error("Failed to send email.");
    }

    return data;
  } catch (error) {
    console.error("Email sending failed:", error);
    throw error;
  }
}

export { sendEmail };
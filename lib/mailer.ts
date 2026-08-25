import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.ZOHO_SMTP_HOST,
  port: Number(process.env.ZOHO_SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.ZOHO_SMTP_USER,
    pass: process.env.ZOHO_SMTP_PASS,
  },
});

export async function sendWaitlistConfirmation(toEmail: string) {
  await transporter.sendMail({
    from: '"PlayThruu" <hello@playthruu.com>',
    to: toEmail,
    subject: "You're on the list",
    text: "You're on the PlayThruu waitlist. We'll email you the moment it's your turn — see you on the other side.\n\nThis is a one-time confirmation — you won't hear from us again until launch. Questions? Just reply to this email.",
    html: `<p>You're on the PlayThruu waitlist.</p><p>We'll email you the moment it's your turn — see you on the other side.</p><p style="color:#8a9086;font-size:13px;">This is a one-time confirmation — you won't hear from us again until launch. Questions? Just reply to this email.</p>`,
  });
}

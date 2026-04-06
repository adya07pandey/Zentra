import nodemailer from "nodemailer";


const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,    
  secure: false,   
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});



transporter.verify().then(() => {
  console.log("✅ SMTP transporter is ready");
}).catch(console.error);

// Send OTP email
export const sendOTPEmail = async (email, otp) => {
  await transporter.sendMail({
    from: `"Zentra" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Verify your email",
    html: `<h2>Your OTP is: ${otp}</h2>`,
  });
};

// Send Invite email
export const sendInviteEmail = async (to, link) => {
  await transporter.sendMail({
    from: `"Zorvyn" <${process.env.EMAIL_USER}>`,
    to,
    subject: "You're invited!",
    html: `
      <h2>You’ve been invited</h2>
      <p>Click below to join:</p>
      <a href="${link}">Accept Invite</a>
      <p>This link expires in 24 hours.</p>
    `,
  });
};
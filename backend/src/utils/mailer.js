import nodemailer from "nodemailer";

export const sendOTPEmail = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"Zentra" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Verify your email",
    html: `<h2>Your OTP is: ${otp}</h2>`,
  });
};

const transporter_invite = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendInviteEmail = async (to, link) => {
  console.log("sending email")
  await transporter_invite.sendMail({
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
  console.log("sent email")
};
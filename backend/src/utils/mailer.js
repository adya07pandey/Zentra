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

export const verifyMailer = async () => {
  try {
    await transporter.verify();
    console.log("Mail server is ready");
  } catch (err) {
    console.error("Mail server error:", err.message);
  }
};

export const sendOTPEmail = async (to, otp) => {
  try {
    if (process.env.NODE_ENV === "production" && !process.env.EMAIL_USER) {
      console.log("OTP (fallback):", otp);
      return;
    }

    const mailOptions = {
      from: `"Zentra Finance" <${process.env.EMAIL_USER}>`,
      to,
      subject: "Your OTP Code",
      html: `
        <div style="font-family: Arial; padding: 20px;">
          <h2>Verify Your Account</h2>
          <p>Your OTP code is:</p>
          <h1 style="letter-spacing: 3px;">${otp}</h1>
          <p>This OTP is valid for 10 minutes.</p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);

    console.log("Email sent:", info.messageId);
  } catch (err) {
    console.error("Email Error:", err.message);
    console.log("OTP (fallback):", otp);
  }
};
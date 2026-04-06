import prisma from "../../config/db.js";
import bcrypt from "bcrypt";
import { generateOTPWithHash } from "../../utils/otp.js";
import { sendOTPEmail } from "../../utils/mailer.js";
import jwt from "jsonwebtoken";

export const signupInit = async ({ name, email, password, orgName }) => {

  const session = await prisma.signupSession.findUnique({
    where: { email },
  });

  const now = new Date();


  if (session?.otpBlockedUntil && session.otpBlockedUntil > now) {
    throw {
      status: 429,
      message: "Too many OTP requests. Try again after 24 hours.",
    };
  }


  if (session && session.otpAttempts >= 3) {
   
    await prisma.signupSession.update({
      where: { email },
      data: {
        otpBlockedUntil: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
    });

    throw {
      status: 429,
      message: "OTP limit exceeded. Blocked for 24 hours.",
    };
  }


  const hashedPassword = await bcrypt.hash(password, 10);
  const { otp, otpHash } = await generateOTPWithHash();

  await prisma.signupSession.upsert({
    where: { email },
    update: {
      name,
      password: hashedPassword,
      orgName,
      otpHash,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),

      otpAttempts: { increment: 1 },
      otpBlockedUntil: null, // reset if previously blocked
    },
    create: {
      email,
      name,
      password: hashedPassword,
      orgName,
      otpHash,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
      otpAttempts: 1,
    },
  });

  await sendOTPEmail(email, otp);

  return { message: "OTP sent" };
};



export const signupVerify = async ({ email, otp }) => {

  const session = await prisma.signupSession.findUnique({
    where: { email },
  });

  if (!session) {
    throw { status: 404, message: "No signup session found" };
  }

  if (session.expiresAt < new Date()) {
    throw { status: 400, message: "OTP expired" };
  }

  const isMatch = await bcrypt.compare(otp, session.otpHash);
  if (!isMatch) {
    throw { status: 401, message: "Invalid OTP" };
  }

  const result = await prisma.$transaction(async (tx) => {

    const user = await tx.user.create({
      data: {
        email: session.email,
        name: session.name,
        password: session.password,
        isVerified: true,
      },
    });

    const org = await tx.organization.create({
      data: { name: session.orgName },
    });

    await tx.membership.create({
      data: {
        userId: user.id,
        orgId: org.id,
        role: "OWNER",
      },
    });

    return { user, org };
  });

  await prisma.signupSession.delete({
    where: { id: session.id },
  });

  const token = jwt.sign(
    {
      userId: result.user.id,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  return token;
};


export const login = async ({ email, password }) => {

  if (!email || !email.includes("@")) {
    throw { status: 400, message: "Invalid email" };
  }

  const user = await prisma.user.findUnique({
    where: { email }
  });

  if (!user || !user.password) {
    throw { status: 401, message: "Invalid credentials" };
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw { status: 401, message: "Invalid credentials" };
  }
  const token = jwt.sign(
    {
      userId: user.id,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
  return token;
};


export const getMe = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      memberships: {
        select: {
          role: true,
          org: {
            select: {
              id: true,
              name: true
            }
          }
        }
      }
    }
  });
  if (!user) {
    throw { status: 404, message: "User not found" };
  }
  

  return user;
};
import prisma from "../../config/db.js";
import crypto from "crypto";
import { sendInviteEmail } from "../../utils/mailer.js";
import bcrypt from "bcrypt";

export const getUsers = async (orgId) => {
  return await prisma.membership.findMany({
    where: { orgId },
    select: {
      role: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          status:true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};


export const inviteUser = async (email, role, orgId, createdBy) => {
  console.log("services reached");

  // 0️⃣ Check if user already exists in this org
  const existingMembership = await prisma.membership.findFirst({
    where: {
      orgId,
      user: {
        email: email,
      },
    },
  });

  if (existingMembership) {
    throw new Error("User is already a member of this organization");
  }

  // 1️⃣ Generate secure token
  const token = crypto.randomBytes(32).toString("hex");

  // 2️⃣ Expiry 24 hours
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

  // 3️⃣ Save invite
  const invite = await prisma.invite.create({
    data: {
      email,
      role,
      orgId,
      token,
      expiresAt,
      createdBy,
    },
  });

 const inviteLink = `http://localhost:5173/accept-invite?token=${token}`;
  // 4️⃣ Send invite email
  await sendInviteEmail(email, inviteLink);

  return { message: "Invite sent successfully", inviteLink };
};

export const acceptInvite = async (token, password, name) => {
  const invite = await prisma.invite.findUnique({
    where: { token },
  });

  if (!invite) throw new Error("Invalid invite");

  if (invite.expiresAt < new Date()) {
    throw new Error("Invite expired");
  }

  // check if user already exists
  let user = await prisma.user.findUnique({
    where: { email: invite.email },
  });

  // create user if not exists
  if (!user) {
    const hashedPassword = await bcrypt.hash(password, 10);

    user = await prisma.user.create({
      data: {
        email: invite.email,
        name,
        password: hashedPassword,
        isVerified: true,
      },
    });
  }

  // create membership
  await prisma.membership.create({
    data: {
      userId: user.id,
      orgId: invite.orgId,
      role: invite.role,
    },
  });

  // delete invite
  await prisma.invite.delete({
    where: { token },
  });

  return { message: "Account created successfully" };
};
import prisma from "../../config/db.js";

//////////////////////////////////////////////////
// CREATE ACCOUNT
//////////////////////////////////////////////////

export const createAccount = async (data, orgId) => {
  const { name, type } = data;

  // ❗ check duplicate
  const existing = await prisma.account.findFirst({
    where: {
      name,
      orgId,
    },
  });

  if (existing) {
    throw new Error("Account with this name already exists");
  }

  return await prisma.account.create({
    data: {
      name,
      type,
      orgId,
    },
  });
};

//////////////////////////////////////////////////
// GET ALL ACCOUNTS (ORG-SCOPED)
//////////////////////////////////////////////////

export const getAccounts = async (orgId) => {
  return await prisma.account.findMany({
    where: { orgId },
    orderBy: { createdAt: "desc" },
  });
};

//////////////////////////////////////////////////
// GET SINGLE ACCOUNT
//////////////////////////////////////////////////

export const getAccountById = async (id, orgId) => {
  const account = await prisma.account.findFirst({
    where: {
      id,
      orgId,
    },
  });

  if (!account) throw new Error("Account not found");

  return account;
};

//////////////////////////////////////////////////
// UPDATE ACCOUNT
//////////////////////////////////////////////////

export const updateAccount = async (id, data, orgId) => {

  const account = await prisma.account.findFirst({
    where: { id, orgId },
  });

  if (!account) throw new Error("Account not found");

  // ❗ prevent duplicate name
  if (data.name) {
    const existing = await prisma.account.findFirst({
      where: {
        name: data.name,
        orgId,
        NOT: { id },
      },
    });

    if (existing) {
      throw new Error("Account name already used");
    }
  }

  return await prisma.account.update({
    where: { id },
    data,
  });
};
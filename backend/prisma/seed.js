import prisma from "../src/config/db.js";
import bcrypt from "bcrypt";

function randomBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomDate() {
  const now = new Date();
  const past = new Date();
  past.setMonth(now.getMonth() - 4); // last 4 months

  return new Date(
    past.getTime() +
      Math.random() * (now.getTime() - past.getTime())
  );
}

async function main() {
  console.log("🌱 Advanced Seeding...");

  const password = await bcrypt.hash("12345678", 10);

  // 👥 USERS
  const users = await Promise.all([
    prisma.user.create({
      data: { name: "Adya", email: "lefty7304@gmail.com", password },
    }),
    prisma.user.create({
      data: { name: "Rahul", email: "rahul@mail.com", password },
    }),
    prisma.user.create({
      data: { name: "Priya", email: "priya@mail.com", password },
    }),
    prisma.user.create({
      data: { name: "Karan", email: "karan@mail.com", password },
    }),
  ]);

  // 🏢 ORG
  const org = await prisma.organization.create({
    data: { name: "Nebula" },
  });

  // 🔐 MEMBERSHIPS
  const roles = ["OWNER", "ADMIN", "ANALYST", "VIEWER"];

  await prisma.membership.createMany({
    data: users.map((u, i) => ({
      userId: u.id,
      orgId: org.id,
      role: roles[i],
    })),
  });

  // 💼 ACCOUNTS
  const accountNames = [
    { name: "Cash", type: "ASSET" },
    { name: "Bank", type: "ASSET" },
    { name: "Revenue", type: "REVENUE" },
    { name: "Food Expense", type: "EXPENSE" },
    { name: "Rent Expense", type: "EXPENSE" },
    { name: "Transport Expense", type: "EXPENSE" },
    { name: "Utilities Expense", type: "EXPENSE" },
  ];

  await prisma.account.createMany({
    data: accountNames.map((a) => ({
      ...a,
      orgId: org.id,
    })),
  });

  const accounts = await prisma.account.findMany({
    where: { orgId: org.id },
  });

  const get = (name) => accounts.find((a) => a.name === name);

  const expenseAccounts = accounts.filter((a) => a.type === "EXPENSE");
  const assetAccounts = accounts.filter((a) => a.type === "ASSET");

  // 🔁 TRANSACTION CREATOR
  const createTxn = async (desc, entries, userId, date) => {
    return prisma.$transaction(async (tx) => {
      const txn = await tx.transaction.create({
        data: {
          description: desc,
          orgId: org.id,
          createdById: userId,
          createdAt: date,
        },
      });

      await tx.entry.createMany({
        data: entries.map((e) => ({
          ...e,
          transactionId: txn.id,
          createdAt: date,
        })),
      });
    });
  };

  // 💰 GENERATE 100+ TRANSACTIONS
  for (let i = 0; i < 120; i++) {
    const isIncome = Math.random() > 0.6;
    const user = users[randomBetween(0, users.length - 1)];
    const date = randomDate();

    if (isIncome) {
      const amount = randomBetween(5000, 50000);

      await createTxn(
        "Income Transaction",
        [
          {
            accountId: get("Bank").id,
            type: "DEBIT",
            amount,
          },
          {
            accountId: get("Revenue").id,
            type: "CREDIT",
            amount,
          },
        ],
        user.id,
        date
      );
    } else {
      const expenseAcc =
        expenseAccounts[randomBetween(0, expenseAccounts.length - 1)];
      const assetAcc =
        assetAccounts[randomBetween(0, assetAccounts.length - 1)];

      const amount = randomBetween(500, 15000);

      await createTxn(
        expenseAcc.name,
        [
          {
            accountId: expenseAcc.id,
            type: "DEBIT",
            amount,
          },
          {
            accountId: assetAcc.id,
            type: "CREDIT",
            amount,
          },
        ],
        user.id,
        date
      );
    }
  }

  // 🧾 ACCOUNT BALANCES
  const entries = await prisma.entry.findMany({
    include: { account: true },
  });

  const balanceMap = {};

  entries.forEach((e) => {
    const id = e.accountId;
    const amt = Number(e.amount);

    if (!balanceMap[id]) balanceMap[id] = 0;

    if (e.account.type === "ASSET" || e.account.type === "EXPENSE") {
      balanceMap[id] += e.type === "DEBIT" ? amt : -amt;
    } else {
      balanceMap[id] += e.type === "CREDIT" ? amt : -amt;
    }
  });

  for (let accId in balanceMap) {
    await prisma.accountBalance.create({
      data: {
        accountId: accId,
        balance: balanceMap[accId],
      },
    });
  }

  // 📜 AUDIT LOGS
  await prisma.auditLog.createMany({
    data: Array.from({ length: 20 }).map(() => ({
      orgId: org.id,
      userId: users[randomBetween(0, users.length - 1)].id,
      action: "TRANSACTION_EVENT",
      entity: "Transaction",
    })),
  });

  console.log("✅ Advanced seed complete!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
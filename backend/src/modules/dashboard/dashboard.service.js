// services/dashboard.service.js
import prisma from "../../config/db.js";

export const getDashboardData = async (orgId) => {
  // 🔹 1. ALL ENTRIES
  const entries = await prisma.entry.findMany({
    where: {
      account: {
        orgId,
      },
    },
    include: {
      account: true,
      transaction: true,
    },
  });

  let income = 0;
  let expense = 0;

  // 🔹 2. CALCULATE INCOME & EXPENSE
  entries.forEach((e) => {
    const amount = Number(e.amount);

    if (e.account.type === "REVENUE" && e.type === "CREDIT") {
      income += amount;
    }

    if (e.account.type === "EXPENSE" && e.type === "DEBIT") {
      expense += amount;
    }
  });

  const net = income - expense;

  // 🔹 3. ACCOUNT COUNT
  const accountCount = await prisma.account.count({
    where: { orgId },
  });

  // 🔹 4. RECENT TRANSACTIONS
  const recentTransactions = await prisma.transaction.findMany({
    where: { orgId },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  // 🔹 5. CATEGORY BREAKDOWN
  const categoryMap = {};

  entries.forEach((e) => {
    if (e.account.type === "EXPENSE") {
      const key = e.account.name;
      const amt = Number(e.amount);

      if (!categoryMap[key]) categoryMap[key] = 0;
      categoryMap[key] += amt;
    }
  });

  const categoryBreakdown = Object.entries(categoryMap).map(
    ([name, value]) => ({
      name,
      value,
    })
  );

  // 🔹 6. ACCOUNT BALANCES
  const balances = await prisma.accountBalance.findMany({
    include: {
      account: {
        select: {
          name: true,
        },
      },
    },
  });

  const accountBalances = balances.map((b) => ({
    account: b.account.name,
    balance: Number(b.balance),
  }));

  // 🔹 7. ACTIVITY LOGS
  const activity = await prisma.auditLog.findMany({
    where: { orgId },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  return {
    summary: {
      income,
      expense,
      net,
      accounts: accountCount,
    },
    recentTransactions,
    categoryBreakdown,
    accountBalances,
    activity,
  };
};
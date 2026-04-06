import prisma from "../../config/db.js";

export const createTransaction = async (data, userId, orgId) => {

    const { description, entries } = data;


    let debit = 0;
    let credit = 0;

    for (let e of entries) {
        if (e.type === "DEBIT") debit += Number(e.amount);
        else credit += Number(e.amount);
    }

    if (debit !== credit) {
        throw new Error("Transaction not balanced");
    }

    

    const result = await prisma.$transaction(async (tx) => {
        const transaction = await tx.transaction.create({
            data: {
                description,
                orgId,
                createdById: userId,
            },
        });

        await tx.entry.createMany({
            data: entries.map((e) => ({
                transactionId: transaction.id,
                accountId: e.accountId,
                type: e.type,
                amount: e.amount,
            })),
        });

        return transaction;
    });

    return result;
};



export const getTransactionById = async (transactionId, orgId) => {
  const transaction = await prisma.transaction.findFirst({
    where: {
      id: transactionId,
      orgId, 
    },
    include: {
      entries: {
        include: {
          account: {
            select: {
              id: true,
              name: true,
              type: true,
            },
          },
        },
      },
      createdBy: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  if (!transaction) {
    throw new Error("Transaction not found");
  }

 
  const formatted = {
    id: transaction.id,
    description: transaction.description,
    status: transaction.status,
    createdAt: transaction.createdAt,
    createdBy: transaction.createdBy,

    entries: transaction.entries.map((e) => ({
      accountId: e.account.id,
      accountName: e.account.name,
      accountType: e.account.type,
      type: e.type,
      amount: Number(e.amount),
    })),
  };

  return formatted;
};


export const reverseTransaction = async (transactionId, userId, orgId) => {
  return await prisma.$transaction(async (tx) => {
   
    const original = await tx.transaction.findFirst({
      where: {
        id: transactionId,
        orgId,
      },
      include: {
        entries: true,
      },
    });

    if (!original) {
      throw new Error("Transaction not found");
    }

    if (original.isReversed) {
      throw new Error("Transaction already reversed");
    }

    const reversal = await tx.transaction.create({
      data: {
        description: `Reversal of ${original.description}`,
        orgId,
        createdById: userId,
        reversedFromId: original.id,
      },
    });

    const reversedEntries = original.entries.map((e) => ({
      transactionId: reversal.id,
      accountId: e.accountId,
      type: e.type === "DEBIT" ? "CREDIT" : "DEBIT",
      amount: e.amount,
    }));

    await tx.entry.createMany({
      data: reversedEntries,
    });


    await tx.transaction.update({
      where: { id: original.id },
      data: { isReversed: true },
    });

    return reversal;
  });
};

export const getAllTransactions = async (orgId, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;

  const [transactions, total] = await Promise.all([
    prisma.transaction.findMany({
      where: { orgId },
      include: {
        entries: true,
        createdBy: {
          select: { name: true },
        },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),

    prisma.transaction.count({
      where: { orgId },
    }),
  ]);


  const formatted = transactions.map((t) => {
    let debit = 0;
    let credit = 0;

    t.entries.forEach((e) => {
      if (e.type === "DEBIT") debit += Number(e.amount);
      else credit += Number(e.amount);
    });

    return {
      id: t.id,
      description: t.description,
      createdAt: t.createdAt,
      createdBy: t.createdBy?.name,
      debit,
      credit,
    };
  });

  return {
    data: formatted,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};
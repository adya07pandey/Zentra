import prisma from "../../config/db.js";

export const getLedger = async (accountId, orgId) => {
    
    const entries = await prisma.entry.findMany({
        where: {
            accountId,
            account: {
                orgId,
            },
        },
        include: {
            transaction: {
                select: {
                    id: true,
                    description: true,
                    createdAt: true,
                },
            },
        },
        orderBy: {
            createdAt: "asc",
        },
    });

    const account = await prisma.account.findUnique({
        where: { id: accountId },
    });

    let balance = 0;

    const ledger = entries.map((e) => {
        const amount = Number(e.amount);

        if (account.type === "ASSET" || account.type === "EXPENSE") {
            if (e.type === "DEBIT") balance += amount;
            else balance -= amount;
        } else {
            if (e.type === "CREDIT") balance += amount;
            else balance -= amount;
        }

        return {
            transactionId: e.transaction.id,
            description: e.transaction.description,
            date: e.transaction.createdAt,
            debit: e.type === "DEBIT" ? amount : 0,
            credit: e.type === "CREDIT" ? amount : 0,
            balance,
        };
    });
    return ledger;
};


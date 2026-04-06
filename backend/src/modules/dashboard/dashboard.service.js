import prisma from "../../config/db.js";

export const getDashboardData = async (orgId) => {
    
    
    // ALL ENTRIES
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



    // CALCULATE INCOME & EXPENSE
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



    //ACCOUNT COUNT
    const accountCount = await prisma.account.count({
        where: { orgId },
    });



    //RECENT TRANSACTIONS
    const recentTransactions = await prisma.transaction.findMany({
        where: { orgId },
        orderBy: { createdAt: "desc" },
        take: 5,
    });



    //CATEGORY BREAKDOWN
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



    // ACCOUNT BALANCES
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


    //ACTIVITY LOGS
    const activity = await prisma.auditLog.findMany({
        where: { orgId },
        orderBy: { createdAt: "desc" },
        take: 5,
    });



    //MONTHLY TREND (INCOME VS EXPENSE)
    // const monthOrder = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    // monthlyTrend.sort(
    //     (a, b) => monthOrder.indexOf(a.month) - monthOrder.indexOf(b.month)
    // );
    // const monthlyMap = {};

    // entries.forEach((e) => {
    //     const date = new Date(e.transaction.createdAt);

    //     // format: Jan, Feb, Mar
    //     const month = date.toLocaleString("default", { month: "short" });

    //     if (!monthlyMap[month]) {
    //         monthlyMap[month] = { income: 0, expense: 0 };
    //     }

    //     const amount = Number(e.amount);

    //     // INCOME
    //     if (e.account.type === "REVENUE" && e.type === "CREDIT") {
    //         monthlyMap[month].income += amount;
    //     }

    //     // EXPENSE
    //     if (e.account.type === "EXPENSE" && e.type === "DEBIT") {
    //         monthlyMap[month].expense += amount;
    //     }
    // });

    // const monthlyTrend = Object.entries(monthlyMap).map(([month, val]) => ({
    //     month,
    //     income: val.income,
    //     expense: val.expense,
    // }));




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
        // monthlyTrend
    };
};
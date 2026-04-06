import { useEffect, useState } from "react";
import { getDashboard } from "../api/dashboard";
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
    PieChart, Pie
} from "recharts";

export default function Dash({ org }) {
    const [data, setData] = useState(null);

    useEffect(() => {
        if (org) {
            fetchDashboard();
        }
    }, [org]);

    const fetchDashboard = async () => {
        try {
            const res = await getDashboard(org.orgId);
            setData(res);
        } catch (err) {
            alert("Error loading dashboard");
        }
    };

    if (!org) return <div>Please select an organization</div>;
    if (!data) return <div>Loading dashboard...</div>;

    const { summary, recentTransactions, categoryBreakdown, accountBalances } = data;

    const barData = [
        { name: "Income", value: summary.income },
        { name: "Expense", value: summary.expense },
    ];

    const pieData = categoryBreakdown;
    return (
        <div className="dashboard">

            {/* 🔝 SUMMARY CARDS */}
            <div className="cards">
                <div className="card">
                    <h4>Total Income</h4>
                    <p>₹{summary.income}</p>
                </div>

                <div className="card">
                    <h4>Total Expense</h4>
                    <p>₹{summary.expense}</p>
                </div>

                <div className="card">
                    <h4>Net Balance</h4>
                    <p>₹{summary.net}</p>
                </div>

                <div className="card">
                    <h4>Accounts</h4>
                    <p>{summary.accounts}</p>
                </div>
            </div>

            {/* 📊 MAIN GRID */}
            <div className="dashboard-grid">

                {/* 📊 BAR CHART */}
                <div className="box">
                    <h3>Income vs Expense</h3>
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={barData}>
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />

                            <Bar dataKey="value">
                                {barData.map((entry, index) => (
                                    <cell
                                        key={index}
                                        fill={entry.name === "Income" ? "#1f4843" : "#d9534f"}
                                    />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* 🥧 PIE CHART */}
                <div className="box">
                    <h3>Category Breakdown</h3>
                    <ResponsiveContainer width="100%" height={250}>
                        {pieData.length > 0 ? (
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    dataKey="value"
                                    nameKey="name"
                                    outerRadius={80}
                                    fill="#1f4843"
                                />
                                <Tooltip />
                            </PieChart>
                        ) : (
                            <p>No data available</p>
                        )}
                    </ResponsiveContainer>
                </div>

                {/* 🧾 RECENT TRANSACTIONS */}
                <div className="box">
                    <h3>Recent Transactions</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Description</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentTransactions.map((t) => (
                                <tr key={t.id}>
                                    <td>{new Date(t.createdAt).toLocaleDateString()}</td>
                                    <td>{t.description}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* 💰 ACCOUNT BALANCES */}
                <div className="box">
                    <h3>Account Balances</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>Account</th>
                                <th>Balance</th>
                            </tr>
                        </thead>
                        <tbody>
                            {accountBalances.map((a, i) => (
                                <tr key={i}>
                                    <td>{a.account}</td>
                                    <td>₹{a.balance}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

            </div>
        </div>
    );
}
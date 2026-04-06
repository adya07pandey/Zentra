import { useEffect, useState } from "react";
import Dash from "../components/Dash";
import Transactions from "../components/Transactions";
import Accounts from "../components/Accounts";
import Ledger from "../components/Ledger";
import Users from "../components/Users";
import { getMyself } from "../api/auth";

export default function Dashboard() {
    const [activeComponent, setActiveComponent] = useState("dashboard");
    const [orgs, setOrgs] = useState([]); // store all orgs with id & name
    const [selectedOrg, setSelectedOrg] = useState(null);

    const getButtonClass = (name) => (activeComponent === name ? "active" : "");

    const getOrgs = async () => {
        try {
            const res = await getMyself();

            if (res?.data?.user?.memberships && Array.isArray(res.data.user.memberships)) {
                const orgList = res.data.user.memberships.map((m) => ({
                    orgId: m.org.id,
                    orgName: m.org.name
                }));

                setOrgs(orgList);

                // Set first org as default selected
                if (orgList.length > 0) {
                    setSelectedOrg(orgList[0]);
                }
            } else {
                console.warn("No memberships found", res);
            }
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        getOrgs();
    }, []);

    return (
        <div className="wholepage">
            <div className="navbar">
                <img src="/logo.png" alt="logo" />
                <select
                    className="org-selector"
                    value={selectedOrg?.orgId || ""}
                    onChange={(e) => {
                        const org = orgs.find((o) => o.orgId === e.target.value);
                        setSelectedOrg(org || null);
                    }}
                >
                    {orgs.map((org) => (
                        <option key={org.orgId} value={org.orgId}>
                            {org.orgName}
                        </option>
                    ))}
                    <option value="create">+ Create Organization</option>
                </select>
            </div>

            <div className="mainside">
                <div className="leftside">
                    <button className={getButtonClass("dashboard")} onClick={() => setActiveComponent("dashboard")}>
                        Dashboard
                    </button>
                    <button className={getButtonClass("transactions")} onClick={() => setActiveComponent("transactions")}>
                        Transactions
                    </button>
                    <button className={getButtonClass("accounts")} onClick={() => setActiveComponent("accounts")}>
                        Accounts
                    </button>
                    <button className={getButtonClass("ledger")} onClick={() => setActiveComponent("ledger")}>
                        Ledger
                    </button>
                    <button className={getButtonClass("users")} onClick={() => setActiveComponent("users")}>
                        Users
                    </button>
                </div>

                <div className="rightside">
                    {activeComponent === "dashboard" && <Dash org={selectedOrg} />}
                    {activeComponent === "transactions" && <Transactions org={selectedOrg} />}
                    {activeComponent === "accounts" && <Accounts org={selectedOrg} />}
                    {activeComponent === "ledger" && <Ledger org={selectedOrg} />}
                    {activeComponent === "users" && <Users org={selectedOrg} />}
                </div>
            </div>
        </div>
    );
}
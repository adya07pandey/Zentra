import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authRoutes from "./modules/auth/auth.routes.js";
import { errorHandler } from "./middleware/error.middleware.js";
import ledgerRoutes from "./modules/ledger/ledger.routes.js";
import transactionRoutes from "./modules/transactions/transaction.routes.js"
import accountRoutes from "./modules/accounts/accounts.routes.js";
import userRoutes from "./modules/users/user.routes.js";
import dashboardRoutes from "./modules/dashboard/dashboard.routes.js";


dotenv.config();

const app = express();
app.get("/", (req, res) => {
  res.send("Backend running");
});

const corsOptions = {
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE"],  
  allowedHeaders: ["Content-Type", "Authorization","x-org-id"],  
  credentials: true, 
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authRoutes);
app.use("/api/ledger", ledgerRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/accounts", accountRoutes);
app.use("/api/users", userRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.use(errorHandler);
export default app;
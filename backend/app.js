import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";

// Route imports — uncomment as you build each module out
// import authRoutes from "./routes/auth.routes.js";
// import companyRoutes from "./routes/company.routes.js";
// import deliveryListRoutes from "./routes/deliveryList.routes.js";
// import routeRoutes from "./routes/route.routes.js";
// import routeHistoryRoutes from "./routes/routeHistory.routes.js";

const app = express();

// ---------- Global middleware ----------
app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

// ---------- Health check ----------
app.get("/health", (req, res) => {
  res.status(200).json({ 
    timestamp: new Date().toISOString(),
    message: "Server is working properly",
  });
});

// ---------- Routes ----------
app.use("/api/v1/auth", authRoutes);


// ---------- 404 handler ----------
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// ---------- Global error handler ----------
app.use((err, req, res, next) => {
  console.error(err.stack);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    message: err.message || "Internal Server Error",
    ...(process.env.NODE_ENV !== "production" && { stack: err.stack }),
  });
});

export default app;
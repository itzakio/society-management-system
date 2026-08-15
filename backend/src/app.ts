import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes.js";
import societyRoutes from "./routes/society.routes.js";
import buildingRoutes from "./routes/building.routes.js";
import unitRoutes from "./routes/unit.routes.js";
import residentRoutes from "./routes/resident.routes.js";

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (_req, res) => {
  res.json({
    success: true,
    message: "Society Management API is running",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/societies", societyRoutes);
app.use("/api/buildings", buildingRoutes);
app.use("/api/units", unitRoutes);
app.use("/api/residents", residentRoutes);

export default app;

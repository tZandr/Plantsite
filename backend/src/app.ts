import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";

import articleRoutes from "./routes/article.routes";
import plantRoutes from "./routes/plant.routes";
import userRoutes from "./routes/user.routes";
import authRoutes from "./routes/auth.routes";
import forumPostRoutes from "./routes/forumPost.routes";
import { connectMongo } from "./databases/mongodb/connection";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();

connectMongo();

app.use(express.json());
app.use("/assets", express.static(path.join(process.cwd(), "public/assets")));
app.use(cookieParser());
app.use(
  cors({
    origin: "http://127.0.0.1:5500",
    credentials: true,
  }),
);

app.use("/api/auth", authRoutes);
app.use("/api/articles", articleRoutes);
app.use("/api/user", userRoutes);
app.use("/plants", plantRoutes);
app.use("/community", forumPostRoutes);

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await connectMongo();
    app.listen(PORT, () => {
      console.log(`Server is running at port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to connect to MongoDB: ", error);
    process.exit(1);
  }
};

startServer();

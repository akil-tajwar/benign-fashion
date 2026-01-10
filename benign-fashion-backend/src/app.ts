import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import { errorHandler } from "./middlewares/error.middleware";
import routes from "./routes";
import path from "path";

dotenv.config();

const app = express();

// Middleware
const allowedOrigins = [
  "http://localhost:3000",
  "https://benignfashion.com",
  "https://www.benignfashion.com",
];

app.use(
  cors({
    credentials: true,
    origin: (origin, cb) => {
      // Allow server-to-server or same-origin requests
      if (!origin) return cb(null, true);

      if (allowedOrigins.includes(origin)) {
        return cb(null, true);
      }

      // ❗ DO NOT throw error
      return cb(null, false);
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Explicitly handle preflight
app.options("*", cors());

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Routes
app.use("/api", routes);

// Error handling
app.use(errorHandler);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

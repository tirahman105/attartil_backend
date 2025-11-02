// import express from "express";
// import mongoose from "mongoose";
// import cors from "cors";
// import dotenv from "dotenv";
// import studentRoutes from "./routes/students.js";
// import courseRoutes from "./routes/courses.js";
// import adminRoutes from "./routes/admin.js";

// dotenv.config();

// const app = express();
// const PORT = process.env.PORT || 5000;

// // Middleware
// app.use(cors());
// app.use(express.json());

// // Routes
// app.use("/api/students", studentRoutes);
// app.use("/api/courses", courseRoutes);
// app.use("/api/admin", adminRoutes);

// // MongoDB Connection
// const MONGODB_URI =
//   process.env.MONGODB_URI || "mongodb://localhost:27017/at-tarteel-academy";
// mongoose
//   .connect(MONGODB_URI)
//   .then(() => console.log("✅ MongoDB Connected Successfully"))
//   .catch((err) => console.log("❌ MongoDB Connection Error:", err));

// // Basic route
// app.get("/", (req, res) => {
//   res.json({ message: "আত তারতীল একাডেমি API is running!" });
// });

// app.listen(PORT, () => {
//   console.log(`🚀 Server is running on port ${PORT}`);
// });
// import express from "express";
// import mongoose from "mongoose";
// import cors from "cors";
// import dotenv from "dotenv";
// import helmet from "helmet";
// import compression from "compression";
// import morgan from "morgan";
// import rateLimit from "express-rate-limit";
// import studentRoutes from "./routes/students.js";
// import courseRoutes from "./routes/courses.js";
// import adminRoutes from "./routes/admin.js";
// import Admin from "./models/Admin.js";

// dotenv.config();

// const app = express();
// const PORT = process.env.PORT || 5000;

// // Security Middleware
// app.use(
//   helmet({
//     crossOriginResourcePolicy: { policy: "cross-origin" },
//   })
// );

// // Compression middleware
// app.use(compression());

// // Logging middleware
// if (process.env.NODE_ENV === "development") {
//   app.use(morgan("dev"));
// } else {
//   app.use(morgan("combined"));
// }

// // Rate limiting
// const limiter = rateLimit({
//   windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
//   max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
//   message: {
//     success: false,
//     message: "Too many requests from this IP, please try again later.",
//   },
// });
// app.use("/api/", limiter);

// // More strict rate limiting for auth routes
// const authLimiter = rateLimit({
//   windowMs: 15 * 60 * 1000,
//   max: 5,
//   message: {
//     success: false,
//     message: "Too many authentication attempts, please try again later.",
//   },
// });
// app.use("/api/admin/login", authLimiter);
// app.use("/api/admin/forgot-password", authLimiter);

// // CORS configuration - FIXED
// app.use(
//   cors({
//     origin: function (origin, callback) {
//       // Allow requests with no origin
//       if (!origin) return callback(null, true);

//       const allowedOrigins = [
//         "http://localhost:3000",
//         "http://localhost:5173",
//         "http://localhost:5174",
//       ];

//       if (allowedOrigins.indexOf(origin) !== -1) {
//         callback(null, true);
//       } else {
//         callback(new Error("Not allowed by CORS"));
//       }
//     },
//     credentials: true,
//     methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
//     allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
//   })
// );

// // Handle preflight requests
// app.options("*", cors());

// // Body parsing middleware
// app.use(express.json({ limit: "10mb" }));
// app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// // Routes
// app.use("/api/students", studentRoutes);
// app.use("/api/courses", courseRoutes);
// app.use("/api/admin", adminRoutes);

// // MongoDB Connection
// const MONGODB_URI = process.env.MONGODB_URI;

// const mongooseOptions = {
//   serverSelectionTimeoutMS: 5000,
//   socketTimeoutMS: 45000,
// };

// console.log("🔗 Connecting to MongoDB Atlas...");

// mongoose
//   .connect(MONGODB_URI, mongooseOptions)
//   .then(() => {
//     console.log("✅ MongoDB Atlas Connected Successfully");
//     console.log("📊 Database: AtTartilAcademy");

//     createDefaultSuperAdmin();
//     createDefaultAdmin();
//   })
//   .catch((err) => {
//     console.log("❌ MongoDB Connection Error:", err.message);
//     process.exit(1);
//   });

// // Default superadmin create করার function
// async function createDefaultSuperAdmin() {
//   try {
//     const existingSuperAdmin = await Admin.findOne({ role: "superadmin" });

//     if (!existingSuperAdmin) {
//       const superAdmin = new Admin({
//         name: "Super Admin",
//         username: "superadmin",
//         email: "superadmin@tartil.com",
//         password: "superadmin123",
//         role: "superadmin",
//       });

//       await superAdmin.save();
//       console.log("🎉 Default Super Admin Created Successfully!");
//       console.log("📧 Email: superadmin@tartil.com");
//       console.log("🔑 Password: superadmin123");
//     } else {
//       console.log("✅ Super Admin already exists in database");
//     }
//   } catch (error) {
//     console.error("❌ Error creating default superadmin:", error.message);
//   }
// }

// // Default admin create করার function
// async function createDefaultAdmin() {
//   try {
//     const existingAdmin = await Admin.findOne({ email: "admin@tartil.com" });

//     if (!existingAdmin) {
//       const admin = new Admin({
//         name: "Regular Admin",
//         username: "admin",
//         email: "admin@tartil.com",
//         password: "admin123",
//         role: "admin",
//       });

//       await admin.save();
//       console.log("🎉 Default Admin Created Successfully!");
//       console.log("📧 Email: admin@tartil.com");
//       console.log("🔑 Password: admin123");
//     } else {
//       console.log("✅ Admin already exists in database");
//     }
//   } catch (error) {
//     console.error("❌ Error creating default admin:", error.message);
//   }
// }

// // Basic route
// app.get("/", (req, res) => {
//   res.json({
//     success: true,
//     message: "আত তারতীল একাডেমি API is running!",
//     version: "1.0.0",
//     timestamp: new Date().toISOString(),
//     environment: process.env.NODE_ENV || "development",
//     database: "MongoDB Atlas",
//     endpoints: {
//       admin: "/api/admin",
//       students: "/api/students",
//       courses: "/api/courses",
//       health: "/health",
//     },
//   });
// });

// // Health check route
// app.get("/health", (req, res) => {
//   const dbStatus =
//     mongoose.connection.readyState === 1 ? "connected" : "disconnected";
//   const uptime = process.uptime();

//   res.status(200).json({
//     success: true,
//     status: "OK",
//     timestamp: new Date().toISOString(),
//     database: dbStatus,
//     uptime: `${Math.floor(uptime / 60)}m ${Math.floor(uptime % 60)}s`,
//     environment: process.env.NODE_ENV || "development",
//     platform: "MongoDB Atlas",
//   });
// });

// // Error handling middleware
// app.use((err, req, res, next) => {
//   console.error("🚨 Error Stack:", err.stack);

//   // CORS error
//   if (err.message === "Not allowed by CORS") {
//     return res.status(403).json({
//       success: false,
//       message: "CORS policy: Origin not allowed",
//     });
//   }

//   // Mongoose validation error
//   if (err.name === "ValidationError") {
//     const errors = Object.values(err.errors).map((error) => error.message);
//     return res.status(400).json({
//       success: false,
//       message: "Validation Error",
//       errors,
//     });
//   }

//   // Mongoose duplicate key error
//   if (err.code === 11000) {
//     const field = Object.keys(err.keyValue)[0];
//     return res.status(400).json({
//       success: false,
//       message: `${field} already exists`,
//     });
//   }

//   // JWT error
//   if (err.name === "JsonWebTokenError") {
//     return res.status(401).json({
//       success: false,
//       message: "Invalid token",
//     });
//   }

//   // Default error
//   const statusCode = err.statusCode || 500;
//   const message =
//     process.env.NODE_ENV === "production" && statusCode === 500
//       ? "Internal Server Error"
//       : err.message;

//   res.status(statusCode).json({
//     success: false,
//     message,
//   });
// });

// // 404 handler
// app.use("*", (req, res) => {
//   res.status(404).json({
//     success: false,
//     message: `Route ${req.originalUrl} not found`,
//   });
// });

// const server = app.listen(PORT, () => {
//   console.log(`🚀 Server is running on port ${PORT}`);
//   console.log(`🌐 Environment: ${process.env.NODE_ENV || "development"}`);
//   console.log(`📍 Frontend URL: http://localhost:5173`);
//   console.log(`🔗 Health check: http://localhost:${PORT}/health`);
// });

// ===============
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware - SIMPLE AND RELIABLE
app.use(
  cors({
    origin: "*", // All origins allowed
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import routes
import studentRoutes from "./routes/students.js";
import courseRoutes from "./routes/courses.js";
import adminRoutes from "./routes/admin.js";

// Use routes
app.use("/api/students", studentRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/admin", adminRoutes);

// MongoDB Connection with better error handling
const MONGODB_URI = process.env.MONGODB_URI;

const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("✅ MongoDB Atlas Connected Successfully");
  } catch (error) {
    console.error("❌ MongoDB Connection Failed:", error.message);
    process.exit(1);
  }
};

// Basic routes
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "আত তারতীল একাডেমি API is running!",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
  });
});

app.get("/health", (req, res) => {
  const dbStatus =
    mongoose.connection.readyState === 1 ? "connected" : "disconnected";

  res.json({
    success: true,
    status: "OK",
    database: dbStatus,
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error("Error:", err.message);
  res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Start server
const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
      console.log(`📍 URL: http://localhost:${PORT}`);
      console.log(`🌐 CORS: Enabled for all origins`);
      console.log(`📊 Database: MongoDB Atlas`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

// Handle graceful shutdown
process.on("SIGINT", async () => {
  console.log("🛑 Shutting down server gracefully...");
  await mongoose.connection.close();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  console.log("🛑 Server terminated");
  await mongoose.connection.close();
  process.exit(0);
});

// Start the server
startServer();

import express from "express";
import {
  registerAdmin,
  loginAdmin,
  getProfile,
  forgotPassword,
  resetPassword,
  changePassword,
  getAllAdmins,
  updateAdminStatus,
  deleteAdmin,
} from "../controllers/adminController.js";
import { auth, authorize } from "../middleware/auth.js";
import {
  validateAdminRegistration,
  validateAdminLogin,
  validatePasswordReset,
  validateForgotPassword,
} from "../middleware/validation.js";

const router = express.Router();

// Public routes - এগুলো authentication ছাড়াই accessible
router.post("/login", validateAdminLogin, loginAdmin);
router.post("/forgot-password", validateForgotPassword, forgotPassword);
router.post("/reset-password", validatePasswordReset, resetPassword); // ✅ এটা public রাখুন

// Protected routes - এগুলো শুধু authenticated users এর জন্য
router.use(auth); // All routes below this require authentication

router.get("/profile", getProfile);
router.post("/change-password", changePassword);

// Superadmin only routes
router.post(
  "/register",
  authorize("superadmin"),
  validateAdminRegistration,
  registerAdmin
);
router.get("/all", authorize("superadmin"), getAllAdmins);
router.patch("/:id/status", authorize("superadmin"), updateAdminStatus);
router.delete("/:id", authorize("superadmin"), deleteAdmin);

export default router;

import Admin from "../models/Admin.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

// Register new admin (Only for superadmin)
export const registerAdmin = async (req, res) => {
  try {
    const { name, username, email, password, role } = req.body;

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({
      $or: [{ email }, { username }],
    });

    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        message: "Admin with this email or username already exists",
      });
    }

    // Create new admin
    const admin = new Admin({
      name,
      username,
      email,
      password,
      role,
    });

    await admin.save();

    // Generate token
    const token = generateToken(admin._id);

    res.status(201).json({
      success: true,
      message: "Admin registered successfully",
      data: {
        admin: {
          id: admin._id,
          name: admin.name,
          username: admin.username,
          email: admin.email,
          role: admin.role,
        },
        token,
      },
    });
  } catch (error) {
    console.error("Admin registration error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during admin registration",
    });
  }
};

// Admin login
export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find admin by email
    const admin = await Admin.findOne({ email, isActive: true });
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Check password
    const isPasswordValid = await admin.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Update last login
    admin.lastLogin = new Date();
    await admin.save();

    // Generate token
    const token = generateToken(admin._id);

    res.json({
      success: true,
      message: "Login successful",
      data: {
        admin: {
          id: admin._id,
          name: admin.name,
          username: admin.username,
          email: admin.email,
          role: admin.role,
          lastLogin: admin.lastLogin,
        },
        token,
      },
    });
  } catch (error) {
    console.error("Admin login error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during login",
    });
  }
};

// Get current admin profile
export const getProfile = async (req, res) => {
  try {
    res.json({
      success: true,
      data: {
        admin: req.admin,
      },
    });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching profile",
    });
  }
};

// Forgot password - Generate reset token
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const admin = await Admin.findOne({ email, isActive: true });
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "No admin found with this email address",
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(20).toString("hex");
    admin.resetPasswordToken = resetToken;
    admin.resetPasswordExpires = Date.now() + 3600000; // 1 hour

    await admin.save();

    // In production, you would send an email here
    // For now, we'll return the token (in production, remove this)
    res.json({
      success: true,
      message: "Password reset token generated",
      data: {
        resetToken, // Remove this in production
        message: "In production, this token would be sent via email",
      },
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during password reset",
    });
  }
};

// Reset password with token - FIXED VERSION
export const resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    // Find admin by email
    const admin = await Admin.findOne({
      email: email,
      isActive: true,
    });

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "No admin found with this email address",
      });
    }

    // Update password
    admin.password = newPassword;
    admin.resetPasswordToken = undefined;
    admin.resetPasswordExpires = undefined;

    await admin.save();

    res.json({
      success: true,
      message:
        "Password reset successfully. You can now login with your new password.",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during password reset",
    });
  }
};

// Change password (for logged-in admins)
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const admin = await Admin.findById(req.admin._id);

    // Verify current password
    const isCurrentPasswordValid = await admin.comparePassword(currentPassword);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    // Update password
    admin.password = newPassword;
    await admin.save();

    res.json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error("Change password error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during password change",
    });
  }
};

// Get all admins (Only for superadmin)
export const getAllAdmins = async (req, res) => {
  try {
    const admins = await Admin.find({}).select("-password");

    res.json({
      success: true,
      data: {
        admins,
        count: admins.length,
      },
    });
  } catch (error) {
    console.error("Get all admins error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching admins",
    });
  }
};

// Update admin status (Only for superadmin)
export const updateAdminStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    const admin = await Admin.findByIdAndUpdate(
      id,
      { isActive },
      { new: true }
    ).select("-password");

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    res.json({
      success: true,
      message: `Admin ${isActive ? "activated" : "deactivated"} successfully`,
      data: { admin },
    });
  } catch (error) {
    console.error("Update admin status error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while updating admin status",
    });
  }
};

// Delete admin (Only for superadmin)
export const deleteAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    // Prevent superadmin from deleting themselves
    if (id === req.admin._id.toString()) {
      return res.status(400).json({
        success: false,
        message: "You cannot delete your own account",
      });
    }

    const admin = await Admin.findByIdAndDelete(id);

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    res.json({
      success: true,
      message: "Admin deleted successfully",
    });
  } catch (error) {
    console.error("Delete admin error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while deleting admin",
    });
  }
};

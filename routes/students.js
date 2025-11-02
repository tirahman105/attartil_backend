// import express from "express";
// import Student from "../models/Student.js";

// const router = express.Router();

// // POST - Create new student (Temporary ID বন্ধ করুন)
// router.post("/", async (req, res) => {
//   try {
//     // Temporary ID remove করুন
//     const { regId, ...studentData } = req.body;

//     const student = new Student(studentData);
//     await student.save();

//     res.status(201).json({
//       success: true,
//       message: "Registration Successful! We will contact you soon.",
//       data: student,
//     });
//   } catch (error) {
//     res.status(400).json({
//       success: false,
//       message: error.message,
//     });
//   }
// });

// // GET - All students with advanced filtering
// router.get("/", async (req, res) => {
//   try {
//     const page = parseInt(req.query.page) || 1;
//     const limit = parseInt(req.query.limit) || 10;
//     const skip = (page - 1) * limit;

//     // Build filter object
//     const filter = {};

//     // Course filter
//     if (req.query.course && req.query.course !== "all") {
//       filter.selectedCourse = req.query.course;
//     }

//     // Status filter
//     if (req.query.status && req.query.status !== "all") {
//       filter.status = req.query.status;
//     }

//     // Class Type filter
//     if (req.query.classType && req.query.classType !== "all") {
//       filter.classType = req.query.classType;
//     }

//     // Payment Status filter
//     if (req.query.paymentStatus && req.query.paymentStatus !== "all") {
//       filter.paymentStatus = req.query.paymentStatus;
//     }

//     // Search by name or regId
//     if (req.query.search) {
//       filter.$or = [
//         { studentName: { $regex: req.query.search, $options: "i" } },
//         { regId: { $regex: req.query.search, $options: "i" } },
//         { phoneNumber: { $regex: req.query.search, $options: "i" } },
//       ];
//     }

//     const students = await Student.find(filter)
//       .sort({ registrationDate: -1 })
//       .skip(skip)
//       .limit(limit);

//     const total = await Student.countDocuments(filter);

//     res.json({
//       success: true,
//       data: students,
//       pagination: {
//         page,
//         limit,
//         total,
//         pages: Math.ceil(total / limit),
//       },
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// });

// // GET - Single student
// router.get("/:id", async (req, res) => {
//   try {
//     const student = await Student.findById(req.params.id);
//     if (!student) {
//       return res.status(404).json({
//         success: false,
//         message: "Student not found",
//       });
//     }
//     res.json({
//       success: true,
//       data: student,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// });

// // PUT - Update student (এই route টি খুব important)
// router.put("/:id", async (req, res) => {
//   try {
//     const student = await Student.findByIdAndUpdate(req.params.id, req.body, {
//       new: true,
//       runValidators: true,
//     });

//     if (!student) {
//       return res.status(404).json({
//         success: false,
//         message: "Student not found",
//       });
//     }

//     res.json({
//       success: true,
//       message: "Student updated successfully",
//       data: student,
//     });
//   } catch (error) {
//     res.status(400).json({
//       success: false,
//       message: error.message,
//     });
//   }
// });

// // DELETE - Delete student
// router.delete("/:id", async (req, res) => {
//   try {
//     const student = await Student.findByIdAndDelete(req.params.id);

//     if (!student) {
//       return res.status(404).json({
//         success: false,
//         message: "Student not found",
//       });
//     }

//     res.json({
//       success: true,
//       message: "Student deleted successfully",
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// });

// // PATCH - Update status
// router.patch("/:id/status", async (req, res) => {
//   try {
//     const { status } = req.body;

//     const student = await Student.findByIdAndUpdate(
//       req.params.id,
//       { status },
//       { new: true, runValidators: true }
//     );

//     if (!student) {
//       return res.status(404).json({
//         success: false,
//         message: "Student not found",
//       });
//     }

//     res.json({
//       success: true,
//       message: "Status updated successfully",
//       data: student,
//     });
//   } catch (error) {
//     res.status(400).json({
//       success: false,
//       message: error.message,
//     });
//   }
// });

// export default router;
import express from "express";
import Student from "../models/Student.js";
import { auth, authorize } from "../middleware/auth.js";

const router = express.Router();

// ✅ PUBLIC ROUTE: Student registration (শুধুমাত্র রেজিস্ট্রেশন Public থাকবে)
router.post("/", async (req, res) => {
  try {
    const { regId, ...studentData } = req.body;

    const student = new Student(studentData);
    await student.save();

    res.status(201).json({
      success: true,
      message: "Registration Successful! We will contact you soon.",
      data: student,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

// 🔐 ALL ROUTES BELOW REQUIRE AUTHENTICATION
router.use(auth); // এই লাইন দিয়ে সব routes protected হবে

// GET - All students with advanced filtering - ADMIN ONLY
router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build filter object
    const filter = {};

    // Course filter
    if (req.query.course && req.query.course !== "all") {
      filter.selectedCourse = req.query.course;
    }

    // Status filter
    if (req.query.status && req.query.status !== "all") {
      filter.status = req.query.status;
    }

    // Class Type filter
    if (req.query.classType && req.query.classType !== "all") {
      filter.classType = req.query.classType;
    }

    // Payment Status filter
    if (req.query.paymentStatus && req.query.paymentStatus !== "all") {
      filter.paymentStatus = req.query.paymentStatus;
    }

    // Search by name or regId
    if (req.query.search) {
      filter.$or = [
        { studentName: { $regex: req.query.search, $options: "i" } },
        { regId: { $regex: req.query.search, $options: "i" } },
        { phoneNumber: { $regex: req.query.search, $options: "i" } },
      ];
    }

    const students = await Student.find(filter)
      .sort({ registrationDate: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Student.countDocuments(filter);

    res.json({
      success: true,
      data: students,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// GET - Single student - ADMIN ONLY
router.get("/:id", async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }
    res.json({
      success: true,
      data: student,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// PUT - Update student - ADMIN ONLY
router.put("/:id", async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    res.json({
      success: true,
      message: "Student updated successfully",
      data: student,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

// DELETE - Delete student - ADMIN ONLY
router.delete("/:id", async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    res.json({
      success: true,
      message: "Student deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// PATCH - Update status - ADMIN ONLY
router.patch("/:id/status", async (req, res) => {
  try {
    const { status } = req.body;

    const student = await Student.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    res.json({
      success: true,
      message: "Status updated successfully",
      data: student,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

export default router;

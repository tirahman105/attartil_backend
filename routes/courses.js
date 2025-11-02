import express from "express";
import Course from "../models/Course.js";

const router = express.Router();

// GET - সকল কোর্স
router.get("/", async (req, res) => {
  try {
    const courses = await Course.find({ isActive: true });
    res.json({
      success: true,
      data: courses,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// POST - নতুন কোর্স তৈরি (Admin এর জন্য)
router.post("/", async (req, res) => {
  try {
    const course = new Course(req.body);
    await course.save();
    res.status(201).json({
      success: true,
      data: course,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

// PUT - কোর্স আপডেট
router.put("/:id", async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }
    res.json({
      success: true,
      data: course,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

// DELETE - কোর্স ডিলিট
router.delete("/:id", async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }
    res.json({
      success: true,
      message: "Course deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

export default router;

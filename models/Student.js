// import mongoose from "mongoose";

// const studentSchema = new mongoose.Schema({
//   // Reg ID Field - temporary optional
//   regId: {
//     type: String,
//     unique: true,
//     sparse: true, // Allows multiple null/undefined values
//   },
//   studentName: {
//     type: String,
//     required: [true, "Student name is required"],
//     trim: true,
//   },
//   age: {
//     type: Number,
//     required: [true, "Age is required"],
//     min: [3, "Age must be at least 3"],
//     max: [80, "Age must be at most 80"],
//   },
//   gender: {
//     type: String,
//     required: [true, "Gender is required"],
//     enum: ["Male", "Female"],
//   },
//   parentName: {
//     type: String,
//     required: [true, "Parent name is required"],
//     trim: true,
//   },
//   facebookProfile: {
//     type: String,
//     trim: true,
//   },
//   email: {
//     type: String,
//     trim: true,
//     lowercase: true,
//   },
//   phoneNumber: {
//     type: String,
//     required: [true, "Phone number is required"],
//     trim: true,
//   },
//   address: {
//     type: String,
//     required: [true, "Address is required"],
//     trim: true,
//   },
//   country: {
//     type: String,
//     required: [true, "Country is required"],
//     trim: true,
//   },
//   selectedCourse: {
//     type: String,
//     required: [true, "Course selection is required"],
//   },
//   classType: {
//     type: String,
//     required: [true, "Class type is required"],
//     enum: ["One-to-One", "Batch System"],
//   },
//   // Payment Fields
//   paymentMethod: {
//     type: String,
//     enum: ["bkash", "nogod"],
//     required: true,
//   },
//   bkashNumber: {
//     type: String,
//     trim: true,
//   },
//   bkashTransactionId: {
//     type: String,
//     trim: true,
//   },
//   paymentAmount: {
//     type: Number,
//     required: true,
//   },
//   paymentStatus: {
//     type: String,
//     enum: ["Pending", "Verified", "Failed"],
//     default: "Pending",
//   },
//   status: {
//     type: String,
//     enum: ["Pending", "Approved", "Rejected"],
//     default: "Pending",
//   },
//   registrationDate: {
//     type: Date,
//     default: Date.now,
//   },
// });

// // Reg ID generate করার middleware - Improved version
// studentSchema.pre("save", async function (next) {
//   if (this.isNew) {
//     let regId;
//     let isUnique = false;
//     let attempts = 0;

//     while (!isUnique && attempts < 10) {
//       const randomNum = Math.floor(100000 + Math.random() * 900000);
//       regId = `AT${randomNum}`;

//       const existingStudent = await mongoose
//         .model("Student")
//         .findOne({ regId });

//       if (!existingStudent) {
//         isUnique = true;
//       }
//       attempts++;
//     }

//     if (isUnique) {
//       this.regId = regId;
//     } else {
//       // Fallback: timestamp-based ID
//       this.regId = `AT${Date.now()}`;
//     }
//   }
//   next();
// });

// export default mongoose.model("Student", studentSchema);
// backend/models/Student.js
// backend/models/Student.js
// backend/models/Student.js
import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
  regId: {
    type: String,
    unique: true,
    sparse: true,
  },
  studentName: {
    type: String,
    required: [true, "Student name is required"],
    trim: true,
  },
  age: {
    type: Number,
    required: [true, "Age is required"],
    min: [3, "Age must be at least 3"],
    max: [80, "Age must be at most 80"],
  },
  gender: {
    type: String,
    required: [true, "Gender is required"],
    enum: ["Male", "Female"],
  },
  profession: {
    // ✅ নতুন field যোগ করুন
    type: String,
    required: [true, "Profession is required"],
    trim: true,
  },
  parentName: {
    type: String,
    required: [true, "Parent name is required"],
    trim: true,
  },
  facebookProfile: {
    type: String,
    trim: true,
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
  },
  phoneNumber: {
    type: String,
    required: [true, "Phone number is required"],
    trim: true,
  },
  address: {
    type: String,
    required: [true, "Address is required"],
    trim: true,
  },
  country: {
    type: String,
    required: [true, "Country is required"],
    trim: true,
  },
  selectedCourse: {
    type: String,
    required: [true, "Course selection is required"],
  },
  classType: {
    type: String,
    required: [true, "Class type is required"],
    enum: ["One-to-One", "Batch System"],
  },
  paymentMethod: {
    type: String,
    enum: ["bkash", "nogod"],
    required: true,
  },
  bkashNumber: {
    type: String,
    trim: true,
  },
  bkashTransactionId: {
    type: String,
    trim: true,
  },
  paymentAmount: {
    type: Number,
    required: true,
  },
  paymentStatus: {
    type: String,
    enum: ["Pending", "Verified", "Failed"],
    default: "Pending",
  },
  status: {
    type: String,
    enum: ["Pending", "Approved", "Rejected"],
    default: "Pending",
  },
  registrationDate: {
    type: Date,
    default: Date.now,
  },
});

// Reg ID generate করার middleware
studentSchema.pre("save", async function (next) {
  if (this.isNew) {
    let regId;
    let isUnique = false;
    let attempts = 0;

    while (!isUnique && attempts < 10) {
      const randomNum = Math.floor(100000 + Math.random() * 900000);
      regId = `AT${randomNum}`;

      const existingStudent = await mongoose
        .model("Student")
        .findOne({ regId });

      if (!existingStudent) {
        isUnique = true;
      }
      attempts++;
    }

    if (isUnique) {
      this.regId = regId;
    } else {
      this.regId = `AT${Date.now()}`;
    }
  }
  next();
});

export default mongoose.model("Student", studentSchema);

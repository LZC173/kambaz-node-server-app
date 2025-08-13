import mongoose from "mongoose";

const assignmentSchema = new mongoose.Schema(
  {
    _id: String,                // e.g., "A101"
    title: String,              // assignment title
    course: String,             // course ID, e.g., "RS101"
    modulesText: String,        // display-only text
    availableText: String,      // display-only text
    availableFrom: Date,        // e.g., "2024-05-06"
    availableUntil: Date,       // e.g., "2024-05-27"
    dueDateText: String,        // display-only text
    dueDate: Date,              // e.g., "2024-05-20"
    points: Number,             // e.g., 100
  },
  { collection: "assignments" }
);

export default assignmentSchema;
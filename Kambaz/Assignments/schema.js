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

assignmentSchema.set("toJSON", {
  transform: (_doc, ret) => {
    const fmt = (d) => (d instanceof Date ? d.toISOString().slice(0, 10) : d);
    ret.availableFrom  = fmt(ret.availableFrom);
    ret.availableUntil = fmt(ret.availableUntil);
    ret.dueDate        = fmt(ret.dueDate);
    return ret;
  }
});
export default assignmentSchema;
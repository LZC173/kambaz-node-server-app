// src/Kambaz/Assignments/routes.js
import * as assignmentsDao from "./dao.js";

export default function AssignmentRoutes(app) {
const toUTCDate = (s) => {
  if (!s) return undefined;                
  if (s instanceof Date) return s;         
  if (typeof s === "string") {
    return s.length <= 10                  
      ? new Date(`${s}T00:00:00Z`)
      : new Date(s);                      
  }
  return undefined;
};
const normalizeIn = (p = {}) => ({
  ...p,
  availableFrom:  toUTCDate(p.availableFrom),
  availableUntil: toUTCDate(p.availableUntil),
  dueDate:        toUTCDate(p.dueDate),
});

  app.get("/api/courses/:courseId/assignments", async (req, res) => {
    try {
      const { courseId } = req.params;
      const assignments = await assignmentsDao.findAssignmentsForCourse(courseId);
      res.json(assignments);
    } catch (err) {
      console.error("findAssignmentsForCourse error:", err);
      res.sendStatus(500);
    }
  });


  app.post("/api/courses/:courseId/assignments", async (req, res) => {
    try {
      const { courseId } = req.params;
      const payload = normalizeIn({ ...req.body, course: courseId });
      const newAssignment = await assignmentsDao.createAssignment(payload);
      res.status(201).json(newAssignment);
    } catch (err) {
      console.error("createAssignment error:", err);
      res.sendStatus(500);
    }
  });

  app.get("/api/assignments/:assignmentId", async (req, res) => {
    try {
      const { assignmentId } = req.params;
      const assignment = await assignmentsDao.findAssignmentById(assignmentId);
      if (!assignment) return res.sendStatus(404);
      res.json(assignment);
    } catch (err) {
      console.error("findAssignmentById error:", err);
      res.sendStatus(500);
    }
  });


  app.put("/api/assignments/:assignmentId", async (req, res) => {
    try {
          const { assignmentId } = req.params;
    const updates = normalizeIn(req.body);
    const updated = await assignmentsDao.findByIdAndUpdateReturning(assignmentId, updates);
    if (!updated) return res.sendStatus(404);
    res.json(updated); //
    } catch (err) {
      console.error("updateAssignment error:", err);
      res.sendStatus(500);
    }
  });


  app.delete("/api/assignments/:assignmentId", async (req, res) => {
    try {
      const { assignmentId } = req.params;
      const result = await assignmentsDao.deleteAssignment(assignmentId);

      const deleted =
        (result && typeof result.deletedCount === "number" ? result.deletedCount : result?.n) ?? 0;

      if (deleted === 0) return res.sendStatus(404);
      res.sendStatus(204);
    } catch (err) {
      console.error("deleteAssignment error:", err);
      res.sendStatus(500);
    }
  });
}

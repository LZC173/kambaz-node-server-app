import * as assignmentsDao from "./dao.js";

export default function AssignmentRoutes(app) {


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
      const payload = { ...req.body, course: courseId };
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
      const result = await assignmentsDao.updateAssignment(assignmentId, req.body);

      const matched =
        (result && typeof result.matchedCount === "number" ? result.matchedCount : result?.n) ?? 0;

      if (matched === 0) return res.sendStatus(404);

      res.json(result);
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
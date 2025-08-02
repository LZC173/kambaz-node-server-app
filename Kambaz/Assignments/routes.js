import * as assignmentsDao from "./dao.js";

export default function AssignmentRoutes(app) {
  app.get("/api/courses/:courseId/assignments", (req, res) => {
    const { courseId } = req.params;
    const assignments = assignmentsDao.findAssignmentsForCourse(courseId);
    res.send(assignments);
  });

  app.post("/api/courses/:courseId/assignments", (req, res) => {
    const { courseId } = req.params;
    const payload = { ...req.body, course: courseId };
    const newAssignment = assignmentsDao.createAssignment(payload);
    res.status(201).send(newAssignment);
  });

  app.get("/api/assignments/:assignmentId", (req, res) => {
    const { assignmentId } = req.params;
    const assignment = assignmentsDao.findAssignmentById(assignmentId);
    if (!assignment) {
      res.sendStatus(404);
      return;
    }
    res.send(assignment);
  });

  app.put("/api/assignments/:assignmentId", (req, res) => {
    const { assignmentId } = req.params;
    const updated = assignmentsDao.updateAssignment(assignmentId, req.body);
    if (!updated) {
      res.sendStatus(404);
      return;
    }
    res.send(updated);
  });

  app.delete("/api/assignments/:assignmentId", (req, res) => {
    const { assignmentId } = req.params;
    assignmentsDao.deleteAssignment(assignmentId);
    res.sendStatus(204);
  });
}

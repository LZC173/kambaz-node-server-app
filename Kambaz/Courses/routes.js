import * as dao from "./dao.js";

import * as assignmentsDao from "../Assignments/dao.js";
import * as enrollmentsDao from "../Enrollments/dao.js";
export default function CourseRoutes(app) {
 app.get("/api/courses", async (req, res) => {
   const courses = await dao.findAllCourses();
   res.send(courses);
 });

app.post("/api/courses", async (req, res) => {
   const course = await dao.createCourse(req.body);
   const currentUser = req.session["currentUser"];
   if (currentUser) {
     await enrollmentsDao.enrollUserInCourse(currentUser._id, course._id);
   }
   res.json(course);
 });


  app.delete("/api/courses/:courseId", async (req, res) => {
    const { courseId } = req.params;

    try {
      // delete course and all enrolled status 
      const [courseStatus, enrollStatus] = await Promise.all([
        dao.deleteCourse(courseId),
        enrollmentsDao.deleteEnrollmentsByCourse(courseId),
      ]);

      res.send({ courseStatus, enrollStatus });
    } catch (err) {
      console.error("Delete course cascade failed:", err);
      res.status(500).send({ error: err?.message || String(err) });
    }
  });
 app.put("/api/courses/:courseId", async (req, res) => {
   const { courseId } = req.params;
   const courseUpdates = req.body;
   const status = await dao.updateCourse(courseId, courseUpdates);
   res.send(status);
 });


 const findUsersForCourse = async (req, res) => {
   const { cid } = req.params;
   const users = await enrollmentsDao.findUsersForCourse(cid);
   res.json(users);
 };
 app.get("/api/courses/:cid/users", findUsersForCourse);



  //assignment 

// assignments for a course
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

// create assignment under a course
app.post("/api/courses/:courseId/assignments", async (req, res) => {
  try {
    const { courseId } = req.params;
    const assignmentPayload = { ...req.body, course: courseId };
    const newAssignment = await assignmentsDao.createAssignment(assignmentPayload);
    res.status(201).json(newAssignment);
  } catch (err) {
    console.error("createAssignment error:", err);
    res.sendStatus(500);
  }
});

}
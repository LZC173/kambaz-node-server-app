import * as enrollmentsDao from "../Enrollments/dao.js";

export default function EnrollmentRoutes(app) {
  app.put("/api/enrollments/enroll", (req, res) => {
    const { userId, courseId } = req.body;
    console.log("enroll details:", req.body);
    if (!userId || !courseId) {
      return res.status(400).send({ error: "userId and courseId required" });
    }
    const status = enrollmentsDao.enrollUserInCourse(userId, courseId); // enrollment object or null
    res.send(status);
  });

  app.delete("/api/enrollments/unEnroll", (req, res) => {
    const { userId, courseId } = req.body;
    console.log("unEnroll details:", req.body);
    if (!userId || !courseId) {
      return res.status(400).send({ error: "userId and courseId required" });
    }
    const enrollment = enrollmentsDao.findEnrollmentForUserCourse(userId, courseId);
    if (!enrollment) {
      return res.status(404).send({ error: "Enrollment not found" });
    }
    const status = enrollmentsDao.unenrollUserInCourse(enrollment._id); // boolean
    res.send(status);
  });

  
app.get("/api/users/current/enrollments", (req, res) => {
  const currentUser = req.session?.currentUser; 
  if (!currentUser) {
    return res.status(401).send({ error: "Not signed in" });
  }
  const enrollments = enrollmentsDao.findEnrollmentsForUser(currentUser._id);
  res.send(enrollments);
});
}

import * as enrollmentsDao from "../Enrollments/dao.js";

export default function EnrollmentRoutes(app) {
  // list current user's enrollments
  app.get("/api/users/current/enrollments", (req, res) => {
    try {
      const currentUser = req.session["currentUser"];
      if (!currentUser) {
        res.sendStatus(401);
        return;
      }
      const enrollments = enrollmentsDao.findEnrollmentsForUser(currentUser._id);
      res.json(enrollments);
    } catch (err) {
      console.error("Error listing enrollments:", err);
      res.status(500).json({ error: "Server error" });
    }
  });

  // get the enrollment for current user + specific course via query param (legacy)
  app.get("/api/users/current/enrollments/course", (req, res) => {
    try {
      const currentUser = req.session["currentUser"];
      const { courseId } = req.query;
      if (!currentUser) {
        res.sendStatus(401);
        return;
      }
      if (!courseId || typeof courseId !== "string") {
        res.status(400).json({ error: "courseId query param required" });
        return;
      }
      const enrollment = enrollmentsDao.findEnrollmentForUserCourse(
        currentUser._id,
        courseId
      );
      if (!enrollment) {
        res.status(404).json({ error: "Enrollment not found" });
        return;
      }
      res.json(enrollment);
    } catch (err) {
      console.error("Error fetching enrollment by query:", err);
      res.status(500).json({ error: "Server error" });
    }
  });


  app.get("/api/users/current/enrollments/:courseId", (req, res) => {
    try {
      const currentUser = req.session["currentUser"];
      const { courseId } = req.params;
      if (!currentUser) {
        res.sendStatus(401);
        return;
      }
      if (!courseId) {
        res.status(400).json({ error: "courseId required in path" });
        return;
      }
      const enrollment = enrollmentsDao.findEnrollmentForUserCourse(
        currentUser._id,
        courseId
      );
      if (!enrollment) {
        res.status(404).json({ error: "Enrollment not found" });
        return;
      }
      res.json(enrollment);
    } catch (err) {
      console.error("Error fetching enrollment by param:", err);
      res.status(500).json({ error: "Server error" });
    }
  });

  app.post("/api/users/current/enrollments", (req, res) => {
    try {
      const currentUser = req.session["currentUser"];
      const { courseId } = req.body;
      if (!currentUser) {
        res.sendStatus(401);
        return;
      }
      if (!courseId) {
        res.status(400).json({ error: "courseId required" });
        return;
      }
      const enrollment = enrollmentsDao.enrollUserInCourse(
        currentUser._id,
        courseId
      );
      if (enrollment === null) {
        // already enrolled
        res.status(200).json({ message: "already enrolled" });
        return;
      }
      res.status(201).json(enrollment);
    } catch (err) {
      console.error("Error enrolling user:", err);
      res.status(500).json({ error: "Server error" });
    }
  });

  app.delete("/api/users/current/enrollments/:enrollmentId", (req, res) => {
    try {
      const currentUser = req.session["currentUser"];
      if (!currentUser) {
        res.sendStatus(401);
        return;
      }
      const { enrollmentId } = req.params;
      if (!enrollmentId) {
        res.status(400).json({ error: "enrollmentId required" });
        return;
      }

      const enrollment = enrollmentsDao
        .findEnrollmentsForUser(currentUser._id)
        .find((e) => e._id === enrollmentId);
      if (!enrollment) {
        res.sendStatus(404);
        return;
      }

      const success = enrollmentsDao.unenrollUserInCourse(enrollmentId);
      if (success) {
        res.sendStatus(204);
      } else {
        res.sendStatus(404);
      }
    } catch (err) {
      console.error("Error unenrolling user:", err);
      res.status(500).json({ error: "Server error" });
    }
  });
}

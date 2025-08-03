import * as dao from "./dao.js"; 
import * as courseDao from "../Courses/dao.js";
import * as enrollmentsDao from "../Enrollments/dao.js";

export default function UserRoutes(app) {
  //User here!!!
  const createUser = (req, res) => {
    const newUser = dao.createUser(req.body);
    req.session["currentUser"] = newUser;
    res.status(201).json(newUser);
  };

  const deleteUser = (req, res) => {
    const { userId } = req.params;
    dao.deleteUser(userId);
    res.sendStatus(204);
  };

  const findAllUsers = (req, res) => {
    const users = dao.findAllUsers();
    res.json(users);
  };

  const findUserById = (req, res) => {
    const { userId } = req.params;
    const user = dao.findUserById(userId);
    if (!user) {
      res.sendStatus(404);
      return;
    }
    res.json(user);
  };

  const updateUser = (req, res) => {
    const { userId } = req.params;
    const userUpdates = req.body;
    dao.updateUser(userId, userUpdates);
    const currentUser = dao.findUserById(userId);
    req.session["currentUser"] = currentUser;
    res.json(currentUser);
  };

  const profile = (req, res) => {
    const currentUser = req.session["currentUser"];
    if (!currentUser) {
      res.sendStatus(401);
      return;
    }
    res.json(currentUser);
  };

  const signup = (req, res) => {
    const existing = dao.findUserByUsername(req.body.username);
    if (existing) {
      res.status(400).json({ message: "Username already in use" });
      return;
    }
    const currentUser = dao.createUser(req.body);
    req.session["currentUser"] = currentUser;
    res.json(currentUser);
  };

  const signin = (req, res) => {
    const { username, password } = req.body;
    const currentUser = dao.findUserByCredentials(username, password);
    if (currentUser) {
      req.session["currentUser"] = currentUser;
      res.json(currentUser);
    } else {
      res.status(401).json({ message: "Unable to login. Try again later." });
    }
  };

  const signout = (req, res) => {
    req.session.destroy(() => {
      res.sendStatus(200);
    });
  };

  //Course !!!

  //
  const findCoursesForEnrolledUser = (req, res) => {
    let { userId } = req.params;
    if (userId === "current") {
      const currentUser = req.session["currentUser"];
      if (!currentUser) {
        res.sendStatus(401);
        return;
      }
      userId = currentUser._id;
    }
    const courses = courseDao.findCoursesForEnrolledUser(userId);
    res.json(courses);
  };
  app.get("/api/users/:userId/courses", findCoursesForEnrolledUser);

  // create a new course and enroll the creator
  const createCourse = (req, res) => {
    const currentUser = req.session["currentUser"];
    if (!currentUser) {
      res.sendStatus(401);
      return;
    }
    const newCourse = courseDao.createCourse(req.body);
    enrollmentsDao.enrollUserInCourse(currentUser._id, newCourse._id);
    res.status(201).json(newCourse);
  };
  app.post("/api/users/current/courses", createCourse);

  // enroll current user in existing course (body: { courseId })
  const enrollCurrentUser = (req, res) => {
    const currentUser = req.session["currentUser"];
    if (!currentUser) {
      res.sendStatus(401);
      return;
    }
    const { courseId } = req.body;
    if (!courseId) {
      res.status(400).json({ error: "courseId required" });
      return;
    }
    try {
      const enrollment = enrollmentsDao.enrollUserInCourse(
        currentUser._id,
        courseId
      );
      if (enrollment === null) {
        res.status(200).json({ message: "already enrolled" });
        return;
      }
      res.status(201).json(enrollment);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  };
  app.post("/api/users/current/enrollments", enrollCurrentUser);

const getEnrollmentForCourse = (req, res) => {
  const currentUser = req.session?.currentUser;
  if (!currentUser) {
    return res.sendStatus(401);
  }
  const { courseId } = req.params;
  const enrollment = enrollmentsDao.findEnrollmentForUserCourse(
    currentUser._id,
    courseId
  );
  if (!enrollment) {
    return res.sendStatus(404);
  }
  res.json(enrollment);
};
app.get("/api/users/current/enrollments/:courseId", getEnrollmentForCourse);


  // 
const getEnrollmentsForCurrentUser = (req, res) => {
  const currentUser = req.session?.currentUser;
  if (!currentUser) {
    return res.sendStatus(401);
  }
  const enrollments = enrollmentsDao.findEnrollmentsForUser(currentUser._id);
  res.json(enrollments);
};
app.get("/api/users/current/enrollments", getEnrollmentsForCurrentUser);

  // unenroll current user by enrollmentId
  const unenrollCurrentUser = (req, res) => {
    const currentUser = req.session["currentUser"];
    if (!currentUser) {
      res.sendStatus(401);
      return;
    }
    const { enrollmentId } = req.params;
    const success = enrollmentsDao.unenrollUserInCourse(enrollmentId);
    if (success) {
      res.sendStatus(204);
    } else {
      res.sendStatus(404);
    }
  };
  app.delete(
    "/api/users/current/enrollments/:enrollmentId",
    unenrollCurrentUser
  );

  // -------- register routes --------
  app.post("/api/users", createUser);
  app.get("/api/users", findAllUsers);
  app.get("/api/users/:userId", findUserById);
  app.put("/api/users/:userId", updateUser);
  app.delete("/api/users/:userId", deleteUser);
  app.post("/api/users/signup", signup);
  app.post("/api/users/signin", signin);
  app.post("/api/users/signout", signout);
  app.post("/api/users/profile", profile);
}

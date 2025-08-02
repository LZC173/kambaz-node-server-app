import express from 'express'
import Hello from "./Hello.js"
import Lab5 from "./lab5/index.js";
import cors from "cors";
import UserRoutes from "./Kambaz/Users/routes.js";
import CourseRoutes from "./Kambaz/Courses/routes.js";
import session from "express-session";
import "dotenv/config";
import ModuleRoutes from "./Kambaz/Modules/routes.js";
import EnrollmentRoutes from "./Kambaz/Enrollments/routes.js";
import AssignmentRoutes from "./Kambaz/Assignments/routes.js"; 
const app = express()
app.use(
  cors({
    credentials: true,
    origin: process.env.NETLIFY_URL || "http://localhost:5173",
  })
);

// support cookies
// restrict cross origin resource
// sharing to the react application
app.use(express.json());

const sessionOptions = {
  secret: process.env.SESSION_SECRET || "kambaz",
  resave: false,
  saveUninitialized: false,
};
if (process.env.NODE_ENV !== "development") {
  sessionOptions.proxy = true;
  sessionOptions.cookie = {
    sameSite: "none",
    secure: true,
    domain: process.env.NODE_SERVER_DOMAIN,
  };
}
app.use(session(sessionOptions));

// configure cors first
// configure server sessions after cors
// this is a default session configuration that works fine
// locally, but needs to be tweaked further to work in a
// remote server such as AWS, Render, or Heroku. See later
EnrollmentRoutes(app);
CourseRoutes(app);
ModuleRoutes(app);
AssignmentRoutes(app); 
UserRoutes(app);
Lab5(app)
Hello(app)
app.listen(process.env.PORT || 4000)
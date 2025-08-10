
import "dotenv/config";
import express from 'express'
import Hello from "./Hello.js"
import Lab5 from "./lab5/index.js";
import cors from "cors";
import UserRoutes from "./Kambaz/Users/routes.js";
import CourseRoutes from "./Kambaz/Courses/routes.js";
import ModuleRoutes from "./Kambaz/Modules/routes.js";
import session from "express-session";
import EnrollmentRoutes from "./Kambaz/Enrollments/routes.js";
import AssignmentRoutes from "./Kambaz/Assignments/routes.js"; 

import mongoose from "mongoose";
const CONNECTION_STRING = process.env.MONGO_CONNECTION_STRING || "mongodb://127.0.0.1:27017/kambaz"
mongoose.connect(CONNECTION_STRING);



(async () => {
  try {
    const masked = CONNECTION_STRING.replace(/\/\/([^:]+):[^@]+@/, "//$1:****@");
    console.log("Trying MongoDB:", masked);
    await mongoose.connect(CONNECTION_STRING, { serverSelectionTimeoutMS: 10000 });
    console.log("mongo connected:", { host: mongoose.connection.host, db: mongoose.connection.name });
  } catch (e) {
    console.error("Mongo connect error:", e.message);
  }
})();



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
  proxy: true,
  cookie: {
    secure: true, 
    sameSite: "none", 
    maxAge: 1000 * 60 * 60 * 24
  }
};
if (process.env.NODE_ENV !== "development") {
  sessionOptions.proxy = true;
  sessionOptions.cookie = {
    sameSite: "none",
    secure: true,
    domain: process.env.NODE_SERVER_DOMAIN,
    
  };
}
app.set("trust proxy", 1)
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
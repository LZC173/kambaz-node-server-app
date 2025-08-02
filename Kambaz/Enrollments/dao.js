import Database from "../Database/index.js";
import { v4 as uuidv4 } from "uuid";

/**
 * Enrolls a user in a course. If already enrolled, returns null.
 */
export function enrollUserInCourse(userId, courseId) {
  const { enrollments } = Database;
  const exists = enrollments.some(
    (e) => e.user === userId && e.course === courseId
  );
  if (exists) {
    return null;
  }
  const newEnrollment = { _id: uuidv4(), user: userId, course: courseId };
  enrollments.push(newEnrollment);
  return newEnrollment;
}

/**
 * removes an enrollment by its ID.
 */
export function unenrollUserInCourse(enrollmentId) {
  const { enrollments } = Database;
  const originalLength = enrollments.length;
  Database.enrollments = enrollments.filter((e) => e._id !== enrollmentId);
  return Database.enrollments.length !== originalLength;
}

/**
 * finds a single enrollment for a given user + course.
 */
export function findEnrollmentForUserCourse(userId, courseId) {
  const { enrollments } = Database;
  return (
    enrollments.find((e) => e.user === userId && e.course === courseId) || null
  );
}

/**
 * lists all enrollments for a user.
 */
export function findEnrollmentsForUser(userId) {
  const { enrollments } = Database;
  return enrollments.filter((e) => e.user === userId);
}

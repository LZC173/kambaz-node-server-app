import Database from "../Database/index.js";
import { v4 as uuidv4 } from "uuid";

export function findAssignmentsForCourse(courseId) {
  return Database.assignments.filter((a) => a.course === courseId);
}

export function findAssignmentById(assignmentId) {
  return Database.assignments.find((a) => a._id === assignmentId) ?? null;
}

export function createAssignment(assignment) {
  const newAssignment = { ...assignment, _id: uuidv4() };
  Database.assignments = [...Database.assignments, newAssignment];
  return newAssignment;
}

export function updateAssignment(assignmentId, assignmentUpdates) {
  const assignment = Database.assignments.find((a) => a._id === assignmentId);
  if (!assignment) return null;
  Object.assign(assignment, assignmentUpdates);
  return assignment;
}

export function deleteAssignment(assignmentId) {
  const { assignments } = Database;
  Database.assignments = assignments.filter((a) => a._id !== assignmentId);
}

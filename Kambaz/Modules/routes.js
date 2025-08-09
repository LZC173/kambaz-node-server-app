
import * as modulesDao from "../Modules/dao.js";
export default function ModuleRoutes(app) {
 app.get("/api/courses/:courseId/modules", async (req, res) => {
   const { courseId } = req.params;
   const modules = await modulesDao.findModulesForCourse(courseId);
   res.json(modules);
 });


  app.post("/api/courses/:courseId/modules", async (req, res) => {
   const { courseId } = req.params;
   const module = {
     ...req.body,
     course: courseId,
   };
   const newModule = await modulesDao.createModule(module);
   res.send(newModule);
 });

 
 app.put("/api/modules/:moduleId", async (req, res) => {
   const { moduleId } = req.params;
   const moduleUpdates = req.body;
   const status = await modulesDao.updateModule(moduleId, moduleUpdates);
   res.send(status);
 });


 app.delete("/api/modules/:moduleId", async (req, res) => {
   const { moduleId } = req.params;
   const status = await modulesDao.deleteModule(moduleId);
   res.send(status);
 });
}


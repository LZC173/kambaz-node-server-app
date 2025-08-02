import * as modulesDao from "./dao.js";
export default function ModuleRoutes(app) {
app.put("/api/modules/:moduleId", (req, res) => {
  const { moduleId } = req.params;
  const moduleUpdates = req.body;
  const updated = modulesDao.updateModule(moduleId, moduleUpdates);
  if (!updated) {
    return res.status(404).json({ error: "Module not found" });
  }
  res.sendStatus(204);
});

 app.delete("/api/modules/:moduleId", async (req, res) => {
   const { moduleId } = req.params;
   const status = await modulesDao.deleteModule(moduleId);
   res.send(status);
});}

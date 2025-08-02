const assignment = {
  id: 1, title: "NodeJS Assignment",
  description: "Create a NodeJS server with ExpressJS",
  due: "2021-10-10", completed: false, score: 0,
};

const module = {
  id: "123",
  name: "Web Dev Module",
  description: "Learn full-stack web development",
  course: "CS5610"
};
export default function WorkingWithObjects(app) {
  app.get("/lab5/assignment", (req, res) => {
    res.json(assignment);
  });
    app.get("/lab5/assignment/title", (req, res) => {
    res.json(assignment.title);
  });
    app.get("/lab5/assignment/title/:newTitle", (req, res) => {
    const { newTitle } = req.params;
    assignment.title = newTitle;
    res.json(assignment);
  });

    app.get("/lab5/module", (req, res) => {
    res.json(module);
    });

    app.get("/lab5/module/name", (req, res) => {
    res.json(module.name);
    });

    app.get("/lab5/module/name/:newName", (req, res) => {
    module.name = req.params.newName;
    res.json(module);
    });


    app.get("/lab5/module/description/:newDescription", (req, res) => {
    module.description = req.params.newDescription;
    res.json(module);
    });


    app.get("/lab5/assignment/score/:newScore", (req, res) => {
    assignment.score = parseInt(req.params.newScore);
    res.json(assignment);
    });


    app.get("/lab5/assignment/completed/:newStatus", (req, res) => {
    assignment.completed = req.params.newStatus === "true";
    res.json(assignment);
    });


};

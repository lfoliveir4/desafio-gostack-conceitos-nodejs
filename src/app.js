const express = require("express");
const cors = require("cors");
const { uuid } = require("uuidv4");

const LogRequest = require("./middleware/LogRequest");
const ValidateProjectId = require("./middleware/ValidateProjectId");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.use(LogRequest);

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    like: 0,
  };

  repositories.push(repository);

  return response.json(repository);
});

app.put("/repositories/:id", ValidateProjectId, (request, response) => {
  const { id } = request.params;
  const { title, url } = request.body;
  const repositorieIndex = repositories.findIndex(
    (repositorie) => repositorie.id === id
  );
  if (repositorieIndex === -1) {
    return response.status(400).json({ error: "Project not found" });
  }
  const repositorie = {
    id,
    title,
    url,
    techs,
    likes: repositories[repositorieIndex].like,
  };

  repositories[repositorieIndex] = repositorie;
  return response.json(repositorie);
});

app.delete("/repositories/:id", ValidateProjectId, (request, response) => {
  const { id } = request.params;
  const repositorieIndex = repositories.findIndex(
    (repositorie) => repositorie.id === id
  );
  if (repositorieIndex < 0) {
    return response.status(400).json({ error: "Project not found" });
  }
  repositories.splice(repositorieIndex, 1);
  return response.status(204).send();
});

app.post("/repositories/:id/like", ValidateProjectId, (request, response) => {
  const { id } = request.params;

  const repositorieIndex = repositories.findIndex(
    (repositorie) => repositorie.id === id
  );

  repositories[repositorieIndex].like++;

  return response.json(repositories[repositorieIndex]);
});

module.exports = app;

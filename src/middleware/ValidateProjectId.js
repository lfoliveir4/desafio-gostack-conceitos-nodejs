const { isUuid } = require("uuidv4");

export function ValidateProjectId(request, response, next) {
  const { id } = request.params;

  if (!isUuid(id)) {
    return response.status(400).json({ error: "Invalid Project id" });
  }

  return next();
}

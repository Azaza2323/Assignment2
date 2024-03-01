const express = require("express");
const authorsRouter = express.Router();
const { getAuthors, getAuthorById, updateAuthor, createAuthor, deleteAuthor, saveLog } = require("../controllers/authors");
const authenticateAndAuthorize = require("../middleware/auth");

  authorsRouter.get("/",authenticateAndAuthorize(['Manager', 'Admin', 'Reader']), getAuthors);
  authorsRouter.get("/:author_id",authenticateAndAuthorize(['Manager', 'Admin','Reader']), getAuthorById);
  authorsRouter.put("/:author_id",authenticateAndAuthorize(['Manager', 'Admin']), updateAuthor);
  authorsRouter.post("/create", authenticateAndAuthorize(['Manager', 'Admin']),createAuthor);
  authorsRouter.delete("/:author_id",  authenticateAndAuthorize(['Admin']),deleteAuthor);

module.exports= authorsRouter;
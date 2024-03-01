const express = require("express");
const genresRouter = express.Router();
const { getGenres, getGenreById, createGenre, deleteGenre, saveLog } = require("../controllers/genres");
const authenticateAndAuthorize = require("../middleware/auth");

  genresRouter.get("/", authenticateAndAuthorize(['Manager', 'Admin', 'Reader']),getGenres);
  genresRouter.get("/:genre_id", authenticateAndAuthorize(['Manager', 'Admin', 'Reader']),getGenreById);
  genresRouter.post("/create", authenticateAndAuthorize(['Manager', 'Admin']),createGenre);
  genresRouter.delete("/:genre_id", authenticateAndAuthorize(['Manager']),deleteGenre);
module.exports= genresRouter;

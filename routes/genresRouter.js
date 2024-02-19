const express = require("express");
const genresRouter = express.Router();
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
module.exports = function(logger) {
  genresRouter.get("/", async (req, res) => {
    try {
      const genres = await prisma.genres.findMany();
      logger.info("infoMessage", { route: `${req.method} ${req.path}`, ip: req.ip });
      res.json(genres);
    } catch (error) {
      logger.error("Error fetching", { route: `${req.method} ${req.path}`, ip: req.ip });
      res.status(500).json({error: "Could not fetch genres"});
    }
  });

  genresRouter.get("/:genre_id", async (req, res) => {
    try {
      const genre_id = req.params.genre_id;
      logger.info("infoMessage", { route: `${req.method} ${req.path}`, ip: req.ip });
      const genre = await prisma.genres.findUnique({
        where: {genre_id: genre_id},
      });
      res.json(genre);
    } catch (error) {
      logger.error("Error fetching", { route: `${req.method} ${req.path}`, ip: req.ip });
      res.status(500).json({error: "Could not fetch genre"});
    }
  });

  genresRouter.post("/create", async (req, res) => {
    try {
      const {genre_name} = req.body;
      logger.info("infoMessage", { route: `${req.method} ${req.path}`, ip: req.ip });
      const result = await prisma.genres.create({
        data: {
          genre_name,
        },
      });
      res.json(result);
    } catch (error) {
      logger.error("Error fetching", { route: `${req.method} ${req.path}`, ip: req.ip });
      res.status(500).json({error: "Could not create genre"});
    }
  });

  genresRouter.delete("/:genre_id", async (req, res) => {
    try {
      const {genre_id} = req.params;
      logger.info("infoMessage", { route: `${req.method} ${req.path}`, ip: req.ip });
      const genre = await prisma.genres.delete({
        where: {
          genre_id: genre_id,
        },
      });
      res.json(genre);
    } catch (error) {
      logger.error("Error fetching", { route: `${req.method} ${req.path}`, ip: req.ip });
      res.status(500).json({error: "Could not delete genre"});
    }
  });

  return  genresRouter;
}
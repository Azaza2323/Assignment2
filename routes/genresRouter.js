const express = require("express");
const genresRouter = express.Router();
const { PrismaClient } = require("@prisma/client");
const {saveLog}=require("../scylla.js")
const prisma = new PrismaClient();
module.exports = function(logger) {
  genresRouter.get("/", async (req, res) => {
    try {
      const genres = await prisma.genres.findMany();
      await saveLog(req.ip,'info','infoMessage',`${req.method} ${req.baseUrl} ${req.path}`);
      logger.info("infoMessage", { route: `${req.method} ${req.baseUrl} ${req.path}`, ip: req.ip });
      res.json(genres);
    } catch (error) {
      console.log(error)
      await saveLog(req.ip,'error','errorMessage',`${req.method} ${req.baseUrl} ${req.path}`);
      logger.error("Error fetching", { route: `${req.method} ${req.baseUrl}`, ip: req.ip });
      res.status(500).json({error: "Could not fetch genres"});
    }
  });

  genresRouter.get("/:genre_id", async (req, res) => {
    try {
      const genre_id = req.params.genre_id;
      await saveLog(req.ip,'info','infoMessage',`${req.method} ${req.baseUrl} ${req.path}`);
      const genre = await prisma.genres.findUnique({
        where: {genre_id: genre_id},
      });
      res.json(genre);
      logger.info("infoMessage", { route: `${req.method} ${req.baseUrl} ${req.path}`, ip: req.ip });
    } catch (error) {
      console.log(error)
      await saveLog(req.ip,'error','errorMessage',`${req.method} ${req.baseUrl} ${req.path}`);
      logger.error("Error fetching", { route: `${req.method} ${req.baseUrl} ${req.path}`, ip: req.ip });
      res.status(500).json({error: "Could not fetch genre"});
    }
  });

  genresRouter.post("/create", async (req, res) => {
    try {
      const {genre_name} = req.body;
      logger.info("infoMessage", { route: `${req.method} ${req.baseUrl} ${req.path}`, ip: req.ip });
      await saveLog(req.ip,'info','infoMessage',`${req.method} ${req.baseUrl} ${req.path}`);
      const result = await prisma.genres.create({
        data: {
          genre_name,
        },
      });
      res.json(result);
    } catch (error) {
      console.log(error)
      await saveLog(req.ip,'error','errorMessage',`${req.method} ${req.baseUrl} ${req.path}`);
      logger.error("Error fetching", { route: `${req.method} ${req.baseUrl} ${req.path}`, ip: req.ip });
      res.status(500).json({error: "Could not create genre"});
    }
  });

  genresRouter.delete("/:genre_id", async (req, res) => {
    try {
      const {genre_id} = req.params;
      logger.info("infoMessage", { route: `${req.method} ${req.baseUrl} ${req.path}`, ip: req.ip });
      await saveLog(req.ip,'info','infoMessage',`${req.method} ${req.baseUrl} ${req.path}`);
      const genre = await prisma.genres.delete({
        where: {
          genre_id: genre_id,
        },
      });
      res.json(genre);
    } catch (error) {
      console.log(error)
      await saveLog(req.ip,'error','errorMessage',`${req.method} ${req.baseUrl} ${req.path}`);
      logger.error("Error fetching", { route: `${req.method} ${req.baseUrl} ${req.path}`, ip: req.ip });
      res.status(500).json({error: "Could not delete genre"});
    }
  });

  return  genresRouter;
}
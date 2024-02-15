const express = require("express");
const authorsRouter = express.Router();
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

authorsRouter.get("/", async (req, res) => {
  try {
    const authors = await prisma.authors.findMany();
    res.json(authors);
  } catch (error) {
    console.error("Error fetching authors:", error);
    res.status(500).json({ error: "Could not fetch authors" });
  }
});
authorsRouter.get("/:author_id", async (req, res) => {
  try {
    const author_id = req.params.author_id;
    const author = await prisma.authors.findUnique({
      where: { author_id: author_id },
    });
    res.json(author);
  } catch (error) {
    console.error("Error fetching author:", error);
    res.status(500).json({ error: "Could not fetch author" });
  }
});

authorsRouter.put("/:author_id", async (req, res) => {
  try {
    const authorId = req.params.author_id;
    const { name, surname, birthday } = req.body;

    if (!name && !surname && !birthday) {
      return res.status(400).json({
        error:
          "At least one field (name, surname, or birthday) must be provided for update.",
      });
    }
    const updateData = {};
    if (name) updateData.name = name;
    if (surname) updateData.surname = surname;
    if (birthday) updateData.birthday = new Date(birthday);

    const updatedAuthor = await prisma.authors.update({
      where: { author_id: authorId },
      data: updateData,
    });

    res.json(updatedAuthor);
  } catch (error) {
    console.error("Error updating author:", error);
    res.status(500).json({ error: "Could not update author" });
  }
});

authorsRouter.post("/create", async (req, res) => {
  try {
    const { name, surname, birthday } = req.body;
    const authorData = {
      name,
      surname,
      birthday: birthday ? new Date(birthday) : new Date().toISOString(),
    };

    const result = await prisma.authors.create({
      data: authorData,
    });

    res.json(result);
  } catch (error) {
    console.error("Error creating author:", error);
    res.status(500).json({ error: "Could not create author" });
  }
});

authorsRouter.delete("/:author_id", async (req, res) => {
  try {
    const { author_id } = req.params;
    const author = await prisma.authors.delete({
      where: {
        author_id: author_id,
      },
    });
    res.json(author);
  } catch (error) {
    console.error("Error deleting author:", error);
    res.status(500).json({ error: "Could not delete author" });
  }
});

module.exports = authorsRouter;

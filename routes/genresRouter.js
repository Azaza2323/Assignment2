const express = require('express');
const genresRouter = express.Router();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

genresRouter.get('/', async (req, res) => {
    try {
        const genres = await prisma.genres.findMany();
        res.json(genres);
    } catch (error) {
        console.error("Error fetching genres:", error);
        res.status(500).json({ error: "Could not fetch genres" });
    }
});

genresRouter.get('/:genre_id', async (req, res) => {
    try {
        const genre_id = parseInt(req.params.genre_id);
        const genre = await prisma.genres.findUnique({
            where: { genre_id: genre_id },
        });
        res.json(genre);
    } catch (error) {
        console.error("Error fetching genre:", error);
        res.status(500).json({ error: "Could not fetch genre" });
    }
});

genresRouter.post('/create', async (req, res) => {
    try {
        const { genre_name } = req.body;
        const result = await prisma.genres.create({
            data: {
                genre_name,
            },
        });
        res.json(result);
    } catch (error) {
        console.error("Error creating genre:", error);
        res.status(500).json({ error: "Could not create genre" });
    }
});

genresRouter.delete('/:genre_id', async (req, res) => {
    try {
        const { genre_id } = req.params;
        const genre = await prisma.genres.delete({
            where: {
                genre_id: Number(genre_id),
            },
        });
        res.json(genre);
    } catch (error) {
        console.error("Error deleting genre:", error);
        res.status(500).json({ error: "Could not delete genre" });
    }
});

module.exports = genresRouter;

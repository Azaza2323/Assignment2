const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { saveLog } = require("../scylla.js");

const getGenres = async (req, res) => {
    try {
        const genres = await prisma.genres.findMany();
        await saveLog(req.ip, 'info', 'infoMessage', `${req.method} ${req.baseUrl} ${req.path}`);
        res.json(genres);
    } catch (error) {
        console.error(error);
        // await saveLog(req.ip, 'error', 'errorMessage', `${req.method} ${req.baseUrl} ${req.path}`);
        res.status(500).json({ error: "Could not fetch genres" });
    }
};

const getGenreById = async (req, res) => {
    try {
        const genre_id = req.params.genre_id;
        await saveLog(req.ip, 'info', 'infoMessage', `${req.method} ${req.baseUrl} ${req.path}`);
        const genre = await prisma.genres.findUnique({
            where: { genre_id: genre_id },
        });
        res.json(genre);
    } catch (error) {
        console.error(error);
        // await saveLog(req.ip, 'error', 'errorMessage', `${req.method} ${req.baseUrl} ${req.path}`);
        res.status(500).json({ error: "Could not fetch genre" });
    }
};

const createGenre = async (req, res) => {
    try {
        const { genre_name } = req.body;
        await saveLog(req.ip, 'info', 'infoMessage', `${req.method} ${req.baseUrl} ${req.path}`);
        const result = await prisma.genres.create({
            data: {
                genre_name,
            },
        });
        res.json(result);
    } catch (error) {
        console.error(error);
        // await saveLog(req.ip, 'error', 'errorMessage', `${req.method} ${req.baseUrl} ${req.path}`);
        res.status(500).json({ error: "Could not create genre" });
    }
};

const deleteGenre = async (req, res) => {
    try {
        const { genre_id } = req.params;
        await saveLog(req.ip, 'info', 'infoMessage', `${req.method} ${req.baseUrl} ${req.path}`);
        const genre = await prisma.genres.delete({
            where: {
                genre_id: genre_id,
            },
        });
        res.json(genre);
    } catch (error) {
        console.error(error);
        // await saveLog(req.ip, 'error', 'errorMessage', `${req.method} ${req.baseUrl} ${req.path}`);
        res.status(500).json({ error: "Could not delete genre" });
    }
};

module.exports = { getGenres, getGenreById, createGenre, deleteGenre, saveLog };

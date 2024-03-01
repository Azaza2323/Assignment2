const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { saveLog } = require("../scylla.js");

const getAuthors = async (req, res) => {
    try {
        const authors = await prisma.authors.findMany();
        res.json(authors);
        // await saveLog(req.ip, 'info', 'infoMessage', `${req.method} ${req.baseUrl} ${req.path}`);
    } catch (error) {
        console.error(error);
        // await saveLog(req.ip, 'error', 'errorMessage', `${req.method} ${req.baseUrl} ${req.path}`);
        res.status(500).json({ error: "Could not fetch authors" });
    }
};

const getAuthorById = async (req, res) => {
    try {
        const author_id = req.params.author_id;
        const author = await prisma.authors.findUnique({
            where: { author_id: author_id },
        });
        res.json(author);
        // await saveLog(req.ip, 'info', 'infoMessage', `${req.method} ${req.baseUrl} ${req.path}`);
    } catch (error) {
        console.error(error);
        // await saveLog(req.ip, 'error', 'errorMessage', `${req.method} ${req.baseUrl} ${req.path}`);
        res.status(500).json({ error: "Could not fetch author" });
    }
};

const updateAuthor = async (req, res) => {
    try {
        const authorId = req.params.author_id;
        const { name, surname, birthday } = req.body;

        if (!name && !surname && !birthday) {
            return res.status(400).json({
                error: "At least one field (name, surname, or birthday) must be provided for update.",
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
        // await saveLog(req.ip, 'info', 'infoMessage', `${req.method} ${req.baseUrl} ${req.path}`);
    } catch (error) {
        console.error(error);
        // await saveLog(req.ip, 'error', 'errorMessage', `${req.method} ${req.baseUrl} ${req.path}`);
        res.status(500).json({ error: "Could not update author" });
    }
};

const createAuthor = async (req, res) => {
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
        // await saveLog(req.ip, 'info', 'infoMessage', `${req.method} ${req.baseUrl} ${req.path}`);
    } catch (error) {
        console.error(error);
        // await saveLog(req.ip, 'error', 'errorMessage', `${req.method} ${req.baseUrl} ${req.path}`);
        res.status(500).json({ error: "Could not create author" });
    }
};

const deleteAuthor = async (req, res) => {
    try {
        const { author_id } = req.params;
        const author = await prisma.authors.delete({
            where: {
                author_id: author_id,
            },
        });
        res.json(author);
        // await saveLog(req.ip, 'info', 'infoMessage', `${req.method} ${req.baseUrl} ${req.path}`);
    } catch (error) {
        console.error(error);
        // await saveLog(req.ip, 'error', 'errorMessage', `${req.method} ${req.baseUrl} ${req.path}`);
        res.status(500).json({ error: "Could not delete author" });
    }
};

module.exports = { getAuthors, getAuthorById, updateAuthor, createAuthor, deleteAuthor, saveLog };

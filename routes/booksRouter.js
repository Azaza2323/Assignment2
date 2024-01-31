const express = require('express');
const booksRouter = express.Router();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

booksRouter.get('/', async (req, res) => {
    try {
        const books = await prisma.books.findMany();
        res.json(books);
    } catch (error) {
        console.error("Error fetching books:", error);
        res.status(500).json({ error: "Could not fetch books" });
    }
});

booksRouter.get('/:book_id', async (req, res) => {
    try {
        const book_id = parseInt(req.params.book_id);
        const book = await prisma.books.findUnique({
            where: { book_id: book_id },
        });
        res.json(book);
    } catch (error) {
        console.error("Error fetching book:", error);
        res.status(500).json({ error: "Could not fetch book" });
    }
});

booksRouter.put('/:book_id', async (req, res) => {
    try {
        const bookId = parseInt(req.params.book_id);
        const { title, publish_year, page_count, price } = req.body;

        if (!title && !publish_year && !page_count && !price) {
            return res.status(400).json({ error: "At least one field (title, publish_year, page_count, or price) must be provided for update." });
        }

        const updateData = {};
        if (title) updateData.title = title;
        if (publish_year) updateData.publish_year = new Date(publish_year);
        if (page_count) updateData.page_count = page_count;
        if (price) updateData.price = price;

        const updatedBook = await prisma.books.update({
            where: { book_id: bookId },
            data: updateData,
        });

        res.json(updatedBook);
    } catch (error) {
        console.error("Error updating book:", error);
        res.status(500).json({ error: "Could not update book" });
    }
});

booksRouter.post('/create', async (req, res) => {
    try {
        const { title, publish_year, page_count, price } = req.body;
        const result = await prisma.books.create({
            data: {
                title,
                publish_year: new Date(publish_year),
                page_count,
                price,
            },
        });
        res.json(result);
    } catch (error) {
        console.error("Error creating book:", error);
        res.status(500).json({ error: "Could not create book" });
    }
});

booksRouter.delete('/:book_id', async (req, res) => {
    try {
        const { book_id } = req.params;
        const book = await prisma.books.delete({
            where: {
                book_id: Number(book_id),
            },
        });
        res.json(book);
    } catch (error) {
        console.error("Error deleting book:", error);
        res.status(500).json({ error: "Could not delete book" });
    }
});

module.exports = booksRouter;

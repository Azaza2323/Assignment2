const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const nodemailer = require("nodemailer");
const { saveLog } = require("../scylla.js");

const getBooks = async (req, res) => {
    try {
        const books = await prisma.books.findMany();
        // await saveLog(req.ip, 'info', 'infoMessage', `${req.method} ${req.baseUrl} ${req.path}`);
        res.json(books);
    } catch (error) {
        console.error(error);
        // await saveLog(req.ip, 'error', 'errorMessage', `${req.method} ${req.baseUrl} ${req.path}`);
        res.status(500).json({ error: "Could not fetch books" });
    }
};

const getBookById = async (req, res) => {
    try {
        const book_id = req.params.book_id;
        // await saveLog(req.ip, 'info', 'infoMessage', `${req.method} ${req.baseUrl} ${req.path}`);
        const book = await prisma.books.findUnique({
            where: { book_id: book_id },
        });
        res.json(book);
    } catch (error) {
        console.error(error);
        // await saveLog(req.ip, 'error', 'errorMessage', `${req.method} ${req.baseUrl} ${req.path}`);
        res.status(500).json({ error: "Could not fetch book" });
    }
};

const updateBook = async (req, res) => {
    try {
        const bookId = req.params.book_id;
        await saveLog(req.ip, 'info', 'infoMessage', `${req.method} ${req.baseUrl} ${req.path}`);
        const { title, publish_year, page_count, price } = req.body;

        if (!title && !publish_year && !page_count && !price) {
            return res.status(400).json({
                error: "At least one field (title, publish_year, page_count, or price) must be provided for update.",
            });
        }

        const updateData = {};
        if (title) updateData.title = title;
        if (publish_year) updateData.publish_year = publish_year;
        if (page_count) updateData.page_count = page_count;
        if (price) updateData.price = price;

        const updatedBook = await prisma.books.update({
            where: { book_id: bookId },
            data: updateData,
        });

        res.json(updatedBook);
    } catch (error) {
        console.error(error);
        // await saveLog(req.ip, 'error', 'errorMessage', `${req.method} ${req.baseUrl} ${req.path}`);
        res.status(500).json({ error: "Could not update book" });
    }
};

const createBook = async (req, res) => {
    try {
        const mailTransporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_PASS,
            },
        });

        const { title, publish_year, page_count, price } = req.body;
        await saveLog(req.ip, 'info', 'infoMessage', `${req.method} ${req.baseUrl} ${req.path}`);
        const result = await prisma.books.create({
            data: {
                title: title,
                publish_year: publish_year,
                page_count: page_count,
                price: price,
            },
        });

        const emailBody = `Book details:\nTitle: ${title}\nPublish Year: ${publish_year}\nPage Count: ${page_count}\nPrice: ${price}`;

        const mailDetails = {
            from: process.env.EMAIL,
            to: req.body.to,
            subject: "Book Created Successfully",
            text: emailBody,
        };

        mailTransporter.sendMail(mailDetails, (err, data) => {
            if (err) {
                console.error("Error sending email:", err);
            } else {
                console.log("Email sent successfully");
            }
        });

        res.json({ message: "Book created successfully", book: result });
    } catch (error) {
        console.error(error);
        // await saveLog(req.ip, 'error', 'errorMessage', `${req.method} ${req.baseUrl} ${req.path}`);
        res.status(500).json({ error: "Could not create book" });
    }
};

const deleteBook = async (req, res) => {
    try {
        const { book_id } = req.params;
        // await saveLog(req.ip, 'info', 'infoMessage', `${req.method} ${req.baseUrl} ${req.path}`);
        const book = await prisma.books.delete({
            where: {
                book_id: book_id,
            },
        });
        res.json(book);
    } catch (error) {
        console.error(error);
        // await saveLog(req.ip, 'error', 'errorMessage', `${req.method} ${req.baseUrl} ${req.path}`);
        res.status(500).json({ error: "Could not delete book" });
    }
};

module.exports = { getBooks, getBookById, updateBook, createBook, deleteBook, saveLog };

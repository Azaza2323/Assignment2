const express = require("express");
const app = express();
const port = 3000;
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const authorsRouter = require("./routes/authorsRouter");
const genresRouter = require("./routes/genresRouter");
const azamatRouter = require("./routes/booksRouter");
app.use(express.json());

app.use("/authors", authorsRouter);
app.use("/genres", genresRouter);
app.use("/books", azamatRouter);

app.get("/author/:id/books", async (req, res) => {
  const authorId = parseInt(req.params.id);

  try {
    const authorBooks = await prisma.$queryRaw`
      SELECT books.*, authors.*
      FROM books
      LEFT JOIN author_book ON books.book_id = author_book.book_id
      LEFT JOIN authors ON author_book.author_id = authors.author_id
      WHERE author_book.author_id = ${authorId};
    `;

    res.json(authorBooks);
  } catch (error) {
    console.error("Error fetching books by author:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/genre/:id/books", async (req, res) => {
  const genreId = parseInt(req.params.id);

  try {
    const genreBooks = await prisma.$queryRaw`
      SELECT books.*, genres.*
      FROM books
      LEFT JOIN book_genre ON books.book_id = book_genre.book_id
      LEFT JOIN genres ON book_genre.genre_id = genres.genre_id
      WHERE book_genre.genre_id = ${genreId};
    `;
    res.json(genreBooks);
  } catch (error) {
    console.error("Error fetching books by genre:", error);
    res.status(500).send("Internal Server Error");
  }
});
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

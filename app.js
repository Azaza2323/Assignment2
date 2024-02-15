const express = require("express");
const app = express();
const port = 3000;
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const authorsRouter = require("./routes/authorsRouter");
const genresRouter = require("./routes/genresRouter");
const booksRouter = require("./routes/booksRouter");
app.use(express.json());

app.use("/authors", authorsRouter);
app.use("/genres", genresRouter);
app.use("/books", booksRouter);
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

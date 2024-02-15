const express = require("express");
const app = express();
const authorsRouter = require("./routes/authorsRouter");
const genresRouter = require("./routes/genresRouter");
const booksRouter = require("./routes/booksRouter");
app.use(express.json());
const port = process.env.PORT;
app.use("/authors", authorsRouter);
app.use("/genres", genresRouter);
app.use("/books", booksRouter);
app.get("/", (req, res) => {
  res.json("Hello Page");
});
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

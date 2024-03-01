const express = require("express");
const app = express();
const port = 3000;
const swaggerUi = require("swagger-ui-express"), swaggerDocument = require("./swagger.json");
const authorsRouter = require("./routes/authorsRouter")
const genresRouter = require("./routes/genresRouter")
const booksRouter = require("./routes/booksRouter")
const authRouter = require("./routes/authRouter");
app.use(express.json());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use("/authors", authorsRouter);
app.use("/genres", genresRouter);
app.use("/books", booksRouter);
app.use("/auth",authRouter);

app.get("/", (req, res) => {
    res.json("Hello Page");
});


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
const express = require("express");
const app = express();
const winston = require("winston");

const port = process.env.PORT;

const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUI = require("swagger-ui-express");

const { combine, timestamp, json } = winston.format;
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: combine(
    timestamp({
      format: "YYYY-MM-DD hh:mm:ss.SSS A",
    }),
    json(),
    winston.format.simple(),
    winston.format.printf((info) => {
      const ip = info.ip.startsWith("::ffff:") ? info.ip.slice(7) : info.ip;
      return `${info.timestamp} [${info.level}] ${info.message} - ${info.route} - ${ip}`;
    }),
  ),
  transports: [
    new winston.transports.File({
      filename: "combined.log",
    }),
  ],
});

const options = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Node Js Api Project",
      version: "1.0.0",
      description: "API для работы с книгами и авторами",
      contact: {
        name: "Ваше имя",
        email: "ваш email",
      },
      license: {
        name: "Лицензия",
        url: "ссылка на лицензию",
      },
    },
    servers: [
      {
        url: `http://localhost:${port}/`,
        description: "Development server",
      },
      {
        url: "https://production-url.com/",
        description: "Production server",
      },
    ],
  },
  apis: ["./routes/*.js"],
};

const swaggerSpec = swaggerJSDoc(options);
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerSpec));

const authorsRouter = require("./routes/authorsRouter")(logger);
const genresRouter = require("./routes/genresRouter")(logger);
const booksRouter = require("./routes/booksRouter")(logger);
app.use(express.json());
app.use("/authors", authorsRouter);
app.use("/genres", genresRouter);
app.use("/books", booksRouter);
app.get("/", (req, res) => {
  res.json("Hello Page");
});
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

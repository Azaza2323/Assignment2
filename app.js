const express = require("express");
const app = express();
const winston = require("winston");

const port = process.env.PORT;

const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const { version } = require("../../package.json");
const log = require("./logger");


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
  definition: {
    openapi: "3.0.0",
    info: {
      title: 'Rest Api Docs',
      version
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      }
    ]
  },
  apis: ["./src/routes.js", "./src/schema/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);

function swaggerDocs(app, port) {
  // Swagger page
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  // Docs in JSON format
  app.get('/docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });

  log.info(`Docs available at http://localhost:${port}/docs`);
}

module.exports = swaggerDocs;

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

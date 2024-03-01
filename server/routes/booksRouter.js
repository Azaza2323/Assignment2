const express = require("express");
const booksRouter = express.Router();
const { getBooks, getBookById, updateBook, createBook, deleteBook, saveLog } = require("../controllers/books");
const authenticateAndAuthorize = require("../middleware/auth");

  booksRouter.get("/",authenticateAndAuthorize(['Manager', 'Admin', 'Reader']),getBooks);
  booksRouter.get("/:book_id", authenticateAndAuthorize(['Manager', 'Admin', 'Reader']),getBookById);
  booksRouter.put("/:book_id", authenticateAndAuthorize(['Manager', 'Admin']),updateBook);
  booksRouter.post("/create", authenticateAndAuthorize(['Manager', 'Admin']),createBook);
  booksRouter.delete("/:book_id",authenticateAndAuthorize(['Manager']), deleteBook);
module.exports=booksRouter;
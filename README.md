# REST API Example

This example shows how to implement a **REST API** using [Express](https://expressjs.com/) and [Prisma Client](https://www.prisma.io/docs/concepts/components/prisma-client). 

## Getting started

### 1.Install npm dependencies

```
npm install express dontenv nodemailer body-parser
```

Clone this repository:

```
git clone https://github.com/Azaza2323/assignment2/new/master
```


### 2. Create and seed the database

Run the following command to create your SQLite database file. This also creates 5 tables that are defined in [`prisma/schema.prisma`](./prisma/schema.prisma):

```
npx prisma migrate dev --name init
```
The database consits of dummy data: `500` authors,`3000` books and `8` genres
### 3. Start the REST API server

```
node app.js
```

The server is now running on `http://localhost:3000`.

## Using the REST API

You can access the REST API of the server using the following endpoints:

### `GET`
- `/books/:id`: Fetch a single book by its `id`
- `/books`: Fetch a entire books
- `/authors/:id`: Fetch a single author by its `id`
- `/author`: Fetch a entire authors
- `/genres/:id`: Fetch a single genres by its `id`
- `/genres`: Fetch a entire genres

## `with LEFT JOIN`
- `/authors/:id/books`: Fetch a single author by his books using `id`
- `/genres/:id/books`: Fetch a single genre by books using `id`
### `POST`

- `/create`: Create a new author , book or genre
for `/books/create`:
 - Body:
    - `title: String` (required): The title of book
    - `publish_year: String` (optional)
    - `price: Int` (required): The price of a book
    - `to:{email}`:Sends to an email a message that new books was created 

### `PUT`

- `/books||genres||authors/:id`: Update a books,genres or authors.
### `DELETE`

- `/books||genres||authors/:id`: Delete a books,genres or authors by its `id`


### Data Model

```diff
// ./prisma/schema.prisma

model authors {
  author_id  Int          @id @default(autoincrement())
  name       String?
  surname    String?
  birthday   DateTime?
}

model books{
  book_id      Int          @id @default(autoincrement())
  title        String?
  publish_year DateTime?
  page_count   Int?
  price        Float?
}

model genres {
  genre_id   Int         @id @default(autoincrement())
  genre_name String?

}
```

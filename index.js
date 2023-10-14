require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
var bodyParser = require("body-parser");
//database
const database = require("./database/database");
const BookModel = require("./database/book");
const AuthorModel = require("./database/author")
const PublicationModel = require("./database/publication")


//initialize express
const twinks = express();

twinks.use(bodyParser.urlencoded({extended: true}));
twinks.use(bodyParser.json());
mongoose.connect(process.env.MONGO_URL)
.then( () => console.log("Connection is established.") );

/*
Route          /
Description    To get all the books
Access         PUBLIC
Parameters     NONE
Methods        GET
*/
twinks.get("/", async (req,res) => {
    const getAllBooks = await BookModel.find();
    return res.json(getAllBooks);
})
/*
Route          /is
Description    To get specific book
Access         PUBLIC
Parameters     ISBN
Methods        GET
*/
twinks.get("/is/:isbn",async (req,res) => {
    const getSpecificBook = await BookModel.findOne({ISBN: req.params.isbn});

    if(!getSpecificBook){
        return res.json({error: `No book found for the ISBN ${req.params.isbn}`});
    }
    return res.json({book: getSpecificBook});
})
/*
Route          /c
Description    To get specific book based on category
Access         PUBLIC
Parameters     category
Methods        GET
*/
twinks.get("/c/:category", async (req,res) => {
    const getSpecificBook = await BookModel.findOne({category: req.params.category});

    if(!getSpecificBook){
        return res.json({error: `No book found for the category ${req.params.category}`});
    }
    return res.json({book: getSpecificBook});
})
/*
Route          /l
Description    To get specific book based on language
Access         PUBLIC
Parameters     language
Methods        GET
*/
twinks.get("/l/:language",async (req,res) => {
    const getSpecificBook = await BookModel.findOne({language: req.params.language});

    if(!getSpecificBook){
        return res.json({error: `No book found in the language ${req.params.language}`});
    }
    return res.json({book: getSpecificBook});
})
/*
Route          /author
Description    To get all authors
Access         PUBLIC
Parameters     NONE
Methods        GET
*/
twinks.get("/author" ,async (req,res) => {
    const getAllAuthors = await AuthorModel.find();
    return res.json(getAllAuthors);
})
/*
Route          /author/id
Description    To get specific author
Access         PUBLIC
Parameters     ID
Methods        GET
*/
twinks.get("/author/id/:id",async (req,res) => {
    const getSpecificAuthor = await AuthorModel.findOne({id: req.params.id});

    if(!getSpecificAuthor){
        return res.json({error: `No author exists for the id ${req.params.id}`});
    }
    return res.json({author: getSpecificAuthor});
})
/*
Route          /author/book
Description    To get specific author based on books
Access         PUBLIC
Parameters     books
Methods        GET
*/
twinks.get("/author/book/:isbn",async (req,res) => {
    const getSpecificAuthor = await AuthorModel.findOne({books: req.params.isbn});

    if(!getSpecificAuthor){
        return res.json({error: `No author is found for the book ${req.params.isbn}`});
    }
    return res.json({author: getSpecificAuthor});
})
/*
Route          /publ
Description    To get all publications
Access         PUBLIC
Parameters     NONE
Methods        GET
*/
twinks.get("/publ",async (req,res) => {
    const getAllPublications = await PublicationModel.find();
    return res.json(getAllPublications);
})
/*
Route          /publ/id
Description    To get specific publication
Access         PUBLIC
Parameters     ID
Methods        GET
*/
twinks.get("/publ/id/:id" ,async (req,res) => {
    const getSpecificPublication = await PublicationModel.findOne({id: req.params.id});

    if(!getSpecificPublication){
        return res.json({error: `No publication is found with id ${req.params.id}`});
    }
    return res.json({publication: getSpecificPublication})
})
/*
Route          /publ/books
Description    To get specific publication based on books
Access         PUBLIC
Parameters     books
Methods        GET
*/
twinks.get("/publ/books/:isbn" ,async (req,res) => {
    const getSpecificPublication = await PublicationModel.findOne({books: req.params.isbn});

    if(!getSpecificPublication){
        return res.json({error: `No publication is found for the book of ${req.params.isbn}`});
    }
    return res.json({publication: getSpecificPublication})
})

//POST 

/*
Route          /book/new
Description    To add new books
Access         PUBLIC
Parameters     NONE
Methods        POST
*/
twinks.post("/book/new",async (req,res) => {
    const {newBook} = req.body;
    const addNewBook = BookModel.create(newBook);
    return res.json({
        books: addNewBook,
        message: "Added the book"
    })
})

/*
Route          /author/new
Description    To add new author
Access         PUBLIC
Parameters     NONE
Methods        POST
*/
twinks.post("/author/new",async (req,res) => {
    const {newAuthor} = req.body;
    const addNewAuthor = AuthorModel.create(newAuthor);
    return res.json({
        author: addNewAuthor,
        message: "Author is added"
    });
})

/*
Route          /publ/new
Description    To add new publication
Access         PUBLIC
Parameters     NONE
Methods        POST
*/
twinks.post("/publ/new" ,async (req,res) => {
    const {newPub} = req.body;
    const addNewPub = PublicationModel.create(newPub);

    return res.json({
        publication: addNewPub,
        message: "Publication is added"
    });
})

//PUT

/*
Route          /publ/update/book
Description    Update or add new publication
Access         PUBLIC
Parameters     ISBN
Methods        PUT
*/
twinks.put("/publ/update/book/:isbn" , (req,res) => {
    //updating the publications database
    database.publication.forEach((pub) => {
        if(pub.id === req.body.pubId){
            return pub.books.push(req.params.isbn);
        }
    });
    //updating the books database
    database.books.forEach((book) => {
        if(book.ISBN === req.params.isbn){
            book.publication = req.body.pubId;
            return;
        }
    });
    return res.json({
        books: database.books,
        publication: database.publication,
        message: "Successfully updated publications"
    });
})

//DELETE

/*
Route          /book/delete
Description    delete a book
Access         PUBLIC
Parameters     ISBN
Methods        DELETE
*/

twinks.delete("/book/delete/:isbn" , (req,res) => {
    const updatedBookDatabase = database.books.filter((book) => book.ISBN !== req.params.isbn)
    database.books = updatedBookDatabase;
    return res.json({books: database.books});
})

/*
Route          /book/author/delete
Description    delete author from book
Access         PUBLIC
Parameters     ISBN, authorId
Methods        DELETE
*/
twinks.delete("/book/author/delete/:isbn/:authorId" , (req,res) => {
   database.books.forEach((book) => {
    if(book.ISBN === req.params.isbn){
        const newAuthorList = book.author.filter((eachAuthor) => (eachAuthor) !== parseInt(req.params.authorId));
        book.author = newAuthorList;
        return;
    }
   })
  return res.json({
    books: database.books,
    message: "Deleted Author Successfully"
  })
})

/*
Route          /book/delete/author
Description    delete author from book and related book from author
Access         PUBLIC
Parameters     ISBN, authorId
Methods        DELETE
*/
twinks.delete("/book/delete/author/:isbn/:authorId" , (req,res) => {
    //updating boooks database
    database.books.forEach((book) => {
        if(book.ISBN === req.params.isbn){
            const newAuthorList = book.author.filter((eachAuthor) => (eachAuthor) !== parseInt(req.params.authorId));
            book.author = newAuthorList;
            return;
        }
    })
    //updating author database
    database.author.forEach((author) => {
        if(author.id === parseInt(req.params.authorId)){
            const newBookList = author.books.filter((eachBook) => (eachBook) !== req.params.isbn);
            author.books = newBookList;
            return;
        }
    })
    return res.json({
        books: database.books,
        authors: database.author,
        message: "Deletion Successful"
    })

})




twinks.listen(8000, () => {
    console.log("Server is up and running");
})
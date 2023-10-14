const books = [
    {
        ISBN: "12345",
        title: "Hamlet",
        pubDate: "1901-02-11",
        numPage: 250,
        author: [1,2],
        publication: [1],
        category: ["tragedy","drama"],
        language: "eng"
    },
    {
        ISBN: "54321",
        title: "Endless Night",
        pubDate: "1932-11-16",
        numPage: 224,
        author: [2],
        publication: [2],
        category: ["crime","mystery","fantasy fiction"],
        language: "eng"
    }
]

const author = [
    {
        id: 1,
        name: "Shakespeare",
        books: ["12345","111tom","6855lit"]
    },
    {
        id: 2,
        name: "Agatha",
        books: ["12345","54321","222nev"]
    }
]

const publication = [
    {
        id: 1,
        name: "Seahorse",
        books: ["12345"]
    },
    {
        id: 2,
        name: "Pearson",
        books: []
    },
]

module.exports = {books, author, publication};
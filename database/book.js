const mongoose = require("mongoose")

const BookSchema = mongoose.Schema(
    {
        ISBN: String,
        title: String,
        pubDate: String,
        numPage: Number,
        author: [Number],
        publication: [Number],
        category: [String],
        language: String
    }
);

const BookModel = mongoose.model("books",BookSchema);

module.exports = BookModel;
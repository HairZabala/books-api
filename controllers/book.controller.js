const Book = require('../models/book.model');
const _ = require('underscore')

const getBooks = async(req, res) => {

    try {
        const [booksDB, bookCount] = await Promise.all([
            Book.find({ status: true, userId: req.user.uid })
            .populate('user', 'name email')
            .exec(),

            Book.countDocuments({ status: true, userId: req.user.uid })
        ]);

        res.json({
            status: true,
            count: bookCount,
            books: booksDB
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: false,
            errors: [{
                msg: 'Something is wrong, please check the system log.'
            }]
        });
    }

};

const getBook = async(req, res) => {

    try {
        const id = req.params.id;
        const bookDB = await Book.findById(id)
            .populate('user', 'name email')
            .exec();

        if (!bookDB) {
            return res.status(404).json({
                status: false,
                errors: [{
                    msg: 'The book does not exit in DB.'
                }]
            });
        }

        res.json({
            status: true,
            book: bookDB
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: false,
            errors: [{
                msg: 'Something is wrong, please check the system log.'
            }]
        });
    }


}

const getBooksByYear = async(req, res) => {

    const yearFiltered = Number(req.params.year) || 2000;

    try {
        const [booksDB, bookCount] = await Promise.all([
            Book.find({ status: true, year: {$gt:(yearFiltered-1)} })
            .populate('user', 'name email')
            .exec(),

            Book.countDocuments({ status: true, year: {$gt:(yearFiltered-1)} })
        ]);

        res.json({
            status: true,
            count: bookCount,
            books: booksDB
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: false,
            errors: [{
                msg: 'Something is wrong, please check the system log.'
            }]
        });
    }

};

const createBook = async(req, res) => {
    try {
        const { title, author, year } = req.body;

        const book = new Book({
            title,
            author,
            year,
            userId: req.user.uid,
        });

        await book.save();

        res.json({
            status: true,
            book,
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: false,
            errors: [{
                msg: 'Something is wrong, please check the system log.'
            }]
        });
    }
};

const updateBook = async(req, res) => {

    try {
        const id = req.params.id;
        const body = _.pick(req.body, ['title',  'author', 'year', 'status', 'userId']);

        const bookDB = await Book.findById(id);

        if (!bookDB) {
            return res.status(404).json({
                status: false,
                errors: [{
                    msg: 'The book does not exit in DB.'
                }]
            });
        }

        if (!bookDB.status) {
            return res.status(400).json({
                status: false,
                errors: [{
                    msg: 'It is not posible to modify a inactive book, please verify it.'
                }]
            });
        }

        const bookUpdated = await Book.findByIdAndUpdate(id, body, { new: true, runValidators: true, context: 'query' });

        res.json({
            status: true,
            book: bookUpdated
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: false,
            errors: [{
                msg: 'Something is wrong, please check the system log.'
            }]
        });
    }


}

const deleteBook = async(req, res) => {

    try {
        let id = req.params.id;

        const bookDB = await Book.findById(id);

        if (!bookDB) {
            return res.status(404).json({
                status: false,
                errors: [{
                    msg: 'The book does not exit in DB.'
                }]
            });
        }

        const bookDeleted = await Book.findByIdAndUpdate(id, { status: false }, { new: true });

        res.json({
            status: true,
            book: bookDeleted
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: false,
            errors: [{
                msg: 'Something is wrong, please check the system log.'
            }]
        });
    }

}

module.exports = {
    getBooks,
    getBook,
    createBook,
    updateBook,
    deleteBook,
    getBooksByYear
}
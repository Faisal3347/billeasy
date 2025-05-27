import Book from '../Model/Book.js';
import Review from '../Model/Review.js';

export const addBook = async (req, res) => {
  try {
    const { title, author, genre, description } = req.body;

    if (!title || !author || !genre) {
      return res.status(400).json({ message: 'Title, author, and genre are required' });
    }

    const book = new Book({ title, author, genre, description });
    await book.save();

    res.status(201).json({ message: 'Book added successfully', book });
  } catch (err) {
    console.error('Add Book Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getBooks = async (req, res) => {
  try {
    const { author, genre, page = 1, limit = 10 } = req.query;
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const query = {};

    if (author) query.author = new RegExp(author, 'i'); 
    if (genre) query.genre = new RegExp(genre, 'i');   

    const totalBooks = await Book.countDocuments(query);

    const books = await Book.find(query)
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum);

    res.status(200).json({
      page: pageNum,
      limit: limitNum,
      total: totalBooks,
      books,
    });
  } catch (err) {
    console.error('Get Books Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};


export const getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });

    const reviews = await Review.find({ book: req.params.id });
    const avgRating = reviews.length
      ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
      : 0;

    res.status(200).json({ book, avgRating, reviews });
  } catch (err) {
    console.error('Get Book by ID Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};


export const addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const bookId = req.params.id;

    if (!rating || !comment) {
      return res.status(400).json({ message: 'Rating and comment are required' });
    }

    const existingReview = await Review.findOne({ book: bookId, user: req.user._id });

    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this book' });
    }

    const review = new Review({
      book: bookId,
      user: req.user._id,
      rating,
      comment,
    });

    await review.save();

    res.status(201).json({ message: 'Review added successfully', review });
  } catch (err) {
    console.error('Add Review Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const searchBooks = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    const regex = new RegExp(query, 'i'); 

    const books = await Book.find({
      $or: [
        { title: { $regex: regex } },
        { author: { $regex: regex } }
      ]
    });

    res.status(200).json({ results: books });

  } catch (err) {
    console.error('Search Books Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
import express from 'express';
import {
  addBook,
  getBooks,
  getBookById,
  addReview,
  searchBooks 
} from '../controllers/bookController.js';

import  authMiddleware  from '../Middleware/AuthMiddleware.js'; 

const router = express.Router();

router.post('/book', authMiddleware, addBook);
router.get('/book', getBooks);
router.get('/:id', getBookById);
router.post('/:id/reviews', authMiddleware, addReview);
router.get('/search', searchBooks);

export default router;

import Review from '../Model/Review.js';
import Book from '../Model/Book.js';

// Update a review
export const updateReview = async (req, res) => {
  try {
    const reviewId = req.params.id;
    const { rating, comment } = req.body;

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    if (review.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You are not authorized to update this review' });
    }

    if (rating) review.rating = rating;
    if (comment) review.comment = comment;

    await review.save();

    const reviews = await Review.find({ book: review.book });
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

    res.status(200).json({
      message: 'Review updated successfully',
      review,
      avgRating: avgRating.toFixed(2),
    });

  } catch (err) {
    console.error('Update Review Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};


// Delete a review
export const deleteReview = async (req, res) => {
  try {
    const reviewId = req.params.id;

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    if (review.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You are not authorized to delete this review' });
    }

    const bookId = review.book;

    await Review.findByIdAndDelete(reviewId);

    // Recalculate average rating after deletion
    const remainingReviews = await Review.find({ book: bookId });
    const avgRating = remainingReviews.length
      ? remainingReviews.reduce((sum, r) => sum + r.rating, 0) / remainingReviews.length
      : 0;

    res.status(200).json({
      message: 'Review deleted successfully',
      avgRating: avgRating.toFixed(2),
      totalReviews: remainingReviews.length,
      reviews: remainingReviews,
    });

  } catch (err) {
    console.error('Delete Review Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};




export const addReview = async (req, res) => {
  try {
    const bookId = req.params.id;
    const { rating, comment } = req.body;
    const userId = req.user._id;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    const book = await Book.findById(bookId);
    if (!book) return res.status(404).json({ message: 'Book not found' });

    const existingReview = await Review.findOne({ user: userId, book: bookId });
    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this book' });
    }

    const review = new Review({
      user: userId,
      book: bookId,
      rating,
      comment,
    });
    await review.save();

    // Recalculate avg rating
    const reviews = await Review.find({ book: bookId });
    const avgRating = reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;

    res.status(201).json({
      message: 'Review added successfully',
      avgRating: avgRating.toFixed(2),
      totalReviews: reviews.length,
      reviews,
    });
  } catch (err) {
    console.error('Add Review Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};


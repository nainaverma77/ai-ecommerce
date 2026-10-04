const Review = require('../models/Review');
const Product = require('../models/Product');

exports.getReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ product: req.params.productId, isVisible: true })
      .populate('user', 'name avatar')
      .sort({ helpful: -1, createdAt: -1 });
    res.json({ reviews });
  } catch (err) {
    next(err);
  }
};

exports.submitReview = async (req, res, next) => {
  try {
    const { productId, rating, title, text } = req.body;

    const existing = await Review.findOne({ user: req.user._id, product: productId });
    if (existing) {
      return res.status(400).json({ error: 'You have already reviewed this product' });
    }

    const review = new Review({
      user: req.user._id,
      product: productId,
      rating,
      title,
      text
    });
    await review.save();

    // Update product rating and review count
    const reviews = await Review.find({ product: productId });
    const avgRating = reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;
    
    await Product.findByIdAndUpdate(productId, {
      rating: avgRating.toFixed(1),
      reviewCount: reviews.length
    });

    res.status(201).json({ review });
  } catch (err) {
    next(err);
  }
};

exports.markHelpful = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.reviewId);
    if (!review) return res.status(404).json({ error: 'Review not found' });

    review.helpful += 1;
    await review.save();

    res.json({ review });
  } catch (err) {
    next(err);
  }
};

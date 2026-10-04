const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { getReviews, submitReview, markHelpful } = require('../controllers/reviewController');

router.get('/:productId', getReviews);
router.post('/', protect, submitReview);
router.post('/:reviewId/helpful', markHelpful);

module.exports = router;

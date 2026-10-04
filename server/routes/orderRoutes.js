const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { placeOrder, getOrders, getOrderById, cancelOrder, requestReturn } = require('../controllers/orderController');

router.use(protect);

router.post('/', placeOrder);
router.get('/', getOrders);
router.get('/:id', getOrderById);
router.put('/:id/cancel', cancelOrder);
router.put('/:id/return', requestReturn);

module.exports = router;

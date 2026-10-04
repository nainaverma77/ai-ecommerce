const Order = require('../models/Order');
const Product = require('../models/Product');
const Cart = require('../models/Cart');

exports.placeOrder = async (req, res, next) => {
  try {
    const { items, subtotal, shippingCost, taxAmount, discount, totalAmount, shippingAddress, paymentMethod } = req.body;
    
    const order = new Order({
      user: req.user._id,
      items,
      subtotal,
      shippingCost,
      taxAmount,
      discount,
      totalAmount,
      shippingAddress,
      paymentMethod
    });

    await order.save();
    
    // Clear user's cart
    await Cart.findOneAndDelete({ user: req.user._id });

    res.status(201).json({ order });
  } catch (err) {
    next(err);
  }
};

exports.getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ orders });
  } catch (err) {
    next(err);
  }
};

exports.getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, user: req.user._id });
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json({ order });
  } catch (err) {
    next(err);
  }
};

exports.cancelOrder = async (req, res, next) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, user: req.user._id });
    if (!order) return res.status(404).json({ error: 'Order not found' });
    
    if (!['placed', 'confirmed'].includes(order.status)) {
      return res.status(400).json({ error: 'Cannot cancel order at this stage' });
    }

    order.status = 'cancelled';
    order.timeline.push({ status: 'cancelled', message: 'Order cancelled by user' });
    await order.save();

    res.json({ order });
  } catch (err) {
    next(err);
  }
};

exports.requestReturn = async (req, res, next) => {
  try {
    const { reason } = req.body;
    const order = await Order.findOne({ _id: req.params.id, user: req.user._id });
    if (!order) return res.status(404).json({ error: 'Order not found' });

    if (order.status !== 'delivered') {
      return res.status(400).json({ error: 'Only delivered orders can be returned' });
    }

    order.status = 'returned';
    order.timeline.push({ status: 'returned', message: `Return requested: ${reason}` });
    await order.save();

    res.json({ order });
  } catch (err) {
    next(err);
  }
};

const { getAllOrders, createOrder: dbCreateOrder } = require('../utils/db');
const { nanoid } = require('nanoid');

exports.listOrders = async (req, res, next) => {
  try {
    const orders = getAllOrders();
    res.json(orders);
  } catch (err) {
    next(err);
  }
};

exports.createOrder = async (req, res, next) => {
  try {
    const { tests = [], totalAmount = 0, appointmentDate = null, appointmentTime = null } = req.body || {};
    if (!Array.isArray(tests) || tests.length === 0) return res.status(400).json({ error: 'tests required' });

    const order = {
      id: `ORD-${nanoid(6).toUpperCase()}`,
      tests,
      totalAmount: Number(totalAmount || 0),
      date: new Date().toISOString().slice(0, 10),
      status: 'IN_PROCESS',
      appointmentDate,
      appointmentTime,
    };

    dbCreateOrder(order);
    res.status(201).json(order);
  } catch (err) {
    next(err);
  }
};
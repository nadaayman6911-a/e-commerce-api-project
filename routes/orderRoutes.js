const express = require("express");

const {
  createOrder,
  getOrders,
  getOrder,
  updateOrderStatus,
} = require("../controllers/orderController");


const router = express.Router();


// Checkout
router.post("/", createOrder);


// Get all orders
router.get("/", getOrders);


// Get single order
router.get("/:id", getOrder);


// Update order status
router.patch("/:id/status", updateOrderStatus);


module.exports = router;
const express = require("express");

const {
  getCart,
  addItemToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} = require("../controllers/cartController");

const router = express.Router();

router.get("/", getCart);

router.post("/items", addItemToCart);

router.patch("/items/:productId", updateCartItem);

router.delete("/items/:productId", removeCartItem);

router.delete("/", clearCart);

module.exports = router;
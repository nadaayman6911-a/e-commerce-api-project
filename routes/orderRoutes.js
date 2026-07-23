const express = require("express");

const {
  createOrder,
  getOrders,
  getOrder,
  updateOrderStatus,
} = require("../controllers/orderController");

const { body } = require("express-validator");
const validate = require("../middleware/validate");

const router = express.Router();


router.post(
  "/",
  [
    body("shippingAddress.street")
      .notEmpty()
      .withMessage("Street is required"),

    body("shippingAddress.city")
      .notEmpty()
      .withMessage("City is required"),

    body("shippingAddress.country")
      .notEmpty()
      .withMessage("Country is required"),
  ],
  validate,
  createOrder
);

router.get("/", getOrders);


router.get("/:id", getOrder);


router.patch("/:id/status", updateOrderStatus);


module.exports = router;
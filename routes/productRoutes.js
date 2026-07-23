const express = require("express");

const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

const { body } = require("express-validator");
const validate = require("../middleware/validate");

const router = express.Router();

router.get("/", getProducts);

router.get("/:id", getProduct);

router.post(
  "/",
  [
    body("name")
      .notEmpty()
      .withMessage("Product name is required"),

    body("price")
      .isNumeric()
      .withMessage("Price must be a number"),

    body("category")
      .notEmpty()
      .withMessage("Category is required"),
  ],
  validate,
  createProduct
);

router.patch("/:id", updateProduct);

router.delete("/:id", deleteProduct);

module.exports = router;
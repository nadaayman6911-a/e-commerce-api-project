const express = require("express");

const {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory
} = require("../controllers/categoryController");

const { body } = require("express-validator");
const validate = require("../middleware/validate");


const router = express.Router();


router.get("/", getCategories);

router.get("/:id", getCategory);

router.post(
  "/",
  [
    body("name")
      .notEmpty()
      .withMessage("Category name is required"),
  ],
  validate,
  createCategory
);

router.patch("/:id", updateCategory);

router.delete("/:id", deleteCategory);


module.exports = router;
const Cart = require("../models/cart.model");
const Product = require("../models/product.model");

const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/AppError");

exports.getCart = asyncHandler(async (req, res) => {
  let cart = await Cart.findOne().populate(
    "items.product",
    "name description price"
  );

  if (!cart) {
    cart = {
      items: [],
      totalPrice: 0,
    };
  }

  res.status(200).json({
    status: "success",
    message: "Cart fetched successfully",
    data: cart,
  });
});

exports.addItemToCart = asyncHandler(async (req, res, next) => {
  const { product: productId, quantity } = req.body;

  const product = await Product.findById(productId);

  if (!product) {
    return next(new AppError("Product not found", 404));
  }

  if (product.stock <= 0) {
    return next(new AppError("Product is out of stock", 400));
  }

  if (quantity > product.stock) {
    return next(new AppError("Insufficient stock", 400));
  }

  let cart = await Cart.findOne();

  if (!cart) {
    cart = new Cart({
      items: [],
      totalPrice: 0,
    });
  }

  const existingItem = cart.items.find(
    (item) => item.product.toString() === productId
  );

  if (existingItem) {
    existingItem.quantity += quantity;

    if (existingItem.quantity > product.stock) {
      return next(new AppError("Insufficient stock", 400));
    }
  } else {
    cart.items.push({
      product: product._id,
      quantity,
      price: product.price,
    });
  }

  cart.totalPrice = cart.items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  await cart.save();

  res.status(201).json({
    status: "success",
    message: "Item added to cart",
    data: cart,
  });
});

exports.updateCartItem = asyncHandler(async (req, res, next) => {
  const { quantity } = req.body;

  const cart = await Cart.findOne();

  if (!cart) {
    return next(new AppError("Cart not found", 404));
  }

  const item = cart.items.find(
    (item) => item.product.toString() === req.params.productId
  );

  if (!item) {
    return next(new AppError("Item not found in cart", 404));
  }

  const product = await Product.findById(item.product);

  if (quantity > product.stock) {
    return next(new AppError("Insufficient stock", 400));
  }

  if (quantity <= 0) {
    cart.items = cart.items.filter(
      (item) => item.product.toString() !== req.params.productId
    );
  } else {
    item.quantity = quantity;
  }

  cart.totalPrice = cart.items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  await cart.save();

  res.status(200).json({
    status: "success",
    message: "Cart updated successfully",
    data: cart,
  });
});

exports.removeCartItem = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOne();

  if (!cart) {
    return next(new AppError("Cart not found", 404));
  }

  cart.items = cart.items.filter(
    (item) => item.product.toString() !== req.params.productId
  );

  cart.totalPrice = cart.items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  await cart.save();

  res.status(200).json({
    status: "success",
    message: "Item removed successfully",
    data: cart,
  });
});

exports.clearCart = asyncHandler(async (req, res) => {
  let cart = await Cart.findOne();

  if (!cart) {
    cart = new Cart({
      items: [],
      totalPrice: 0,
    });
  } else {
    cart.items = [];
    cart.totalPrice = 0;
    await cart.save();
  }

  res.status(200).json({
    status: "success",
    message: "Cart cleared successfully",
    data: cart,
  });
});
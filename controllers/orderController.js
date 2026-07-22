const Order = require("../models/order.model");
const Cart = require("../models/cart.model");
const Product = require("../models/product.model");

const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/AppError");

exports.createOrder = asyncHandler(async (req, res, next) => {
  const { shippingAddress } = req.body;

  const cart = await Cart.findOne();

  if (!cart || cart.items.length === 0) {
    return next(new AppError("Cart is empty", 400));
  }

  const orderItems = [];
  let totalPrice = 0;

  for (const item of cart.items) {
    const product = await Product.findById(item.product);

    if (!product) {
      return next(new AppError("Product not found", 404));
    }

    if (product.stock < item.quantity) {
      return next(
        new AppError(
          `Not enough stock for ${product.name}. Available stock: ${product.stock}`,
          400
        )
      );
    }

    orderItems.push({
      product: product._id,
      name: product.name,
      price: product.price,
      quantity: item.quantity,
    });

    totalPrice += product.price * item.quantity;
  }

  for (const item of cart.items) {
    const product = await Product.findById(item.product);

    product.stock -= item.quantity;
    await product.save();
  }

  const order = await Order.create({
    orderNumber: `ORD-${Date.now()}`,
    items: orderItems,
    totalPrice,
    shippingAddress,
  });

  cart.items = [];
  cart.totalPrice = 0;
  await cart.save();

  res.status(201).json({
    status: "success",
    message: "Order created successfully",
    data: order,
  });
});

exports.getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find();

  res.status(200).json({
    status: "success",
    message: "Orders fetched successfully",
    data: orders,
  });
});

exports.getOrder = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate(
    "items.product",
    "name description price"
  );

  if (!order) {
    return next(new AppError("Order not found", 404));
  }

  res.status(200).json({
    status: "success",
    message: "Order fetched successfully",
    data: order,
  });
});

exports.updateOrderStatus = asyncHandler(async (req, res, next) => {
  const allowedStatuses = [
    "pending",
    "confirmed",
    "shipped",
    "delivered",
    "cancelled",
  ];

  const { status } = req.body;

  if (!allowedStatuses.includes(status)) {
    return next(new AppError("Invalid order status", 400));
  }

  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new AppError("Order not found", 404));
  }

  order.status = status;

  await order.save();

  res.status(200).json({
    status: "success",
    message: "Order status updated successfully",
    data: order,
  });
});
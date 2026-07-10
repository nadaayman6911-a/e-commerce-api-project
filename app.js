require("dotenv").config();

const express = require("express");
const mongoSanitize = require("express-mongo-sanitize");

const connectDB = require("./config/connectDB");

const categoryRoutes = require("./routes/categoryRoutes");

const errorHandler = require("./middleware/errorHandler");

const productRoutes = require("./routes/productRoutes");

const cartRoutes = require("./routes/cartRoutes");

const orderRoutes = require("./routes/orderRoutes");


const app = express();


// Middleware
app.use(express.json());

app.use(mongoSanitize());


// Routes
app.use("/api/categories", categoryRoutes);

app.use("/api/products", productRoutes);

app.use("/api/cart", cartRoutes);

app.use("/api/orders", orderRoutes);


// 404 Handler (after routes)
app.use((req, res, next) => {
  res.status(404).json({
    status: "fail",
    message: "Route not found",
    data: null
  });
});


// Error Handler (must be last)
app.use(errorHandler);


// Database connection before listen
connectDB();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
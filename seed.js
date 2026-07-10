require("dotenv").config();

const mongoose = require("mongoose");
const connectDB = require("./config/connectDB");

const Category = require("./models/category.model");
const Product = require("./models/product.model");
const Order = require("./models/order.model");

const seedDB = async () => {
  try {
    await connectDB();

    // Delete old data
    await Order.deleteMany({});
    await Product.deleteMany({});
    await Category.deleteMany({});

    // Create categories
    const categories = await Category.insertMany([
      {
        name: "Electronics",
        description: "Electronic devices",
        slug: "electronics",
      },
      {
        name: "Clothing",
        description: "Clothes and fashion",
        slug: "clothing",
      },
      {
        name: "Sports",
        description: "Sports equipment",
        slug: "sports",
      },
    ]);

    // Create products
    const products = await Product.insertMany([
      {
        name: "Laptop",
        description: "Gaming laptop",
        price: 1500,
        stock: 10,
        category: categories[0]._id,
        images: ["laptop.jpg"],
        inStock: true,
      },
      {
        name: "Phone",
        description: "Smart phone",
        price: 700,
        stock: 15,
        category: categories[0]._id,
        images: ["phone.jpg"],
        inStock: true,
      },
      {
        name: "T-Shirt",
        description: "Cotton T-Shirt",
        price: 25,
        stock: 20,
        category: categories[1]._id,
        images: ["tshirt.jpg"],
        inStock: true,
      },
      {
        name: "Jeans",
        description: "Blue jeans",
        price: 50,
        stock: 12,
        category: categories[1]._id,
        images: ["jeans.jpg"],
        inStock: true,
      },
      {
        name: "Football",
        description: "Football ball",
        price: 30,
        stock: 8,
        category: categories[2]._id,
        images: ["football.jpg"],
        inStock: true,
      },
      {
        name: "Tennis Racket",
        description: "Tennis racket",
        price: 120,
        stock: 5,
        category: categories[2]._id,
        images: ["racket.jpg"],
        inStock: true,
      },
    ]);

    console.log(
      `Database seeded successfully! Added ${categories.length} categories and ${products.length} products.`
    );
  } catch (error) {
    console.error(error);
  } finally {
    await mongoose.disconnect();
    console.log("Database disconnected.");
  }
};

seedDB();
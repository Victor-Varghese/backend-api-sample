const express = require("express");
const mongoose = require("mongoose");
const Product = require("./models/product.model.js");
const product = require("./models/product.model.js");
const app = express();

mongoose
  .connect(
    "mongodb+srv://Victor123:5cubLG62oLnjMFae@backenddb.kxxnh6p.mongodb.net/Node-API?retryWrites=true&w=majority&appName=BackendDB"
  )
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(3000, () => {
      console.log("Server is running on port 3000 nodemon");
    });
  })
  .catch((err) => {
    console.log("Error connecting to MongoDB", err);
  });

// send json to body
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.get("/api/products", async (req, res) => {
  try {
    // find all products
    const products = await Product.find({});
    res.status(200).json(products);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

app.get("/api/product/:id", async (req, res) => {
  try {
    //params
    const { id } = req.params;
    // find product by id
    const product = await Product.findById(id);
    res.status(200).json(product);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

app.post("/api/products", async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

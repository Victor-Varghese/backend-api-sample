require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const productRoute = require("./routes/product.route.js");
const app = express();

const jwt = require("jsonwebtoken");

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
app.use(express.urlencoded({ extended: false }));

// route
app.use("/api/products", productRoute);

app.get("/", (req, res) => {
  res.send("Hello from Node Server");
});

const posts = [
  {
    username: "victor",
    title: "Post 1",
  },
  {
    username: "Test",
    title: "Post 2",
  },
];

app.get("/posts", authenticateToken, (req, res) => {
  console.log("req.user", req.user);

  res.json(posts.filter((each) => each.username === req.user.name));
});

app.post("/login", (req, res) => {
  //Authenticate user

  const username = req.body.username;
  const user ={ name: username };
  const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
  res.json({
    accessToken: accessToken,
  });
});

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token === null) {
    return res.sendStatus(401);
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      return res.sendStatus(401);
    }
    // valid user
    req.user = user;
    next();
  });
}

// restructured to route and controller

// app.get("/api/products", async (req, res) => {
//   try {
//     // find all products
//     const products = await Product.find({});
//     res.status(200).json(products);
//   } catch (e) {
//     res.status(500).json({ message: e.message });
//   }
// });

// app.get("/api/products/:id", async (req, res) => {
//   try {
//     //params
//     const { id } = req.params;
//     // find product by id
//     const product = await Product.findById(id);
//     res.status(200).json(product);
//   } catch (e) {
//     res.status(500).json({ message: e.message });
//   }
// });

// app.post("/api/products", async (req, res) => {
//   try {
//     const product = await Product.create(req.body);
//     res.status(200).json(product);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// app.put("/api/products/:id", async (req, res) => {
//   try {
//     const { id } = req.params;
//     const product = await Product.findByIdAndUpdate(id, req.body);
//     if (!product) {
//       return res.status(404).json({ message: "Product not found" });
//     }

//     // avoid these
//     // res.status(200).json(product);

//     // use recheck from DB
//     const updatedProduct = await Product.findById(id);
//     res.status(200).json(updatedProduct);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// app.delete("/api/products/:id", async (req, res) => {
//   try {
//     const { id } = req.params;
//     const product = await Product.findByIdAndDelete(id);

//     // check
//     if (!product) {
//       return res.status(404).json({ message: "Product not found" });
//     }

//     res.status(200).json({ message: "Product deleted successfully" });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

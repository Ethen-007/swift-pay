const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
var port = process.env.PORT || 5500;

let products = [];
let orders = [];
app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("https://swiftpayindia-b4f8cce016d8.herokuapp.com/", (req, res) => {
  res.send("API deployment successful");
});

app.post(
  "https://swiftpayindia-b4f8cce016d8.herokuapp.com/product",
  (req, res) => {
    const product = req.body;
    console.log(product);
    products.push(product);

    res.send("Product is added to the database");
  }
);

app.get(
  "https://swiftpayindia-b4f8cce016d8.herokuapp.com/product",
  (req, res) => {
    res.json(products);
  }
);

app.get(
  "https://swiftpayindia-b4f8cce016d8.herokuapp.com/product/:id",
  (req, res) => {
    const id = req.params.id;
    for (let product of products) {
      if (product.id === id) {
        res.json(product);
        return;
      }
    }

    res.status(404).send("Product not found");
  }
);

app.delete(
  "https://swiftpayindia-b4f8cce016d8.herokuapp.com/product/:id",
  (req, res) => {
    const id = req.params.id;

    products = products.filter((i) => {
      if (i.id !== id) {
        return true;
      }

      return false;
    });

    res.send("Product is deleted");
  }
);

app.post(
  "https://swiftpayindia-b4f8cce016d8.herokuapp.com/product/:id",
  (req, res) => {
    const id = req.params.id;
    const newProduct = req.body;

    for (let i = 0; i < products.length; i++) {
      let product = products[i];

      if (product.id === id) {
        products[i] = newProduct;
      }
    }

    res.send("Product is edited");
  }
);

app.post(
  "https://swiftpayindia-b4f8cce016d8.herokuapp.com/checkout",
  (req, res) => {
    const order = req.body;

    orders.push(order);

    res.redirect(302, "https://assettracker.cf");
  }
);

app.get(
  "https://swiftpayindia-b4f8cce016d8.herokuapp.com/checkout",
  (req, res) => {
    res.json(orders);
  }
);

app.listen(port, () => console.log(`Server listening on port ${port}!`));

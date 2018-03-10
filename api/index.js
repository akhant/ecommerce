var router = require("express").Router();
import waterfall from "async/waterfall";
import faker from "faker";
import Category from "../models/category";
import Product from "../models/product";

router.post("/search", (req, res, next) => {
  
  Product.search(
    {
      query_string: { query: req.body.search_term }
    },
    (err, results) => {
      if (err) return next(err);
      res.json(results);
    }
  );
});

router.get("/:name", (req, res, next) => {
  waterfall([
    cb => {
      Category.findOne({ name: req.params.name }, (err, category) => {
        if (err) return next(err);
        cb(null, category);
      });
    },
    (category, cb) => {
      for (let i = 0; i < 30; i++) {
        let product = new Product();
        product.category = category._id;
        product.name = faker.commerce.productName();
        product.price = faker.commerce.price();
        product.image = faker.image.image();

        product.save();
      }
    }
  ]);

  res.json({ message: "Success" });
});

export default router;

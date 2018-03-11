const router = require("express").Router();
import User from "../models/user";
import Product from "../models/product";
import Cart from '../models/cart'

const paginate = (req, res, next) => {
  const perPage = 9;
  const page = req.params.page;

  Product.find()
    .skip(perPage * page)
    .limit(perPage)
    .populate("category")
    .exec((err, products) => {
      if (err) return next(err);
      Product.count().exec((err, count) => {
        console.log("count", count);
        if (err) return next(err);
        let pages = [];
        for (let i = 1; i <= count / perPage; i++) {
          pages.push(i);
        }
        res.render("main/product-main", {
          products,
          pages
        });
      });
    });
};

router.get("/page/:page", (req, res, next) => {
  paginate(req, res, next);
});

//elastic search
Product.createMapping((err, mapping) => {
  if (err) {
    console.log("error creating mapping");
    console.log(err);
  } else {
    console.log("mapping created");
    console.log(mapping);
  }
});

const stream = Product.synchronize();
let count = 0;

stream.on("data", () => {
  count++;
});
stream.on("close", () => {
  console.log("Indexed" + count + "documents");
});
stream.on("error", err => {
  console.log("err", err);
});

//routes
router.get("/", (req, res, next) => {
  if (req.user) {
    paginate(req, res, next);
  } else {
    res.render("main/home");
  }
});

router.get("/about", (req, res) => {
  res.render("main/about");
});

//product
router.get("/products/:id", (req, res, next) => {
  Product.find({ category: req.params.id })
    .populate("category")
    .exec((err, products) => {
      if (err) return next(err);
      res.render("main/category", {
        products: products
      });
    });
});

router.get("/product/:id", (req, res, next) => {
  Product.findById({ _id: req.params.id }, (err, product) => {
    if (err) return next(err);
    res.render("main/product", {
      product
    });
  });
});

router.post("/product/:product_id", (req,res,next)=>{
  Cart.findOne({owner: req.user._id}, (err,cart)=>{
    cart.items.push({
      item: req.body.product_id,
      price: parseFloat(req.body.priceValue),
      quantity: parseInt(req.body.quntity)
    })
    cart.total = (cart.total + parseFloat(req.body.priceValue)).toFixed(2)

    cart.save((err)=>{
      if (err) return next(err)
      return res.redirect('cart')
    })
  })
})

//search
router.get("/search", (req, res, next) => {
  if (req.query.q) {
    Product.search(
      {
        query_string: { query: req.query.q }
      },
      (err, results) => {
        if (err) return next(err);
        const data = results.hits.hits.map(hit => {
          return hit;
        });
        res.render("main/search-result", {
          query: req.query.q,
          data: data
        });
      }
    );
  }
});

router.post("/search", (req, res, next) => {
  res.redirect("/search?q=" + req.body.q);
});

export default router;

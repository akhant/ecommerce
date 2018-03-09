var router = require("express").Router();
import Category from "../models/category";

router.get("/add-category", (req, res, next) => {
  res.render("admin/add-category", { message: req.flash("success") });
});

router.post("/add-category", (req, res, next) => {
  const category = new Category();
  category.name = req.body.name;
  category.save(err => {
    if (err) return next(err);
    req.flash("success", "successfully added a new category");
    return res.redirect("/add-category");
  });
});

export default router;
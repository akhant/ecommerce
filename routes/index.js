const router = require('express').Router()

//routes
router.get("/", (req, res) => {
    res.render("home");
  });
  
  router.get("/about", (req, res) => {
      res.render("about");
    });

export default router;
const router = require('express').Router()
import User from '../models/user'

//routes
router.get("/", (req, res) => {
    res.render("home");
  });
  
  router.get("/about", (req, res) => {
      res.render("about");
    });

router.get('/users', (req,res,next) => {
  User.find({}, (err, users) => {
    res.json(users)
  }
  )
}
)

export default router;
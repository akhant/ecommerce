import secret from './config/secret'




//express init
import express from "express";

const app = express();

//mongoose connect to db
import mongoose from "mongoose";

mongoose.connect(secret.database, err => {
  if (err) {
    console.log(err);
  } else {
    console.log("connected");
  }
});

//handlebars
import exphbs from "express-handlebars";
var helpers = require('handlebars-helpers')();

const hbs = exphbs.create({
  defaultLayout: "main",
  partialsDir: ["views/partials/"]
});
app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");


//middlewares
import morgan from "morgan";
import bodyParser from "body-parser";
import cookieParser from 'cookie-parser'
import flash from 'express-flash'
import passport from 'passport'
import session from 'express-session'
const MongoStore = require('connect-mongo')(session);
import Category from './models/category'

app.use(morgan("dev"));
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: secret.secretKey,
  store: new MongoStore({ url: secret.database, autoReconnect: true})
}));
app.use(passport.initialize())
app.use(passport.session())
app.use((req,res,next)=>{
  res.locals.user = req.user
  next()
})
app.use((req,res,next) => {
  Category.find({}, (err, categories) => {
    if (err) return next(err)
    res.locals.categories = categories
    next()
  }
  )
}
)
app.use(flash());

//routes
import router from "./routes";
import userRoutes from "./routes/user";
import adminRoutes from './routes/admin'
import apiRoutes from './api'

app.use(router);
app.use(userRoutes);
app.use(adminRoutes)
app.use('/api', apiRoutes)

//server
app.listen(secret.port, err => {
  if (err) throw err;
  console.log("Server ok");
});


import express from "express";

const app = express();

//mongodb
import mongoose from "mongoose";

mongoose.connect("mongodb://localhost:27017/ecommerce", err => {
  if (err) {
    console.log(err);
  } else {
    console.log("connected");
  }
});

//handlebars
import exphbs from "express-handlebars";

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
import session from 'express-session'

app.use(morgan("dev"));
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser('keyboard cat'));
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: "banana"
}));
app.use(flash());

//routes
import router from "./routes";
import userRoutes from "./routes/user";

app.use(router);
app.use(userRoutes);

//server
app.listen(3000, err => {
  if (err) throw err;
  console.log("Server ok");
});

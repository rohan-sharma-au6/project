const express = require("express");
const dotenv = require("dotenv");
const passport = require("passport");
const cookieParser = require("cookie-parser");
const cors = require("cors");

dotenv.config();
require("./db");
require("./passport")

const app = express();
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:3001",
    credentials: true,
    allowedHeaders: ["Content-Type"]
  })
);
app.use(express.json());
app.use(passport.initialize());

//Routes 
// user Routes
app.use(require("./routes/userRoutes"));
// Admin Routes
app.use(require("./routes/adminRoutes"));
// User Address Routes
app.use(require("./routes/addressRoutes"));
//product Routes
app.use(require("./routes/productRoutes"));
//cart Routes
app.use(require("./routes/cartRoutes"));
//Review Routes
app.use(require("./routes/reviewRoutes"));
//Product FAQ Routes
app.use(require("./routes/PFAQRoutes"));
//Order Routes
app.use(require("./routes/orderRoutes"))
//Wishlist Routes
app.use(require("./routes/wishlistRoutes"))

app.get("/test", async (req, res) => {
    res.json({ message: "pass!" });
});

  module.exports = app;
const express= require("express")
const cartRoutes =require('../controllers/CartControllers')
const router = express.Router();
const passport = require('passport')


router.get("/carts", passport.authenticate("jwt", {
    session: false
}), cartRoutes.carts)
router.post("/addtocart/:_id", passport.authenticate("jwt", {
    session: false
}), cartRoutes.addToCart)

router.post("/removeFromCart/:productId", passport.authenticate("jwt", {
    session: false
}),cartRoutes.removeFromCart)

module.exports= router;

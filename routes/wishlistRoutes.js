const express= require("express")
const wishlistRoutes =require('../controllers/wishlistControllers')
const router = express.Router();
const passport = require('passport')


router.get("/wishlists", passport.authenticate("jwt", {
    session: false
}), wishlistRoutes.wishlists)
router.post("/addToWishlist/:_id", passport.authenticate("jwt", {
    session: false
}),wishlistRoutes.addToWishlist)

router.post("/removeFromWishlist/productId", passport.authenticate("jwt", {
    session: false
}),wishlistRoutes.removeFromWishlist)

module.exports= router;

const express= require("express")
const reviewRoutes =require('../controllers/reviewControllers')
const router = express.Router();
const passport = require('passport')
router.post("/addReview/:_id", passport.authenticate("jwt", {
    session: false
}),reviewRoutes.addReview)
router.get("/reviews/:id",reviewRoutes.reviews)

router.post("/editReview/:id", passport.authenticate("jwt", {
    session: false
}),reviewRoutes.editReview)

module.exports=router;
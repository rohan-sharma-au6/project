const express= require("express")
const orderRoutes =require('../controllers/orderControllers')
const router = express.Router();
const passport = require('passport')


router.post("/orders", passport.authenticate("jwt", {
    session: false
}), orderRoutes.checkOut);

router.post("/verify",orderRoutes.verify)
router.post(
    "/orderStatus/:id",
    passport.authenticate('admin-rule', {
      session: false
    }),
    orderRoutes.status
  );

module.exports=router;

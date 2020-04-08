const express= require("express")
const addressRoutes =require('../controllers/addressControllers')
const router = express.Router();
const passport = require('passport')

router.post("/addAddress", passport.authenticate("jwt", {
    session: false
}),addressRoutes.addAddress);
router.get("/address", passport.authenticate("jwt", {
    session: false
}),addressRoutes.address);

router.post("/editAddress/:id", passport.authenticate("jwt", {
    session: false
}),addressRoutes.editAddress)
router.post("/removeAddress/:id", passport.authenticate("jwt", {
    session: false
}),addressRoutes.removeAddress)

module.exports= router;
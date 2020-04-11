const express= require("express")
const PFAQRoutes =require('../controllers/PFAQControllers')
const router = express.Router();
const passport = require('passport')


//const passport = require("passport");
router.get("/productFAQ", passport.authenticate("jwt", {
    session: false
}),PFAQRoutes.allFAQ)

router.post("/askquestion/:id", passport.authenticate("jwt", {
    session: false
}),PFAQRoutes.askQuestion)

router.post('/productAnswers/:id',  passport.authenticate('admin-rule', {
    session: false
}),PFAQRoutes.answers);



module.exports = router;
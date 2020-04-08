const express= require("express")
const userRoutes= require('../controllers/userControllers')
const passport = require("passport");
const router = express.Router();

router.post("/register", userRoutes.registerUser);
router.post("/login", userRoutes.loginUser);
router.post("/checkotp", userRoutes.checkotp);
router.post('/change',userRoutes.changePassword);
router.post("/forgot",userRoutes.forgotPassword);
router.post("/reset",userRoutes.resetPassword);
router.post('/deactivate',userRoutes.deactivateAccount)


router.get(
    "/profile",
    passport.authenticate("jwt", {
      session: false
    }),
    userRoutes.showUserData
  );
  router.get(
    "/google",
    passport.authenticate("google", {
      session: false,
      scope: ["profile", "email"]
    })
  );
  
  router.get(
    "/google/redirect",
    passport.authenticate("google", {
      session: false,
      failureRedirect: "http://localhost:3001/#login"
    }),
    userRoutes.fetchUserFromGoogle
  );
  
  router.get(
    "/facebook",
    passport.authenticate("facebook", {
      session: false,
      scope: ["email"]
    })
  );
  
  router.get(
    "/facebook/redirect",
    passport.authenticate("facebook", {
      session: false,
      failureRedirect: "http://localhost:3001/#login"
    }),
    userRoutes.fetchUserFromFacebook
  );
  

module.exports = router;
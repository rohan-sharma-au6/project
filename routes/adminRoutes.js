const express= require("express")
const adminRoutes =require('../controllers/adminControllers')
const router = express.Router();
const passport = require('passport')

router.post('/registerAdmin',adminRoutes.registerAdmin)
router.post('/loginAdmin', adminRoutes.loginAdmin)
router.post("/logoutAdmin", passport.authenticate('admin-rule', {
    session: false
}),adminRoutes.logoutAdmin);
router.get(
    "/adminProfile",
    passport.authenticate('admin-rule', {
        session: false
    }),
   adminRoutes.showAdminData);
router.get(
    "/adminPortal",passport.authenticate('admin-rule', {
        session: false
    }),
   adminRoutes.adminPortal);
module.exports= router;
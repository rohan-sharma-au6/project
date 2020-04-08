const express= require("express")
const productRoutes= require('../controllers/ProductControllers')
//const cartRoutes =require('../controllers/userControllers')
const router = express.Router();

router.post('/addproduct',productRoutes.createProduct);
router.get('/products',productRoutes.renderProduct);
router.get('/detail/:_id',productRoutes.productDetails);
router.get("/category/:category",productRoutes.renderCategory);
module.exports= router;
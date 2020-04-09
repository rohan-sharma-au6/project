const Cart = require('../models/Cart')
const User= require('../models/User')
const Product =require('../models/Product')
module.exports={
    async addToCart(req, res) {
        try {
            const _id = req.params._id
            const cartProduct = await Product.findOne({_id
            });
            const check = await Cart.findOne({productId:_id
            })
            if (check) {
                return res.send({
                    massage: "fail"
                });
            }
            const cartProductBody = {
                productId: cartProduct._id,
                userId: req.user.id,
                name: cartProduct.name,
                image: cartProduct.image,
                category: cartProduct.category,
                price: cartProduct.price,
                quantity: req.body.quantity
            };
            const cart = await Cart.create({
                ...cartProductBody
            });
            await cartProduct.updateOne({
                timesSold: cartProduct.timesSold + 1
            });
            const check2 = await Cart.findOne({productId: _id
            })
            await cart.updateOne({
                totalPrice: (cart.quantity * cart.price)
            });
            res.status(200).json({
                check2,
                massage: "done"
            });
        } catch (err) {
            //console.log(err);
            if (err.name === "ValidationError")
                return res.status(400).send(`Validation Error: ${err.message}`);
            res.send(err);
        }
    },

    
    async carts(req, res) {
        try {
            const cartProducts = await Cart.find({});
            res.status(200).json(cartProducts);
        } catch (err) {
            console.log(err);
            if (err.name === "ValidationError")
                return res.status(400).send(`Validation Error: ${err.message}`);
            res.send(err.message);
        }
    },
    async removeFromCart(req, res) {
        try {
            const productId = req.params.productId
            
            const userId = req.user.id
            await Cart.deleteOne({ productId,userId
            });
            
            res.send("removed from cart successfully");
        } catch (err) {
            console.log(err);
            if (err.name === "ValidationError")
                return res.status(400).send(`Validation Error: ${err.message}`);
            res.send(err.message);
        }
    }
   
}
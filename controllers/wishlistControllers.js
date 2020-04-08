const Wishlist = require("../models/Wishlist")
const Product= require('../models/Product')



module.exports = {
    async addToWishlist(req, res) {
        try {
            const _id = req.params._id
            const wishlistProduct = await Product.findOne({_id
            });
            const check = await Wishlist.findOne({productId: _id})
            if (check) {
                return res.send({
                    massage: "fail"
                });
            }
            const wishlistProductBody = {
                productId: wishlistProduct._id,
                userId: req.user._id,
                name: wishlistProduct.name,
                image: wishlistProduct.image,
                category: wishlistProduct.category,
                price: wishlistProduct.price,
                description: wishlistProduct.description
            };
            const wishlist = await Wishlist.create({
                ...wishlistProductBody
            });
            res.status(200).send({
                wishlist,
                massage: "done"
            });
        } catch (err) {
            //console.log(err);
            if (err.name === "ValidationError")
                return res.status(400).send(`Validation Error: ${err.message}`);
            res.send(err);
        }
    },

    async removeFromWishlist(req, res) {
        try {
            const _id = req.params.productId
            const userId = req.user.id
            await Wishlist.deleteOne({ 
                userId,_id});
            res.send("removed from Wishist successfully");
        } catch (err) {
            console.log(err);
            if (err.name === "ValidationError")
                return res.status(400).send(`Validation Error: ${err.message}`);
            res.send(err.message);
        }
    },

    async wishlists(req, res) {
        try {
            const userId = req.user.id;
            const wishlistProducts = await Wishlist.find({userId});
            res.status(200).json(wishlistProducts);
        } catch (err) {
            console.log(err);
            if (err.name === "ValidationError")
                return res.status(400).send(`Validation Error: ${err.message}`);
            res.send(err.message);
        }
    }
}
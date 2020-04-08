const Review = require('../models/Review');

module.exports={
    async addReview(req, res) {
        try {
            const _id = req.params._id
            const check = await Review.findOne({
                
                    productId: _id
               
            })
            if (check) {
                return res.status(401).send("already added review");
            }
            const body = {
                ...req.body,
                productId: _id,
                userId: req.user.id,
            };
            const review = await Review.create({
                ...body
            });
            res.status(200).send("added review successfullly");
        } catch (err) {
            console.log(err);
            if (err.name === "ValidationError")
                return res.status(400).send(`Validation Error: ${err.message}`);
            res.send(err);
        }
    },
    async reviews(req, res) {
        try {
            const productId = req.params.id
            const reviews = await Review.find({
                
                    productId
                
            });
            res.status(200).json(reviews);
        } catch (err) {
            console.log(err);
            if (err.name === "ValidationError")
                return res.status(400).send(`Validation Error: ${err.message}`);
            res.send(err.message);
        }
    },

    async editReview(req, res) {
        try {
            const productId = req.params.id
            const userId = req.user.id
            const review = await Review.findOne({productId,userId});
            if (!review) {
                return res.status(401).send("please add review first");
            }
            await review.update({
                ...req.body
            });
            res.send("review updated sucessfully");
        } catch (err) {
            console.log(err);
            if (err.name === "ValidationError")
                return res.status(400).send(`Validation Error: ${err.message}`);
            res.send(err.message);
        }
    }
}
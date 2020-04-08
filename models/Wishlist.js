const mongoose= require('mongoose');
const Schema =mongoose.Schema;

const wishlistSchema= new Schema({
   
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref:'user'
       
    },
    productId: {
        type:Schema.Types.ObjectId,
        required:true,
        ref:'product'
    },
    name: {
        type: String,
        required:true,
    },
    category: {
        type: String,
        required:true,
    },
    price: {
        type: Number,
        required:true,
    },
    image: {
        type: Array,
        
    },
    description: {
        type: String,
       
    }
});

const Wishlist= mongoose.model("wishlist",wishlistSchema)
module.exports= Wishlist
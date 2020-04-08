var mongoose = require('mongoose')
var Schema = mongoose.Schema;

var cartSchema = new Schema({
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
    quantity: {
        type: Number,
        required:true,
        default:1
    },
    totalPrice: {
        type:Number,
        defaultValue: 0
    },
    description: {
        type: String,
       
    }
}, {timestamps: true});

module.exports = mongoose.model('cart', cartSchema);
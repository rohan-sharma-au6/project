var mongoose = require('mongoose')
var Schema = mongoose.Schema;

var productSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    category: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: Number,
        required: true,
        trim: true
    },
    image: {
        type: [],
        required:true
        
    },
    description:{
        type: String,
        trim: true
    },
    timesSold: {
        type: Number,
        default: 0
    }
}, {timestamps: true});

var Product=mongoose.model('product', productSchema);
module.exports = Product;
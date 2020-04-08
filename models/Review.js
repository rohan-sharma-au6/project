var mongoose = require('mongoose')
var Schema = mongoose.Schema;


var reviewSchema= new Schema({

    userId:{
        type: Schema.Types.ObjectId,
        required: true,
        ref:'user'
    },
    productId:{
        type:Schema.Types.ObjectId,
        required:true,
        ref:"products"
    },
    rating:{
        type:Number,
        required:true
    },
    title:{
        type:String,
        required:true
    },
    content:{
        type:String,
        
    },
    image:{
        type:String,

    },
    
},{timestamps:true});

module.exports = mongoose.model('review', reviewSchema);

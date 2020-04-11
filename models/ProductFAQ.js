var mongoose = require('mongoose')
var Schema = mongoose.Schema;

const PFAQSchema = new Schema({

    productId:{
        type: Schema.Types.ObjectId,
        ref: 'product',
       
    },
    question:{
        type:String
    },
    answer:{
        type:String,
        default:"Not Answered Yet"
    }
},{timestamps:true}
);

module.exports= mongoose.model('PFAQ',PFAQSchema)
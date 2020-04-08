var mongoose = require('mongoose')
var Schema = mongoose.Schema;

var orderSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        required: true
    },
    orderDetails: {
        type: [{productId : {type: Schema.Types.ObjectId,ref: 'product'}}],
        required: true
    },
    order_id: {
        type: String,
       // required: true
    },
    order_value: {
        type: Number,
        required: true
    },
    razorpay_payment_id: {
        type:String,
        //required: true
    },
    razorpay_order_id: {
        type: String,
       // required: true
    },
    razorpay_signature: {
        type: String,
       // required: true
    },
    isPending: {
        type: Boolean,
        default:true
    }
},
 {timestamps: true}
);

module.exports = mongoose.model('order', orderSchema);
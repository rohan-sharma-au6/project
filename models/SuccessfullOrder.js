const mongoose= require("mongoose")
const Schema= mongoose.Schema;

const successfullOrderSchema ={
    userId:{
        type: Schema.Types.ObjectId,
        required: true,
        ref:'user'
    },
    userMail:{
        type:String,
    },
    order_id: {
        type: String,
    },
    order_value: {
        type: Number,
        required: true
    },
    order_status:{
       type:String,
       default:'pending'
    },
    cartItems:{
        type:Array,
        required:true
    }
}

const SuccessfullOrder= mongoose.model("successfullOrders",successfullOrderSchema)
module.exports= SuccessfullOrder;
 const mongoose= require('mongoose');
 const Schema =mongoose.Schema;

 const addressSchema = new Schema({

    userId:{
        type: Schema.Types.ObjectId,
        required: true,
        ref:'user'
    },
    pincode:{
        type:Number,
        required:true
    },
    houseNo:{
        type:String,
        
    },
    fullAddress:{
        type:String,
        required:true
    },
    landmark:{
        type:String
    },
    comment:{
        type:String
        
    }
   
 }
 ,{timestamps:true})

var Address= mongoose.model('address',addressSchema);
 module.exports=Address;
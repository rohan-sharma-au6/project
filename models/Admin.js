const mongoose = require('mongoose');
const Schema= mongoose.Schema;
const bcrypt = require("bcryptjs");
const {sign} = require("jsonwebtoken");

const adminSchema= new Schema({

    name:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    token:{
        type:String,
        default:""
    }
},
{timestamps:true})

adminSchema.statics.findByNameAndPassword=async function(name,password){
    try {
        const admin = await Admin.findOne({ name});
        if (!admin) throw new Error("Incorrect credentials");
        const isMatched = await bcrypt.compare(password, admin.password);
        if (!isMatched) throw new Error("Incorrect credentials");
        return admin;
    } catch (err) {
        throw err;
    }
}


adminSchema.methods.generateToken = async function() {
    const admin = this;
    const token = await sign({ id: admin._id },process.env.JWT_SECRET_KEY, {
      expiresIn: "12h"
    });
    admin.token = token;
    await admin.save();
    return token;
  };
  adminSchema.methods.toJSON = function() {
    const admin = this.toObject();
    delete admin.password;
    delete admin.accessToken;
    delete admin.__v;
    return admin;
  };
  
  //middleware for avoid rehashing
  adminSchema.pre("save",function(next){
    var admin=this
    if(admin.isModified("password")){
      bcrypt.hash(admin.password,10).then(function(hased){
        admin.password=hased
        next();

      }).catch(function(err){
        next(err);
      })
    }
    else{
      next();
    }
  })
  



var Admin= mongoose.model("admin",adminSchema)
module.exports=Admin;
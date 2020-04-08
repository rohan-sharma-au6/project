const mongoose = require('mongoose')
const bcrypt = require('bcryptjs');
const {sign}= require('jsonwebtoken')
const Schema = mongoose.Schema;

var userSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        trim: true,
        unique: true,required:true
    },
    password: {
        type: String,
        required: function(){
          return !this.isThirdPartyUser
        }
        
    },
    phoneNumber:{
        type:String,
        required: function(){
          return !this.isThirdPartyUser
        }
    },
    isThirdPartyUser: {
      type: Boolean,
      required:true
    },
    isConfirmed:{
        type:Boolean,
        default:false
    },
    request_id:{
        type:String,
        default:'',
        required: function(){
          return !this.isThirdPartyUser
        } 
    },
    accessToken:{
      type:String,
      trim: true
    }
}
);

userSchema.statics.findByPhoneNumber= (phoneNumber,password)=>{
    var userObj=null;
    return new Promise(function(resolve,reject){
      User.findOne({phoneNumber:phoneNumber}).then(function(user){
        if(!user) reject("incorrect credentials");
        userObj=user;
        return bcrypt.compare(password,user.password);
      }).then(function(isMatched){
        if(!isMatched) reject("incorrect credentials");
        resolve(userObj);
      }).catch(function(err){
        reject(err);
      })
    })
  };


  userSchema.methods.generateToken = async function() {
    const user = this;
    const accessToken = await sign({ id: user._id },process.env.JWT_SECRET_KEY, {
      expiresIn: "12h"
    });
    user.accessToken = accessToken;
    await user.save();
    return accessToken;
  };
  
  
  userSchema.methods.toJSON = function() {
    const user = this.toObject();
    delete user.password;
    delete user.accessToken;
    delete user.__v;
    return user;
  };
  
  //middleware for avoid rehashing
  userSchema.pre("save",function(next){
    var user=this
    if(user.isModified("password")){
      bcrypt.hash(user.password,10).then(function(hased){
        user.password=hased
        next();

      }).catch(function(err){
        next(err);
      })
    }
    else{
      next();
    }
  })
 
  
  var User = mongoose.model("user", userSchema);
  module.exports=User;
const User= require('../models/User')
const Nexmo = require("nexmo");
const NEXMO_API_KEY = "b8884916";
const NEXMO_API_SECRET = "5YfXVvWPKDiWvGmJ";
const BRAND_NAME = "freshKart";
const { verify } = require("jsonwebtoken");
const nexmo = new Nexmo({
  apiKey: NEXMO_API_KEY,
  apiSecret: NEXMO_API_SECRET
});
const bcrypt= require("bcryptjs")

module.exports={

  registerUser(req,res){
        try{
            const user = new User({ ...req.body, isThirdPartyUser:false });
            const number = req.body.phoneNumber;
            nexmo.verify.request(
                {
                    number:"91"+number,
                    brand:BRAND_NAME
                },
                (err,result)=>{
                    if(err){
                        console.error("error",err);
                    }else if(result.status==0){
                        console.log(result)
                       user.request_id= result.request_id;
                       user.save()
                        res.status(200).json(result);
                    }else {
                        res.send("invalid Credential");
                      }
                }
            )
        } catch (err) {
            console.log(err);
             if (err.name === "ValidationError")
              return res.status(400).send(`Validation Error: ${err.message}`);
            res.send(err.message);
          }
    },
      async checkotp(req, res) {
      try {
          const code = req.body.otp;
          const request_id = req.body.request_id;
           const user= await User.findOne({request_id});
          console.log(user)
          nexmo.verify.check(
            {
              request_id,
              code
            },
            async(err, result) => {
              if (err) {
                console.log(err);
              } else if (result.status == 0) {
                
                user.isConfirmed=true;
                 
                await user.save()
                console.log(result); 
                res.status(200).json(result);
              } else {
                res.json(result);
              }
            }
          );
        } catch (err) {
          console.log(err);
          if (err.name === "ValidationError")
            return res.status(400).send(`Validation Error: ${err.message}`);
          res.send(err.message);
        }
      },
     
     async loginUser(req, res) {
       
        const { phoneNumber, password } = req.body;
        if (!phoneNumber || !password)
        return res.send({
          error: "Incorrect credentials",
          massage: "fail"
        });
        try {
          const user = await  User.findByPhoneNumber(
            phoneNumber,
            password
          );
          if (user.isConfirmed) {
            user.generateToken();
            const  accessToken ="jwt "+user.accessToken;
            res.cookie("token", user.accessToken, {
              expires: new Date(Date.now() + 1000 * 60 * 60 * 12),
              httpOnly: true,
              sameSite: "none"
          });
           res.status(200).send({
            accessToken,
            massage: "done"
          });
          } else {
            const number = user.phoneNumber;
            nexmo.verify.request(
              {
                number: "91" + number,
                brand: BRAND_NAME
              },
              async (err, result) => {
                if (err) {
                  console.error("error", err);
                } else {
                   user.request_id= result.request_id
                 await user.save();
                  return res.json(result)
                    .status(403)
                    .send("You havent confirmed your account. Please verify");
                }
              }
            );
          }
        } catch (err) {
          console.log(err.message);
          res.send({
            error: "invalid Credential",
            massage: "fail"
          });
        }
      },
      
      async forgotPassword(req, res) {
        const { phoneNumber } = req.body;
        if (!phoneNumber) return res.status(400).send("Number required");
        try {
          const user = await User.findOne({ phoneNumber });
          if (!user) {
            return res
              .status(400)
              .send("There is no user present. Kindly register");
          } else {
            nexmo.verify.request(
              {
                number: "91" + phoneNumber,
                brand: BRAND_NAME
              },
             async (err, result) => {
                if (err) {
                  console.error("error", err);
                } else if (result.status == 0) {
                    user.request_id= result.request_id
                 await user.save()
                  res.status(200).json(result);
                } else {
                  res.send("invalid Credential");
                }
              }
            );
          }
        } catch (err) {
          console.log(err);
          res.status(500).send(err.message);
        }
      },
      
      async resetPassword(req, res) {
        const { password, request_id, otp } = req.body;
        try {
          const user = await User.findOne({request_id});
          const code = otp;
          nexmo.verify.check(
            {
              request_id,
              code
            },
           async (err, result) => {
              if (err) {
                console.error(err);
              } else if (result.status == 0) {
                console.log(result);
                user.password= password;
               await user.save();
                res.status(200).json(result);
              } else {
                res.send("invalid Credential");
              }
            }
          );
        } catch (err) {
          console.log(err);
          res.status(500).send(err.message);
        }
      }, 
      
      async deactivateAccount(req, res) {
        const { phoneNumber, password } = req.body;
        if (!phoneNumber || !password)
          return res.status(400).send("number and password is required");
        try {
          const user = await User.findByPhoneNumber(
            phoneNumber,
            password
          );
          if (!user) {
            return res.status(401).send("Incorrect credentials");
          }
          await User.remove({phoneNumber:phoneNumber})
          return res.send("User Deactivated suucessfully");
        } catch (err) {
          console.log(err.message);
          res.status(500).send("Server Error");
        }
      },
     async changePassword(req,res){
        const { phoneNumber, oldPassword, newPassword } = req.body;
        if(!phoneNumber||!oldPassword||!newPassword){
            return res.status(400).send("Bad request");
        }
        try{
            const user =await User.findByPhoneNumber(
                phoneNumber,oldPassword
            );
            if(!user){
                return res.status(401).send("Incorrect credentials");
            }
             //newPassword1= bcrypt.hash(newPassword,10)
            // User.password= bcrypt.hash(newPassword,10);
            console.log(newPassword1)
            await User.updateOne({password:newPassword})
            
            return res.send(user);
        }catch (err) {
            console.log(err.message);
            res.send("invalid credential");
          }
      },
      async fetchUserFromGoogle(req, res) {
        const user = req.user;
        //console.log(req.user)
        await user.generateToken();
        console.log(user.accessToken)
        await res.cookie("accessToken",user.accessToken, {
          expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
          httpOnly: true,
          SameSite: "none"
        });
 
        res.redirect('http://localhost:3000/profile');
      }, 
        
      async showUserData(req, res) {
          const user = req.user;
        res.json(user);
      },

      async fetchUserFromFacebook(req, res) {
        const user = req.user;
        await user.generateToken();
        console.log(user.token);
        // Send the token as a cookie ..
        res.cookie("token", user.token, {
          expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
          httpOnly: true,
          sameSite: "none"
        });
        // Redirect to the clients route (http://localhost:3001)
        res.redirect('http://localhost:3000/profile')
      }


  //  fetchUserFromGoogle(req, res){
  //   //const user = req.user;
  //   console.log(req.user)
  //   res.send('hjkghjg')
  // }
  
};
    

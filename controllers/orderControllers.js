const Order= require('../models/Order');
const User = require('../models/User')
const Cart= require('../models/Cart')
const { v4: uuid } = require("uuid");
const instance= require('../razorPay');
const createSignature = require("../createSignature");
const {
  sendMailToUser,
  sendOrderStatus
} = require("../generateEmail");
const SucessfullOrder = require("../models/SuccessfullOrder")
module.exports={
    
    async checkOut(req,res){

        try
        {
            const _id= req.user._id
            const user= await User.findById({_id})
            console.log(user);
            const {amount} = req.body
            console.log(amount)
            const transactionId = uuid();
            const orderOptions = {
                currency: "INR",
                amount: amount * 100,
                receipt: transactionId,
                payment_capture: 0
              };
              const order = await instance.orders.create(orderOptions);
              const transaction = {
                userId: req.user._id,
                order_value: amount,
                order_id: order.id,
                razorpay_payment_id: null,
                razorpay_signature: null,
                isPending: true,
              };
            var orders =await  Order.create({
                ...transaction
       });
        
       res.status(201).json({
        statusCode: 201,
        orderId: order.id,
        amount: transaction.order_value,
        email: user.email
      });
        
    }
    catch (err) {
        console.log(err);
        if (err.name === "ValidationError")
            return res.status(400).send(`Validation Error: ${err.message}`);
        res.send(err.message);
    }
    },

    async verify(req, res) {
        const {
          amount,
          currency,
          razorpay_order_id,
          razorpay_payment_id,
          razorpay_signature,
          order_id,
          email,
          userId
        } = req.body;
        try {
          const amountInRupees = amount / 100;
          const createdSignature = createSignature(
            razorpay_order_id,
            razorpay_payment_id
          );
          if (createdSignature !== razorpay_signature) {
            await sendMailToUser(
              email,
              "fail",
              amountInRupees,
              razorpay_payment_id,
              razorpay_order_id
            );
            return res.status(401).send({
              statusCode: 401,
              message: "Invalid payment request"
            });
          }
          const captureResponse = await instance.payments.capture(
            razorpay_payment_id,
            amount,
            currency
          );
          const transaction = await Order.findOne({order_id
          });
          if (!transaction) {
            return res.status(401).send({
              statusCode: 401,
              message: "Invalid payment request"
            });
          }
          await transaction.updateOne({
            razorpay_payment_id: razorpay_payment_id,
            razorpay_signature: razorpay_signature,
            isPending: false,
            razorpay_order_id: razorpay_order_id
          });
          await sendMailToUser(
            email,
            "success",
            amountInRupees,
            razorpay_payment_id,
            razorpay_order_id
          );
          console.log("Mail send Successfully");
          
          const cartItems = await Cart.find({userId
           
          });
          const success = await SucessfullOrder.create({
            order_value: amount / 100,
            order_id,
            userId,
            cartItems,
            userMail: email
          });
          console.log(success)
          await Cart.remove({userId
            
          });
          res.status(201).send({
            transaction,
            captureResponse,success
          });
        } catch (err) {
          console.log(err);
          if (err.name === "ValidationError")
            return res.status(400).send(`Validation Error: ${err.message}`);
          res.send(err);
        }
},
async status(req, res) {
  const {
    status
  } = req.body;
  const orderId = req.params.id
  try {
    const order = await SucessfullOrder.findOne({
      orderId
    });
    const email = order.dataValues.userMail;
    if (status === "accepted") {
      await order.updateOne({
        order_status: "accepted",
      });
      await sendOrderStatus(email, "accepted")
      res.status(200).json(order)
    } else if (status === "rejected") {
      await order.updateOne({
        order_status: "rejected",
      });
      await sendOrderStatus(email, "rejected")
      res.status(200).json(order)
    }
  } catch (err) {
    console.log(err);
    if (err.name === "ValidationError")
      return res.status(400).send(`Validation Error: ${err.message}`);
    res.send(err);
  }
}
      


}
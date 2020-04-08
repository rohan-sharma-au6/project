const Order= require('../models/Order');
const User = require('../models/User')
const Cart= require('../models/Cart')
const { v4: uuid } = require("uuid");
const instance= require('../razorPay');
const createSignature = require("../createSignature");
const sendMail = require("../generateEmail");
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
          email
        } = req.body;
        try {
          const amountInRupees = amount / 100;
          const createdSignature = createSignature(
            razorpay_order_id,
            razorpay_payment_id
          );
          if (createdSignature !== razorpay_signature) {
            await sendMail(
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
          await transaction.update({
            razorpay_payment_id: razorpay_payment_id,
            razorpay_signature: razorpay_signature,
            isPending: false,
            razorpay_order_id: razorpay_order_id
          });
          await sendMail(
            email,
            "success",
            amountInRupees,
            razorpay_payment_id,
            razorpay_order_id
          );
          console.log("Mail send Successfully");
          res.status(201).send({
            transaction,
            captureResponse
          });
        } catch (err) {
          console.log(err);
          if (err.name === "ValidationError")
            return res.status(400).send(`Validation Error: ${err.message}`);
          res.send(err);
        }
      }


}
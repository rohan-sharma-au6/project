const nodemailer = require("nodemailer");
const transportOptions = {
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  debug: process.env.NODE_ENV === "development",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASS
  }
};

const mailTransport = nodemailer.createTransport(transportOptions);
const sendMailToUser = async (email, status, amount, payment_id, order_id) => {
  let html = null;
  if (status === "success")
    html = `
  <h1>Welcome to FreshKart </h1>
  <h3>Order Placed Successfully</h1>
  <h5>Thanks for Shopping with us. </h5>
  <h6>order_value  :  ${amount}</h6>
  <h6>razorpay_payment_id  :  ${payment_id}</h6>
  <h6>razorpay_order_id  :  ${order_id}</h6>
  <h6>Your Order Placed Succesufully</h6>
  Thanks For Shoppping With Us 
    `;
  else if (status === "fail")
    html = `
    <h1>Welcome to FreshKart </h1>
    <h5>Thanks for Shopping with us. </h5>
    Sorry to  say that something is wrong in your payment
    your payment is autoreversed from our side
    it will take 3-5 buisness days to refund in your account `;
  try {
    await mailTransport.sendMail({
      from: process.env.EMAIL,
      to: email,
      subject: "Order Details from FreshKart",
      html
    });
  } catch (err) {
    console.log(err);
    throw err;
  }
};

module.exports = sendMailToUser;

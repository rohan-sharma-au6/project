const Admin=require('../models/Admin');
const PFAQ= require("../models/ProductFAQ")
const Product = require("../models/Product")
const SuccessfullOrder = require("../models/SuccessfullOrder")
module.exports={

    async registerAdmin(req, res) {
        try {
            if (req.body.key == process.env.CREATEADMINKEY && req.body.verify == process.env.CREATEADMINPASS) {
                const admin = await Admin.create({
                    ...req.body
                });
                res.send({
                    admin,
                    massage: "done"
                })
            } else {
                res.send({
                    massage: "You are not an Admin"
                });
            }
        } catch (err) {
            console.log(err);
            if (err.name === "SequelizeValidationError")
                return res.status(400).send(`Validation Error: ${err.message}`);
            res.send(err.message);
        }
    },
    async loginAdmin(req, res) {
        const {
            name,
            password
        } = req.body;
        if (!name || !password)
            return res.status(400).send("Incorrect credentials");
        try {
            const admin = await Admin.findByNameAndPassword(
                name,
                password
            );
            if (!admin) {
                res.send({
                    error: "invalid Credential",
                    massage: "fail"
                });
            }
            await admin.generateToken();
            const token = admin.token;
            console.log(token)
            res.cookie("token", token, {
                expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
                httpOnly: true,
                sameSite: "none"
            });
            res.send({
                token,
                massage: "done"
            });
        } catch (err) {
            console.log(err.message);
            res.send({
                error: "invalid Credential",
                massage: "fail"
            });
        }
    },   
    
    async logoutAdmin(req, res) {
        const id = req.user.id;
        try {
            const admin = await Admin.findOne({id
            });
             admin.token="";
            await admin.save();
            res.clearCookie('token');
            res.send({
                massage: "done"
            });
        } catch (err) {
            console.log(err.message);
            res.send({
                error: "invalid Credential",
                massage: "fail"
            });
        }
    },
    async showAdminData(req, res) {

        res.json({
            admin: req.user
        });
    },
    async adminPortal(req, res) {
        try {
            const pfaq = await PFAQ.find({

                    "answer": "Not Answered Yet"
            });
            const products = await Product.find().sort({timesSold:-1})
            const successfullOrders = await SuccessfullOrder.find({order_status: "pending"}).sort({_id:-1});
            res.status(200).send({
                pfaq,
                products,
                successfullOrders
            })
        } catch (err) {
            console.log(err);
            if (err.name === "SequelizeValidationError")
                return res.status(400).send(`Validation Error: ${err.message}`);
            res.send(err.message);
        }
    },
   
}
const Product= require('../models/Product');
require('../db')
module.exports={
   
    createProduct(req,res){
        try{
            const product = new Product({...req.body});
            product.save()
          res.status(200).json(product);
            
            
        }
        catch (err) {
            console.log(err);
             if (err.name === "ValidationError")
              return res.status(400).send(`Validation Error: ${err.message}`);
            res.send(err.message);
          }
    },
    renderProduct(req,res){

        Product.find().then(function(doc){
            res.status(200).json(doc)
        }).catch(function(err){
            console.log(err);
             if (err.name === "ValidationError")
              return res.status(400).send(`Validation Error: ${err.message}`);
            res.send(err.message);
        })
    },
     productDetails(req,res){
        const _id= req.params._id

        Product.findOne({_id}).then((doc)=>{
            res.status(200).json(doc)
        }).catch(function(err){
            console.log(err);
             if (err.name === "ValidationError")
              return res.status(400).send(`Validation Error: ${err.message}`);
            res.send(err.message);
        })

        
    },
    renderCategory(req,res){
        const category= req.params.category;
        Product.find({category:category}).then((doc)=>{
            res.status(200).json(doc)
        }).catch(function(err){
            console.log(err);
             if (err.name === "ValidationError")
              return res.status(400).send(`Validation Error: ${err.message}`);
            res.send(err.message);
        })
    }
}
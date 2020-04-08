const PFAQ= require('../models/ProductFAQ');

module.exports={
    async askQuestion(req,res){
        const id= req.params.id;
        try{
            const question= await new PFAQ({
                question: req.body.question,
                productId: id,
            });
            await question.save();
            res.send(question);
        }catch (err) {
            console.log(err);
            if (err.name === "ValidationError")
                return res.status(400).send(`Validation Error: ${err.message}`);
            res.send(err.message);
        }
    },
    async answers(req, res) {
        try {
            const id = req.params.id
            const faq = await PFAQ.findOne({id});
            await faq.update({
                answer: req.body.answer
            });
            
            res.status(200).json(faq);
        } catch (err) {
            console.log(err);
            if (err.name === "ValidationError")
                return res.status(400).send(`Validation Error: ${err.message}`);
            res.send(err.message);
        }
    },
    async allFAQ(req, res) {
        //const productId = req.params.id
        try {
            const faq = await PFAQ.find({});
            res.status(200).json(faq);
        } catch (err) {
            console.log(err);
            if (err.name === "ValidationError")
                return res.status(400).send(`Validation Error: ${err.message}`);
            res.send(err.message);
        }
    }
}
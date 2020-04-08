const app = require('./app');

const port= process.env.PORT||3000
app.listen(port, function (req,res) {
    console.log("Server started on",port);
});
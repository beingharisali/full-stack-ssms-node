const mongoose = require("mongoose");

const agentSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    }


});

const agent= mongoose.model("Agent",
    agentSchema);
      
    module.exports = agent
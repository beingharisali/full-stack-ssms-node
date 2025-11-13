const mongoose = require('mongoose')
const ticketSchema =new mongoose.Schema({
    category:{
        type:String,
        required:[true,"please fill cartagory fields"] 
    },
    title:{
        type:String,
        required:[true, "Please fill title field"]
    },
    desc:{
        type:String,
        required:[true, "Please fill description field"]
    },
    price:{
        type:Number,
        required:[true, "Please fill price field"]
    },
    priority:{
        type:String,

        required:[true,"please fill priority fields"]
    },
    status:{
        type:String,
        required:[true,"please fill status fields"]
    },
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:[true,"please fill createdBy fields"]
    },
    assignedTo:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Agent",
        required:[true,"please fill assignedTo fields"]
    }
})
const ticketModel = mongoose.model('ticket', ticketSchema)
module.exports = ticketModel 
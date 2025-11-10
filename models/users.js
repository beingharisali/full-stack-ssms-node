const mongoose = require("mongoose");
const userSchema = mongoose.Schema({
    firstName:{
        type: String,
        required: true,
        minLength: 3,
    },
    lastName:{
        type: String,
        required:true,
        minLength:3,
    },
    email: {
        type: String,
        required:true,
        unique: true,
    },
    password:{
        type: String,
        required: true,
        minLength: 8,
    },
     role: {
      type: String,
      enum: ["admin", "agent", "client"],
      default: "client",
    },
}, 

);

const userModel = mongoose.model("user", userSchema);
module.exports = userModel;



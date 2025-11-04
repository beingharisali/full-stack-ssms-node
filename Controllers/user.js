const userModel = require("../models/users");
const bcrypt = require("bcryptjs");
const  jwt = require("jsonwebtoken");


const register = async (req, res) => {
    const { firstName, lastName,email, password, role } = req.body;
     if (!firstName || !lastName || !email || !password || !role) {
      return res.status(400).json({ success: false, msg: "All fields are required" });
    }
const isUserExist = await userModel.findOne({ email });
if (isUserExist) {
    return res.status(400).json({
        success:false,
        msg: "Email already exists, please use another emial",
    });
}

const hashedPassword = await bcrypt.hash(password, 10);
const  user = await userModel.create({
    firstName,
    lastName,
    email,
    password: hashedPassword,
    role,
})
const token = jwt.sign({ firstName, lastName,email, password, role }, process.env.jwt_SECRET);
    res.status(201).json({
        success:true,
        msg :"user register successfully",
    });
}
const login = async(req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, msg: "Email and password are required" });
    }
    const isUserExist = await userModel.findOne({email})
    if (!isUserExist) {
        return res.status(404).json({
            success:false,
            msg: "Email not found, please create account first"
        });
    }
     const comparePassword = await bcrypt.compare(password, isUserExist.password);
  if (!comparePassword) {
    return res.status(404).json({
      success: false,
      msg: "Invalid credentials",
    });
  }
    const token = jwt.sign({ email, password }, process.env.JWT_SECRET);
    res.status(200).json({
        success:true,
        msg:"user logged in successfully"
    });
}; 
module.exports = {register, login};



// const userModel = require("../models/users");
// const bcrypt = require("bcryptjs");
// const  jwt = require("jsonwebtoken");


// const register = async (req, res) => {
//     const { firstName, lastName,email, password, role } = req.body;
//      if (!firstName || !lastName || !email || !password || !role) {
//       return res.status(400).json({ success: false, msg: "All fields are required" });
//     }
// const isUserExist = await userModel.findOne({ email });
// if (isUserExist) {
//     return res.status(400).json({
//         success:false,
//         msg: "Email already exists, please use another emial",
//     });
// }

// const hashedPassword = await bcrypt.hash(password, 10);
// const  user = await userModel.create({
//     firstName,
//     lastName,
//     email,
//     password: hashedPassword,
//     role,
// })
// const token = jwt.sign({ firstName, lastName,email, password, role }, process.env.jwt_SECRET);
//     res.status(201).json({
//         success:true,
//         msg :"user register successfully",
//     });
// }
// const login = async(req, res) => {
//     const { email, password } = req.body;
//     if (!email || !password) {
//       return res.status(400).json({ success: false, msg: "Email and password are required" });
//     }
//     const isUserExist = await userModel.findOne({email})
//     if (!isUserExist) {
//         return res.status(404).json({
//             success:false,
//             msg: "Email not found, please create account first"
//         });
//     }
//      const comparePassword = await bcrypt.compare(password, isUserExist.password);
//   if (!comparePassword) {
//     return res.status(404).json({
//       success: false,
//       msg: "Invalid credentials",
//     });
//   }
//     const token = jwt.sign({ email, password }, process.env.JWT_SECRET);
//     res.status(200).json({
//         success:true,
//         msg:"user logged in successfully"
//     });
// }; 
// module.exports = {register, login};




require("dotenv").config();
const userModel = require("../models/users");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

console.log("Just testing")

//  REGISTER
const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password, role } = req.body;

    if (!firstName || !lastName || !email || !password || !role) {
      return res.status(400).json({ success: false, msg: "All fields are required" });
    }

    const isUserExist = await userModel.findOne({ email });
    if (isUserExist) {
      return res.status(400).json({
        success: false,
        msg: "Email already exists, please use another email",
      });
    }
    
    if (password.length <8 ){
  return res.status (400).json ({
    sucess :false,msg: "password must be 8 alphabet  "
  });
 }

    const hashedPassword = await bcrypt.hash(password, 8);

    const user = await userModel.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role,
    });

    
    
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(201).json({
      success: true,
      msg: "User registered successfully",
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, msg: "Server error", error: err.message });
  }
};

// LOGIN
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, msg: "Email and password are required" });
    }
 if (password.length <8 ){
  return res.status (400).json ({
    sucess :false,msg: "password must be 8 character "
  });
 }
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, msg: "Email not found" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ success: false, msg: "Invalid credentials" });
    }

    //  generate token
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      success: true,
      msg: "User logged in successfully",
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, msg: "Server error", error: err.message });
  }
};

module.exports = { register, login };

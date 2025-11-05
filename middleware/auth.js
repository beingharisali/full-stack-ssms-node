// const jwt = require("jsonwebtoken");
// const { UnauthenticatedError } = require("../errors");

// const auth = async (req, res, next) => {
//   const authHeader = req.headers.authorization;

//   if (!authHeader || !authHeader.startsWith("Bearer ")) {
//     throw new UnauthenticatedError("Authentication invalid");
//   }

//   const token = authHeader.split(" ")[1];

//   try {
//     const payload = jwt.verify(token, process.env.JWT_SECRET);

//     req.user = {
//       userId: payload.userId,
//       name: payload.name,
//       role: payload.role,
//       email: payload.email,
//     };

//     next();
//   } catch (error) {
//     throw new UnauthenticatedError("Authentication invalid");
//   }
// };

// module.exports = auth;


// const jwt = require(`jsonwebtoken`);
// const JWT_SECRET = process.env.JWT_SECRET || '';
//  function authenticateJWT(req,res,next) {
//   const authHeader = req.header.authorization;
   
//   if (!authHeader) {
//     return res.status(401).json({message: 'Authorization header missing' })
//   }

//  const token = authHeader.split(' ')[1];
//  if(!token) {
//   return res.status(401).json({ message: 'Token missing'});
//  }
//  try {
//   const decoded = jwt.verify(token, JWT_SECRET);
//   req.user = decoded;
//   next();

//  }catch(error) {
//   return res.status(403).json({ message: 'Invalid or expired token' })
//  }
//  }
// function authorizeRoles(...roles){
//   return (req, res, next) => {
//     if (!req.user) {
//       return res.status(401).json({ message: 'Not authenticated' });
//     }

//     if (!roles.includes(req.user.role)) {
//       return res.status(403).json({ message: 'Access denied: insufficient role' });
//     }

//     next();
//   };
// }
// module.export = { authenticateJWT, authorizeRoles };


// middleware/auth.js
require("dotenv").config();
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

// ✅ Middleware: verify JWT token
const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Example header: "Authorization: Bearer <token>"
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, msg: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // attach decoded user info to request
    next();
  } catch (err) {
    return res.status(403).json({ success: false, msg: "Invalid or expired token" });
  }
};

//  Optional: Role-based protection
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ success: false, msg: "Access denied: insufficient role" });
    }
    next();
  };
};

module.exports = { authenticateJWT, authorizeRoles };

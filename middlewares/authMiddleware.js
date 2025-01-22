const jwt = require("jsonwebtoken");
require("dotenv").config();

// Token middleware
const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    console.log("Raw Authorization Header:", authHeader);

    if (!authHeader) {
      return res.status(401).json({ message: "No Authorization Header" });
    }

    // Split the header and take the last token (in case of multiple)
    const tokenParts = authHeader.split(",");
    const lastTokenPart = tokenParts[tokenParts.length - 1].trim();

    // Extract token, removing "Bearer " prefix
    const token = lastTokenPart.replace(/^Bearer\s+/i, '');
    console.log("Extracted Token:", token);

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error("Token Verification Error:", error.message);
    return res.status(403).json({ 
      message: "Token Verification Failed",
      errorType: error.name,
      errorDetails: error.message 
    });
  }
};

module.exports = verifyToken;
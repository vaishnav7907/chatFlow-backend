const jwt = require("jsonwebtoken");




const settingMidleware = async (req, res, next) => {
  const getauthorization = req.headers.authorization;
  console.log("get authorizatiion:",getauthorization);
  
  if (!getauthorization) {
    return res.status(403).json({ message: "token required" });
  }

  const gettoken = getauthorization.split(" ")[1];

  console.log("gettoken : ", gettoken);
  console.log("JWT_SECRET SIGN:", process.env.JWT_SECRET);
  try {
    const decoded = jwt.verify(gettoken, process.env.JWT_SECRET);
  

    req.user = decoded;

    console.log("decoded:", decoded);
    next();
  } catch (error) {
    console.log("error anu mone", error);
    res.status(401).json({ message: "token error" });
  }
};

module.exports = settingMidleware;

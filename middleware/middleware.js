const jwt = require("jsonwebtoken");

const settingMidleware = async (req, res, next) => {
  const getauthorization = req.headers.authorization;
  if (!getauthorization) {
    return res.status(403).json({ message: "token required" });
  }

  const getToken = getauthorization.split(" ")[1] 

  console.log("gettoken : ",getToken);


  try {
    const decoded = jwt.verify(getToken,process.env.JWT_SECRETE_CODE)
    req.user=decoded

    console.log("decoded:",decoded);
    next()
  } catch (error) {
     console.log("error anu mone",error);
    res.status(401).json({message:"token error"})
  }
  
};

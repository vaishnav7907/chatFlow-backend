const usermodel = require("../model/authentication");
const bcrypt = require("bcrypt");
const jwtoken = require("jsonwebtoken");




const signup = async (req, res) => {
  try {
    const { Email, Username, Password } = req.body;

    const isemailExist = await usermodel.findOne({ Email });

    if (isemailExist) {
      return res.status(409).json({ message: " already exist" });
    }

    const hashedpassword = await bcrypt.hash(Password, 10);

    const createuser = await usermodel.create({
      Email,
      Username,
      Password: hashedpassword,
    });

    res.json({ message: "signup successfull", data: createuser });
  } catch (error) {
    console.log("signup error", error);
    res.status(500).json({ message: error });
  }
};

const signIn = async (req, res) => {
  try {
    const { Email, Password } = req.body;

    const emailexistt = await usermodel.findOne({ Email });

    if (!emailexistt) {
      return res.json({ message: " Invalid Email " });
    }

    const passexist = await bcrypt.compare(Password, emailexistt.Password);

    if (!passexist) {
      return res.json({ message: " Invalid Password " });
    }

    const token = jwtoken.sign(
      { id: emailexistt._id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
    );
    
  console.log("SIGN SECRET:", process.env.JWT_SECRET);
  
     res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: emailexistt.id,
        Email: emailexistt.Email,
        Password:emailexistt.Password
      },
    });
  } catch (error) {
    console.log("LOGIN ERROR:", error);
    res.status(500).json({ message: error });
  }
};

module.exports = { signup , signIn };

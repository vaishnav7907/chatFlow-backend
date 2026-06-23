const usermodel = require("../model/authentication");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const signup = async (req, res) => {
  try {
    const { Email, Username, Password } = req.body;

    const exists = await usermodel.findOne({ Email });
    if (exists) {
      return res.status(409).json({ message: "already exist" });
    }

    const usernameExist = await usermodel.findOne({ Username });
    if (usernameExist) {
      return res.status(409).json({ message: "username already exist" });
    }
    const hashed = await bcrypt.hash(Password, 10);

    const user = await usermodel.create({
      Email,
      Username,
      Password: hashed,
    });

    res.status(201).json({ message: "signup success", data: user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const signIn = async (req, res) => {
  try {
    const { Email, Password } = req.body;

    const user = await usermodel.findOne({ Email });

    if (!user) {
      return res.status(400).json({ message: "invalid email" });
    }

    const match = await bcrypt.compare(Password, user.Password);

    if (!match) {
      return res.status(400).json({ message: "invalid password" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({
      message: "login success",
      token,
      user: {
        id: user._id,
        Email: user.Email,
        Username: user.Username,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const dltcontact = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await usermodel.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "contact not found" });
    }

    res.status(200).json({
      message: "contact deleted successfully",
      data: deleted,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

const searchUser = async (req,res) => {
  try {
    const search = req.query.search?.trim();
    const allusers = await usermodel.find({
      Username: {
        $regex: search,
        $options: "i",
      },
    });

    res.status(200).json(allusers);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
module.exports = { signup, signIn, dltcontact, searchUser };

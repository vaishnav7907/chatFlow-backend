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

const updateprofile = async (req, res) => {
  try {
    const userid = req.params.id;
    const { Email, Username } = req.body;

    if (!userid) {
      return res.json({ message: "user id didnt exist" });
    }


    // checking email is exist 
    if (Email) {
      const emailexist = await usermodel.findOne({
        Email,
        _id: { $ne: userid },
      });

      if (emailexist) {
        return res.status(400).json({
          message: "Email already exists",
        });
      }
    }


    // checking username is exist


    
    if (Username) {
      const usernameExist = await usermodel.findOne({
        Username,
        _id: { $ne: userid },   //  $ne is a mongodb query. here $ne used to comparison   it checks  userid and username in one oject in mongodb. if find all includes in one object responce become username already exist
      });

      if (usernameExist) {
        return res.status(400).json({
          message: "Username already exists",
        });
      }
    }

    //update object . it creates for when we do like await usermodel.findByIdAndUpdate(userid, { Email, Username,},{new:true}); when i update one otherwill be become undefined, exakple i update email , username become undefined. when we use this object when email update otherone cannot be undefined .
  const updateData={}
  
  if(Email)updateData.Email=Email
  if(Username)updateData.Username=Username

  //update user

  const updateUserInfo= await usermodel.findByIdAndUpdate(userid,updateData,{new:true})

    res.json({ message: " profile updated successfully ", data: updateUserInfo });
  } catch (error) {
    console.log("error in update profile", error);
    res.status(500).json({
      message: error.message,
    });
  }
};

const searchUser = async (req, res) => {
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
module.exports = { signup, signIn, dltcontact, searchUser, updateprofile };

// const cloudinary = require("../cloudinaryConfig/cloudinary");
const cloudinary= require("../cloudinaryConfig/cloudinary")
const usermodel = require("../model/authentication");
const streamifier = require("streamifier");

const uploadProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "select an image" });
    }

    const uploadImageResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "ChatFlow/ProfileImages",
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        },
      );
      streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
    });

    const user = await usermodel.findById(req.user.id);
    user.ProfileImage = uploadImageResult.secure_url;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile image uploaded successfully.",
      profileImg: user.ProfileImage,
    });
  } catch (error) {
    console.error("Upload Error:", error);

    res.status(500).json({
      success: false,
      message: "Something went wrong in uploading image to cloudinary.",
    });
  }
};

const getProfileImage = async (req, res) => {
  try {
    const user = await usermodel.findById(req.user.id).select("-Password");
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "user not found" });
    }

    res.status(200).json({ success: true, profileImg: user.ProfileImage });
  } catch (error) {
    console.error("Get Profile Image Error:", error);

    res.status(500).json({
      success: false,
      message: "Something went wrong while fetching profile image.",
    });
  }
};
module.exports = {uploadProfileImage,getProfileImage};

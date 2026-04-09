import bcrypt from "bcryptjs";
import cloudinary from "cloudinary";
import User from "../models/userModel.js";

const cloudinaryConfigReady =
  !!process.env.CLOUDINARY_CLOUD_NAME &&
  !!process.env.CLOUDINARY_API_KEY &&
  !!process.env.CLOUDINARY_API_SECRET;

if (cloudinaryConfigReady) {
  cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

const uploadAvatar = async (fileBuffer) => {
  if (!cloudinaryConfigReady) {
    return {
      public_id: "",
      secure_url: "",
    };
  }

  return new Promise((resolve, reject) => {
    const stream = cloudinary.v2.uploader.upload_stream(
      {
        folder: "avatars",
        allowed_formats: ["jpg", "png", "jpeg", "webp"],
        transformation: [
          { width: 300, height: 300, crop: "fill", gravity: "face" },
        ],
      },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(result);
      },
    );

    stream.end(fileBuffer);
  });
};

export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const fieldsToUpdate = {};

    if (req.body.name) {
      fieldsToUpdate.name = req.body.name;
    }

    if (req.body.profileData && typeof req.body.profileData === "object") {
      fieldsToUpdate.profileData = {
        ...user.profileData,
        ...req.body.profileData,
      };
    }

    if (req.file && req.file.buffer) {
      if (user.avatar && user.avatar.public_id && cloudinaryConfigReady) {
        await cloudinary.v2.uploader.destroy(user.avatar.public_id);
      }

      const result = await uploadAvatar(req.file.buffer);

      fieldsToUpdate.avatar = {
        public_id: result.public_id,
        url: result.secure_url,
      };
    }

    if (Object.keys(fieldsToUpdate).length === 0) {
      return res.status(400).json({ message: "Nothing to update" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      fieldsToUpdate,
      {
        new: true,
        runValidators: true,
      },
    ).select("-password");

    return res.status(200).json({
      success: true,
      data: updatedUser,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        message: "currentPassword and newPassword are required",
      });
    }

    const user = await User.findById(req.user.id).select("+password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Password is incorrect" });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    return res.status(200).json({
      success: true,
      data: "Password updated successfully",
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const deductToken = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role !== "user") {
      return res.status(403).json({
        message: "Only users can consume tokens",
      });
    }

    const currentTokens = Number(user.token ?? 0);
    if (currentTokens <= 0) {
      return res.status(400).json({ message: "Insufficient tokens" });
    }

    user.token = currentTokens - 1;
    await user.save();

    return res.status(200).json({
      success: true,
      token: user.token,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
